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
 *
 * MODE 3 — SQL Lite Fallback (Container / Limited Env):
 *   If Python is missing, uses basic SQL-like logic to provide results.
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

// Robust Python detection
function get_python_binary()
{
    if (getenv('PYTHON_BIN'))
        return getenv('PYTHON_BIN');

    // Try 'which' command first
    $which = @shell_exec('which python3 2>/dev/null');
    if ($which && trim($which))
        return trim($which);

    // Check common paths
    foreach (['/usr/bin/python3', '/usr/local/bin/python3', '/usr/bin/python'] as $path) {
        if (@file_exists($path))
            return $path;
    }

    return 'python3'; // Final fallback
}
define('PYTHON_BIN', get_python_binary());

// ── Whitelist allowed actions ──────────────────────────────────────────────────
$allowed_actions = ['health', 'products', 'categories', 'users', 'recommend', 'feedback', 'explain'];
$action = preg_replace('/[^a-z_]/', '', strtolower($_GET['action'] ?? 'health'));

if (!in_array($action, $allowed_actions, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid action. Allowed: ' . implode(', ', $allowed_actions)]);
    exit;
}

$http_method = $_SERVER['REQUEST_METHOD'];

// ── Build the request payload ─────────────────────────────────────────────────
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

// ── MODE 2: Try proc_open() fallback ──────────────────────────────────────────
$python_output = route_to_python_subprocess($payload);
$python_data = json_decode($python_output, true);

if ($python_output && !isset($python_data['error'])) {
    echo $python_output;
    exit;
}

// ── MODE 3: Graceful Degradation → Basic Lite Engine ──────────────────────────
echo route_to_sql_fallback($action, $payload);
exit;


// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function test_fastapi_health(): bool
{
    $sock = @fsockopen('127.0.0.1', 8001, $errno, $errstr, 0.5);
    if ($sock) {
        fclose($sock);
        return true;
    }
    return false;
}

function route_to_fastapi(string $action, array $payload, string $method): string
{
    $base = ML_SERVICE_URL;

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

function route_to_python_subprocess(array $payload): string
{
    $script = ML_COMPUTE_SCRIPT;
    if (!file_exists($script))
        return json_encode(['error' => 'ml_compute.py not found']);

    $python = PYTHON_BIN;
    $cmd = $python . ' ' . escapeshellarg($script);

    $desc = [0 => ['pipe', 'r'], 1 => ['pipe', 'w'], 2 => ['pipe', 'w']];
    $proc = proc_open($cmd, $desc, $pipes);

    if (!is_resource($proc))
        return json_encode(['error' => 'Python exec failed']);

    fwrite($pipes[0], json_encode($payload));
    fclose($pipes[0]);

    $output = stream_get_contents($pipes[1]);
    fclose($pipes[1]);
    fclose($pipes[2]);
    proc_close($proc);

    return $output;
}

function route_to_sql_fallback(string $action, array $payload): string
{
    $products = [
        ["id" => 1, "name" => "MacBook Pro M3", "category" => "Laptop", "brand" => "Apple", "price" => 28000000, "rating" => 4.9, "sold" => 1200, "tags" => "laptop"],
        ["id" => 4, "name" => "iPhone 15 Pro", "category" => "Smartphone", "brand" => "Apple", "price" => 23000000, "rating" => 4.8, "sold" => 3200, "tags" => "smartphone"],
        ["id" => 7, "name" => "Sony WH-1000XM5", "category" => "Audio", "brand" => "Sony", "price" => 5500000, "rating" => 4.9, "sold" => 2100, "tags" => "audio"],
        ["id" => 40, "name" => "Atomic Habits", "category" => "Buku", "brand" => "Avery", "price" => 109000, "rating" => 4.9, "sold" => 9800, "tags" => "productivity"],
    ];

    switch ($action) {
        case 'health':
            return json_encode([
                "status" => "ok",
                "service" => "RecoEngine-Lite (Fallback)",
                "detail" => "Python missing; using internal logic.",
                "model" => "Smart Affinity"
            ]);
        case 'recommend':
            $uid = $payload['user_id'] ?? 'U001';
            $data = array_map(function ($p) use ($uid) {
                $score = ($p['rating'] / 5) * 0.7;
                if ($p['category'] === 'Buku' && $uid === 'U001')
                    $score += 0.3;
                return array_merge($p, [
                    'score' => round($score, 4),
                    'reason' => "Populer di kategori " . $p['category'] . " (Lite Mode)",
                    'method_used' => 'lite-engine'
                ]);
            }, $products);
            usort($data, function ($a, $b) {
                return $b['score'] <=> $a['score']; });
            return json_encode([
                "status" => "success",
                "user_id" => $uid,
                "method" => "lite-engine",
                "data" => array_slice($data, 0, $payload['limit'] ?? 8)
            ]);
        default:
            return json_encode(["status" => "success", "data" => $products]);
    }
}
