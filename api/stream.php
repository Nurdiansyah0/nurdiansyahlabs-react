<?php
/**
 * NurdiansyahLabs – PHP Server-Sent Events (SSE) Real-Time Stream
 * Deployed at: /public_html/api/stream.php
 *
 * Delivers live visitor analytics to React without WebSocket or Node.js.
 * Uses SQLite for fast in-process state sharing with track.php.
 *
 * Browser-side usage:
 *   const es = new EventSource('/api/stream.php');
 *   es.addEventListener('analytics', (e) => console.log(JSON.parse(e.data)));
 */

// ── Headers for SSE ──────────────────────────────────────────────────────────
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('X-Accel-Buffering: no');        // Disable Nginx buffering (if any)
header('Access-Control-Allow-Origin: *');

// Close PHP session immediately — CRITICAL: prevents Apache thread lock
if (session_status() === PHP_SESSION_ACTIVE) {
    session_write_close();
}

// Disable output buffering
if (ob_get_level()) ob_end_clean();

// ── SQLite State Store (shared with track.php) ───────────────────────────────
$cacheDir = __DIR__ . '/cache';
$sqliteDb  = $cacheDir . '/ai_cache.sqlite';

function getRealtimeStats(string $dbPath): array {
    if (!file_exists($dbPath)) {
        return ['active_now' => 0, 'pageviews_today' => 0, 'top_pages' => []];
    }
    try {
        $db = new SQLite3($dbPath, SQLITE3_OPEN_READONLY);

        // Active visitors in the last 2 minutes
        $cutoff = date('Y-m-d H:i:s', time() - 120);
        $activeStmt = $db->prepare("SELECT COUNT(DISTINCT visitor_hash) FROM realtime_visitors WHERE last_seen > :cutoff");
        $activeStmt->bindValue(':cutoff', $cutoff);
        $activeResult = $activeStmt->execute();
        $activeNow = (int) ($activeResult ? $activeResult->fetchArray(SQLITE3_NUM)[0] : 0);

        // Pageviews today
        $today = date('Y-m-d');
        $pvStmt = $db->prepare("SELECT COUNT(*) FROM realtime_visitors WHERE DATE(last_seen) = :today");
        $pvStmt->bindValue(':today', $today);
        $pvResult = $pvStmt->execute();
        $pageviewsToday = (int) ($pvResult ? $pvResult->fetchArray(SQLITE3_NUM)[0] : 0);

        // Top 5 pages right now
        $topStmt = $db->query("
            SELECT path, COUNT(*) as cnt
            FROM realtime_visitors
            WHERE last_seen > datetime('now', '-30 minutes')
            GROUP BY path ORDER BY cnt DESC LIMIT 5
        ");
        $topPages = [];
        while ($row = $topStmt->fetchArray(SQLITE3_ASSOC)) {
            $topPages[] = $row;
        }

        $db->close();
        return ['active_now' => $activeNow, 'pageviews_today' => $pageviewsToday, 'top_pages' => $topPages];
    } catch (Exception $e) {
        return ['active_now' => 0, 'pageviews_today' => 0, 'top_pages' => []];
    }
}

// ── SSE Loop (max 60 iterations ~2 min to avoid cPanel LVE process limit) ───
$iterations = 0;
$maxIterations = 60;

while ($iterations < $maxIterations) {
    // Check if client disconnected
    if (connection_aborted()) {
        break;
    }

    $stats = getRealtimeStats($sqliteDb);
    $payload = json_encode([
        'timestamp'      => time(),
        'active_now'     => $stats['active_now'],
        'pageviews_today'=> $stats['pageviews_today'],
        'top_pages'      => $stats['top_pages'],
    ]);

    // SSE format: event name + data
    echo "event: analytics\n";
    echo "data: {$payload}\n\n";

    // Flush to browser immediately
    flush();

    $iterations++;
    sleep(2);
}

// Send a reconnect hint when loop ends (browser auto-reconnects)
echo "event: reconnect\n";
echo "data: {\"message\":\"stream_refresh\"}\n\n";
flush();
