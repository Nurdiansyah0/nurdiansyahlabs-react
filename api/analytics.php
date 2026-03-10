<?php
/**
 * NurdiansyahLabs – Secure Analytics Aggregator
 * Deployed at: /public_html/api/analytics.php
 * 
 * Aggregates charts and KPIs directly from the high-performance MySQL database.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');

// Preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ── Database-Backed Authentication ───────────────────────────────────────────
$providedToken = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';

if (empty($providedToken) && function_exists('apache_request_headers')) {
    $requestHeaders = apache_request_headers();
    if (isset($requestHeaders['X-Admin-Token'])) {
        $providedToken = $requestHeaders['X-Admin-Token'];
    } elseif (isset($requestHeaders['x-admin-token'])) {
        $providedToken = $requestHeaders['x-admin-token'];
    }
}

if (empty($providedToken)) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

require_once __DIR__ . '/../database/db.php';
$pdo = getDB();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Verify token against database
$stmt = $pdo->prepare("SELECT id FROM admin_users WHERE token = :token");
$stmt->execute(['token' => $providedToken]);
if (!$stmt->fetch()) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized or expired session']);
    exit;
}

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
    // Ensure we handle naming inconsistencies using 'title'
    $stmt = $pdo->query("SELECT title as name, COUNT(*) as clicks 
                         FROM analytics 
                         WHERE type = 'click_project' AND title IS NOT NULL
                         GROUP BY title 
                         ORDER BY clicks DESC");
    $projectsChart = $stmt->fetchAll(PDO::FETCH_ASSOC);

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
        'projectsChart' => $projectsChart
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to generate analytics from database']);
}
exit;
