<?php
/**
 * NurdiansyahLabs – Secure Analytics Aggregator
 * Deployed at: /public_html/api/analytics.php
 * 
 * Aggregates charts and KPIs directly from the high-performance MySQL database.
 */

header('Content-Type: application/json');
require_once __DIR__ . '/cors.php';
setCorsHeaders(['GET', 'OPTIONS']);

// Preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── Database-Backed Authentication ───────────────────────────────────────────
require_once __DIR__ . '/auth_middleware.php';
require_once __DIR__ . '/../database/db.php';
$pdo = getDB();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

verifyAdminToken($pdo);

try {
    // ── High-Performance SQL Aggregations ────────────────────────────────────

    // 1. Total Views
    $stmt = $pdo->query("SELECT COUNT(*) FROM analytics WHERE type = 'pageview'");
    $totalViews = (int) $stmt->fetchColumn();

    // 2. Unique Visitors
    // Count distinct visitors across all recorded events
    $stmt = $pdo->query("SELECT COUNT(DISTINCT visitorId) FROM analytics");
    $uniqueVisitors = (int) $stmt->fetchColumn();

    // 3. Total Events Logged (DB Size Metric)
    $stmt = $pdo->query("SELECT COUNT(*) FROM analytics");
    $totalEventsLogged = (int) $stmt->fetchColumn();

    // 4. Timeline Chart Data
    $stmt = $pdo->query("SELECT DATE(timestamp) as date, COUNT(*) as views 
                         FROM analytics 
                         WHERE type = 'pageview' 
                         GROUP BY DATE(timestamp) 
                         ORDER BY date ASC");
    $timelineChart = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 5. Top Paths Chart Data (Top 5)
    $stmt = $pdo->query("SELECT path as name, COUNT(*) as views 
                         FROM analytics 
                         WHERE type = 'pageview' 
                         GROUP BY path 
                         ORDER BY views DESC 
                         LIMIT 5");
    $topPathsChart = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 6. Project Interactions Data
    // Ensure we handle naming inconsistencies using 'title' with TRIM()
    $stmt = $pdo->query("SELECT TRIM(title) as name, COUNT(*) as clicks 
                         FROM analytics 
                         WHERE type = 'click_project' AND title IS NOT NULL
                         GROUP BY TRIM(title) 
                         ORDER BY clicks DESC");
    $projectsChart = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Get active DB name for diagnostic clarity
    $stmt = $pdo->query("SELECT DATABASE()");
    $activeDB = $stmt->fetchColumn();

    // Output combined analytics bundle for the React Dashboard
    http_response_code(200);
    echo json_encode([
        'kpis' => [
            'totalViews' => $totalViews,
            'uniqueVisitors' => $uniqueVisitors,
            'totalEventsLogged' => $totalEventsLogged
        ],
        'timelineChart' => $timelineChart,
        'topPathsChart' => $topPathsChart,
        'projectsChart' => $projectsChart,
        'debug' => [
            'database' => $activeDB,
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to generate analytics from database']);
}
exit;
