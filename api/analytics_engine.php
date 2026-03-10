<?php
/**
 * analytics_engine.php — NurdiansyahLabs Lightweight Analytics Microservice
 *
 * Pulls real computed statistics from MySQL to power the Data Science &
 * Data Analyst showcase apps. All heavy computation happens server-side.
 *
 * Endpoints (GET only, no auth required — public portfolio data):
 *   ?type=sales_trend       → monthly revenue trend from products table
 *   ?type=category_dist     → product count & avg price per category
 *   ?type=top_products      → top 5 products by price (as proxy for popularity)
 *   ?type=app_summary       → per-app total products, avg price, last updated
 *
 * Security: Read-only. Input is whitelisted. No user data exposed.
 */

error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/../database/db.php';

// ── Security Headers ──────────────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: strict-origin-when-cross-origin');
// Cache for 5 minutes — analytics don't need to be real-time
header('Cache-Control: public, max-age=300, s-maxage=300');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// ── Whitelist the 'type' parameter to prevent probing ─────────────────────────
$allowed_types = ['sales_trend', 'category_dist', 'top_products', 'app_summary'];
$type = $_GET['type'] ?? '';

if (!in_array($type, $allowed_types, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid type. Allowed: ' . implode(', ', $allowed_types)]);
    exit;
}

$pdo = getDB();

if (!$pdo) {
    // Graceful fallback: return computed demo data so the showcase still works
    // without a live DB connection (e.g., when viewed as a static preview)
    echo json_encode(['status' => 'demo', 'data' => getDemoData($type)]);
    exit;
}

// ── Query Handlers ────────────────────────────────────────────────────────────

try {
    switch ($type) {

        // Monthly revenue trend — groups by year-month, sums price as proxy for revenue
        case 'sales_trend':
            $stmt = $pdo->query("
                SELECT
                    DATE_FORMAT(created_at, '%Y-%m') AS month,
                    COUNT(*) AS total_items,
                    ROUND(SUM(price), 0) AS total_value,
                    ROUND(AVG(price), 0) AS avg_price
                FROM products
                WHERE created_at IS NOT NULL
                GROUP BY DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY month ASC
                LIMIT 24
            ");
            $rows = $stmt->fetchAll();
            // If no timestamp data, fall back to demo
            if (empty($rows)) {
                echo json_encode(['status' => 'demo', 'data' => getDemoData($type)]);
                exit;
            }
            echo json_encode(['status' => 'success', 'data' => $rows]);
            break;

        // Category distribution — product count and avg price per category
        case 'category_dist':
            $stmt = $pdo->query("
                SELECT
                    COALESCE(NULLIF(category, ''), 'Uncategorized') AS category,
                    COUNT(*) AS count,
                    ROUND(AVG(price), 0) AS avg_price,
                    ROUND(MIN(price), 0) AS min_price,
                    ROUND(MAX(price), 0) AS max_price
                FROM products
                GROUP BY category
                ORDER BY count DESC
                LIMIT 10
            ");
            $rows = $stmt->fetchAll();
            echo json_encode(['status' => 'success', 'data' => $rows]);
            break;

        // Top products by price — represents premium/high-value items
        case 'top_products':
            $stmt = $pdo->query("
                SELECT
                    id, name, category, app_id,
                    ROUND(price, 0) AS price,
                    image_url
                FROM products
                WHERE price > 0
                ORDER BY price DESC
                LIMIT 5
            ");
            $rows = $stmt->fetchAll();
            echo json_encode(['status' => 'success', 'data' => $rows]);
            break;

        // Per-app summary — useful for portfolio analytics
        case 'app_summary':
            $stmt = $pdo->query("
                SELECT
                    app_id,
                    COUNT(*) AS total_products,
                    ROUND(AVG(price), 0) AS avg_price,
                    ROUND(SUM(price), 0) AS total_value,
                    MAX(created_at) AS last_updated
                FROM products
                WHERE app_id IS NOT NULL AND app_id != ''
                GROUP BY app_id
                ORDER BY total_products DESC
            ");
            $rows = $stmt->fetchAll();
            echo json_encode(['status' => 'success', 'data' => $rows]);
            break;
    }

} catch (PDOException $e) {
    // Log securely, never expose DB messages to client
    error_log('[analytics_engine] PDO error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Analytics query failed. Please try again later.']);
}

// ── Demo Data Fallback (when DB is unavailable) ───────────────────────────────
function getDemoData(string $type): array
{
    switch ($type) {
        case 'sales_trend':
            $months = [
                '2024-07',
                '2024-08',
                '2024-09',
                '2024-10',
                '2024-11',
                '2024-12',
                '2025-01',
                '2025-02',
                '2025-03'
            ];
            $values = [42, 48, 45, 58, 62, 71, 68, 79, 85];
            return array_map(fn($m, $v) => [
                'month' => $m,
                'total_items' => rand(5, 15),
                'total_value' => $v * 50000,
                'avg_price' => $v * 1200
            ], $months, $values);

        case 'category_dist':
            return [
                ['category' => 'Sembako', 'count' => 8, 'avg_price' => 35000],
                ['category' => 'Minuman', 'count' => 6, 'avg_price' => 12000],
                ['category' => 'Snack', 'count' => 5, 'avg_price' => 18000],
                ['category' => 'Laptops', 'count' => 12, 'avg_price' => 12500000],
                ['category' => 'Gadgets', 'count' => 7, 'avg_price' => 4200000],
            ];

        case 'top_products':
            return [
                ['id' => 1, 'name' => 'MacBook Pro M3', 'category' => 'Laptops', 'price' => 54999000],
                ['id' => 2, 'name' => 'iPhone 15 Pro', 'category' => 'Gadgets', 'price' => 22999000],
                ['id' => 3, 'name' => 'Toyota Alphard', 'category' => 'Dengan Sopir', 'price' => 2500000],
                ['id' => 4, 'name' => 'Nastar Premium', 'category' => 'Kue Kering', 'price' => 95000],
                ['id' => 5, 'name' => 'Beras 5kg', 'category' => 'Sembako', 'price' => 75000],
            ];

        case 'app_summary':
            return [
                ['app_id' => 'toko-laptop', 'total_products' => 12, 'avg_price' => 8500000, 'total_value' => 102000000],
                ['app_id' => 'rental-mobil', 'total_products' => 6, 'avg_price' => 750000, 'total_value' => 4500000],
                ['app_id' => 'warung-makan', 'total_products' => 8, 'avg_price' => 28000, 'total_value' => 224000],
                ['app_id' => 'consultant', 'total_products' => 4, 'avg_price' => 80000, 'total_value' => 320000],
            ];

        default:
            return [];
    }
}
