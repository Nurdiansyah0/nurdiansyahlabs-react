<?php
/**
 * NurdiansyahLabs – System Health & Watchdog API
 * Deployed at: /public_html/api/health.php
 *
 * Called by cPanel Cron Job every 5 minutes.
 * Checks: MySQL connectivity, SQLite cache, Python runtime.
 * 
 * If 3 consecutive failures detected → fires Telegram alert.
 *
 * Cron job (set in cPanel):
 *   * /5 * * * * curl -s "https://nurdiansyahlabs.com/api/health.php?key=nurdiansyah-health-2026" > /dev/null 2>&1
 */

header('Content-Type: application/json');

// ── Auth ─────────────────────────────────────────────────────────────────────
$SECRET = 'nurdiansyah-health-2026';
if (isset($_GET['key']) && $_GET['key'] !== $SECRET) {
    http_response_code(403);
    echo json_encode(['error' => 'Forbidden']);
    exit;
}

$startTime = microtime(true);
$results   = [];
$allOk     = true;

// ── 1. MySQL Connectivity ──────────────────────────────────────────────────
try {
    require_once __DIR__ . '/../database/db.php';
    $pdo = getDB();
    if (!$pdo) throw new Exception("Database connection failed");
    $pdo->query('SELECT 1');
    $results['mysql'] = ['status' => 'ok'];
} catch (Exception $e) {
    $results['mysql'] = ['status' => 'fail', 'error' => $e->getMessage()];
    $allOk = false;
}

// ── 2. SQLite Cache Writeable ─────────────────────────────────────────────
$cacheDir = __DIR__ . '/cache';
$sqliteDb = $cacheDir . '/ai_cache.sqlite';
try {
    if (!is_dir($cacheDir)) mkdir($cacheDir, 0755, true);
    $db = new SQLite3($sqliteDb);
    $db->exec('CREATE TABLE IF NOT EXISTS _health_ping (ts TEXT)');
    $db->exec("INSERT INTO _health_ping VALUES ('" . date('Y-m-d H:i:s') . "')");
    $db->exec("DELETE FROM _health_ping WHERE ts < datetime('now', '-1 hour')");
    $db->close();
    $results['sqlite'] = ['status' => 'ok', 'path' => $sqliteDb];
} catch (Exception $e) {
    $results['sqlite'] = ['status' => 'fail', 'error' => $e->getMessage()];
    $allOk = false;
}

// ── 3. Python Runtime Available ───────────────────────────────────────────
$pythonCheck = shell_exec('python3 --version 2>&1');
if ($pythonCheck && strpos($pythonCheck, 'Python') !== false) {
    $results['python'] = ['status' => 'ok', 'version' => trim($pythonCheck)];
} else {
    $results['python'] = ['status' => 'fail', 'error' => 'python3 not found in PATH'];
    $allOk = false;
}

// ── 4. Track Failure Count in SQLite (Self-Healing Logic) ────────────────
$FAILURE_THRESHOLD = 3;
$TELEGRAM_BOT_TOKEN = getenv('TELEGRAM_BOT_TOKEN') ?: '';
$TELEGRAM_CHAT_ID   = getenv('TELEGRAM_CHAT_ID')   ?: '';

$failCountPath = $cacheDir . '/health_failures.txt';
$currentFails  = file_exists($failCountPath) ? (int) file_get_contents($failCountPath) : 0;

if (!$allOk) {
    $currentFails++;
    file_put_contents($failCountPath, $currentFails);

    if ($currentFails >= $FAILURE_THRESHOLD && $TELEGRAM_BOT_TOKEN && $TELEGRAM_CHAT_ID) {
        // Fire Telegram alert
        $message = urlencode("🚨 *NurdiansyahLabs ALERT*\n\nHealth check failed {$currentFails}x in a row!\n\n" . json_encode($results, JSON_PRETTY_PRINT));
        @file_get_contents("https://api.telegram.org/bot{$TELEGRAM_BOT_TOKEN}/sendMessage?chat_id={$TELEGRAM_CHAT_ID}&text={$message}&parse_mode=Markdown");
    }
} else {
    // Reset failure counter on success
    if (file_exists($failCountPath)) unlink($failCountPath);
    $currentFails = 0;
}

// ── Response ───────────────────────────────────────────────────────────────
$elapsed = round((microtime(true) - $startTime) * 1000, 2);
http_response_code($allOk ? 200 : 503);
echo json_encode([
    'status'          => $allOk ? 'healthy' : 'degraded',
    'timestamp'       => date('c'),
    'response_ms'     => $elapsed,
    'consecutive_fails' => $currentFails,
    'checks'          => $results,
    'version'         => '2.0.0-nurdiansyahlabs',
]);
exit;
