<?php
/**
 * api/recommend.php — PHP Bridge to RecoEngine ML System
 * =======================================================
 * Dual-mode: automatically picks the best available execution method.
 *
 * MODE 1 — FastAPI (dev / VPS):
 *   Checks if Python FastAPI service is running on port 8001.
 *   If alive → proxies the request via cURL. Best performance.
 *
 * MODE 2 — Serverless proc_open (cPanel shared hosting):
 *   If FastAPI is offline → PHP auto-triggers ml_compute.py
 *   as a subprocess via proc_open(). No manual server start needed.
 *   Python is spawned per-request and exits after returning JSON.
 *
 * The frontend never knows which mode is active.
 * On cPanel: ZERO manual steps required. It just works.
 */

error_reporting(0);
ini_set('display_errors', 0);

// ── Security Headers ──────────────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── Configuration ─────────────────────────────────────────────────────────────
define('ML_SERVICE_URL', getenv('ML_SERVICE_URL') ?: 'http://127.0.0.1:8001');
define('ML_TIMEOUT_SECS', 8);
define('ML_COMPUTE_SCRIPT', __DIR__ . '/ml_compute.py');
// cPanel Python path — adjust if your host uses a different python3 path
define('PYTHON_BIN', getenv('PYTHON_BIN') ?: (file_exists('/usr/bin/python3') ? '/usr/bin/python3' : 'python3'));

// ── Whitelist allowed actions ──────────────────────────────────────────────────
$allowed_actions = ['health', 'products', 'categories', 'users', 'recommend', 'feedback', 'explain'];
$action = preg_replace('/[^a-z_]/', '', strtolower($_GET['action'] ?? 'health'));

if (!in_array($action, $allowed_actions, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action. Allowed: ' . implode(', ', $allowed_actions)]);
    exit;
}

$http_method = $_SERVER['REQUEST_METHOD'];

// ── Build the request payload that both modes will receive ────────────────────
$payload = [];

switch ($action) {
    case 'health':
    case 'categories':
    case 'users':
        $payload = ['action' => $action];
        break;

    case 'products':
        $payload = [
            'action' => 'products',
            'category' => preg_replace('/[^a-zA-Z0-9 &\-]/', '', $_GET['category'] ?? ''),
            'limit' => (int) min(50, max(1, $_GET['limit'] ?? 50)),
        ];
        break;

    case 'recommend':
        if ($http_method !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'POST required']);
            exit;
        }
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        if (!is_array($data)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON']);
            exit;
        }
        $payload = [
            'action' => 'recommend',
            'user_id' => substr(preg_replace('/[^A-Z0-9]/', '', strtoupper($data['user_id'] ?? 'U001')), 0, 10),
            'limit' => (int) min(20, max(1, $data['limit'] ?? 8)),
            'method' => in_array($data['method'] ?? 'hybrid', ['hybrid', 'collaborative', 'content']) ? $data['method'] : 'hybrid',
            'exclude_seen' => (bool) ($data['exclude_seen'] ?? true),
            'category_filter' => !empty($data['category_filter']) ? substr(htmlspecialchars($data['category_filter']), 0, 60) : null,
        ];
        break;

    case 'feedback':
        if ($http_method !== 'POST') {
            http_response_code(405);
            echo json_encode(['error' => 'POST required']);
            exit;
        }
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        $payload = [
            'action' => 'feedback',
            'user_id' => substr(preg_replace('/[^A-Z0-9]/', '', strtoupper($data['user_id'] ?? 'U001')), 0, 10),
            'product_id' => (int) ($data['product_id'] ?? 0),
            'feedback' => in_array($data['feedback'] ?? '', ['like', 'dislike', 'view']) ? $data['feedback'] : 'view',
        ];
        break;

    case 'explain':
        $payload = [
            'action' => 'explain',
            'product_id' => (int) min(50, max(1, $_GET['product_id'] ?? 1)),
            'user_id' => substr(preg_replace('/[^A-Z0-9]/', '', strtoupper($_GET['user_id'] ?? 'U001')), 0, 10),
        ];
        break;
}

// ── MODE 1: Try FastAPI service first ─────────────────────────────────────────
$fastapi_online = test_fastapi_health();

if ($fastapi_online) {
    echo route_to_fastapi($action, $payload, $http_method);
    exit;
}

// ── MODE 2: Fallback → proc_open() to ml_compute.py ──────────────────────────
echo route_to_python_subprocess($payload);
exit;


// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Quick HEAD-like check: is the FastAPI process listening on port 8001?
 * Uses a 0.5s timeout so it never hangs the request.
 */
function test_fastapi_health(): bool
{
    $sock = @fsockopen('127.0.0.1', 8001, $errno, $errstr, 0.5);
    if ($sock) {
        fclose($sock);
        return true;
    }
    return false;
}

/**
 * Route a request to the FastAPI service via cURL.
 */
function route_to_fastapi(string $action, array $payload, string $method): string
{
    $base = ML_SERVICE_URL;

    // Map action → FastAPI URL
    switch ($action) {
        case 'health':
            $url = "$base/health";
            $method = 'GET';
            break;
        case 'products':
            $url = "$base/products?" . http_build_query(array_filter(['category' => $payload['category'] ?? '', 'limit' => $payload['limit'] ?? 50]));
            $method = 'GET';
            break;
        case 'categories':
            $url = "$base/categories";
            $method = 'GET';
            break;
        case 'users':
            $url = "$base/users";
            $method = 'GET';
            break;
        case 'recommend':
            $url = "$base/recommend";
            $method = 'POST';
            break;
        case 'feedback':
            $url = "$base/feedback";
            $method = 'POST';
            break;
        case 'explain':
            $url = "$base/explain/{$payload['product_id']}?user_id={$payload['user_id']}";
            $method = 'GET';
            break;
        default:
            return json_encode(['error' => 'Unknown action']);
    }

    $ch = curl_init($url);
    $opts = [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => ML_TIMEOUT_SECS,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_SSL_VERIFYPEER => false,
    ];
    if ($method === 'POST') {
        $opts[CURLOPT_POST] = true;
        $opts[CURLOPT_POSTFIELDS] = json_encode($payload);
        $opts[CURLOPT_HTTPHEADER] = ['Content-Type: application/json', 'Accept: application/json'];
    } else {
        $opts[CURLOPT_HTTPHEADER] = ['Accept: application/json'];
    }
    curl_setopt_array($ch, $opts);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    http_response_code($code ?: 200);
    return $body ?: json_encode(['error' => 'FastAPI returned empty response']);
}

/**
 * Spawn ml_compute.py as a subprocess via proc_open().
 * PHP writes the JSON request to stdin, reads JSON from stdout.
 * This is the "trigger from frontend" mode for cPanel shared hosting.
 */
function route_to_python_subprocess(array $payload): string
{
    $script = ML_COMPUTE_SCRIPT;

    if (!file_exists($script)) {
        return json_encode([
            'error' => 'ml_compute.py not found',
            'detail' => 'Expected at: ' . $script,
        ]);
    }

    $python = PYTHON_BIN;
    $cmd = escapeshellcmd("$python " . escapeshellarg($script));

    $desc = [
        0 => ['pipe', 'r'],  // stdin
        1 => ['pipe', 'w'],  // stdout
        2 => ['pipe', 'w'],  // stderr
    ];

    $proc = proc_open($cmd, $desc, $pipes);

    if (!is_resource($proc)) {
        return json_encode([
            'error' => 'Failed to start Python subprocess',
            'detail' => "Could not exec: $cmd — check PYTHON_BIN env var or verify python3 is in PATH",
        ]);
    }

    // Write request JSON and close stdin (signals EOF to Python)
    fwrite($pipes[0], json_encode($payload));
    fclose($pipes[0]);

    // Read JSON output
    $output = stream_get_contents($pipes[1]);
    fclose($pipes[1]);

    // Log any Python errors to PHP error log (never exposed to client)
    $stderr = stream_get_contents($pipes[2]);
    if ($stderr) {
        error_log("[ml_compute] $stderr");
    }
    fclose($pipes[2]);

    $exit_code = proc_close($proc);

    if ($exit_code !== 0 || empty($output)) {
        return json_encode([
            'error' => 'Python ML computation failed',
            'detail' => 'Exit code ' . $exit_code . '. Check server Python availability.',
        ]);
    }

    return $output;
}
