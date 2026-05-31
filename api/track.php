<?php
/**
 * NurdiansyahLabs – Visitor Tracking & Analytics API
 * Deployed at: /public_html/api/track.php
 * 
 * Silently stores analytics payloads (page views, events) into the MySQL database.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/../database/db.php';
$pdo = getDB();

// ── SQLite Real-Time State (for SSE stream.php) ───────────────────────────────
function writeRealtimeSQLite(string $path, string $visitorHash): void {
    $cacheDir = __DIR__ . '/cache';
    $dbPath   = $cacheDir . '/ai_cache.sqlite';
    if (!is_dir($cacheDir)) mkdir($cacheDir, 0755, true);
    try {
        $db = new SQLite3($dbPath);
        $db->exec('CREATE TABLE IF NOT EXISTS realtime_visitors (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            visitor_hash TEXT,
            path         TEXT,
            last_seen    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )');
        $stmt = $db->prepare('INSERT INTO realtime_visitors (visitor_hash, path, last_seen) VALUES (:vh, :p, :t)');
        $stmt->bindValue(':vh', $visitorHash);
        $stmt->bindValue(':p',  $path);
        $stmt->bindValue(':t',  date('Y-m-d H:i:s'));
        $stmt->execute();
        // Keep table lean — delete rows older than 24h
        $db->exec("DELETE FROM realtime_visitors WHERE last_seen < datetime('now', '-24 hours')");
        $db->close();
    } catch (Exception $e) { /* Silent fail — never break main track flow */ }
}


// Read JSON payload
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON payload']);
    exit;
}

// ── Sanitize Input & IP ──────────────────────────────────────────────────────
// Hash IP address for privacy while retaining uniqueness
$rawIp = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
$hashedIp = substr(hash('sha256', $rawIp . 'NURDIANSYAH_SECRET_SALT'), 0, 16);

$type = substr(trim($input['type'] ?? 'unknown'), 0, 50);
$path = substr(trim($input['path'] ?? '/'), 0, 500);
// Re-format legacy slug payload into 'route' or 'path' if needed by the frontend format
$route = substr(trim($input['slug'] ?? ''), 0, 500);
$duration = (int) ($input['duration'] ?? 0);
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
$title = substr(trim($input['title'] ?? ''), 0, 255);
$service = substr(trim($input['service'] ?? ''), 0, 100);
$timestamp = date('Y-m-d H:i:s'); // DB format DATETIME

$sql = "INSERT INTO analytics (type, path, visitorId, timestamp, title, service, duration, route, userAgent)
        VALUES (:type, :path, :visitorId, :timestamp, :title, :service, :duration, :route, :userAgent)";

$stmt = $pdo->prepare($sql);
$success = $stmt->execute([
    'type' => $type,
    'path' => $path,
    'visitorId' => $hashedIp,
    'timestamp' => $timestamp,
    'title' => $title,
    'service' => $service,
    'duration' => $duration,
    'route' => $route,
    'userAgent' => $userAgent
]);

if (!$success) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to log event into database']);
    exit;
}

// Dual-write to SQLite for real-time SSE dashboard (non-blocking, silent fail)
writeRealtimeSQLite($path, $hashedIp);

http_response_code(200);
echo json_encode(['status' => 'logged']);
exit;

