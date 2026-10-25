<?php
/**
 * NurdiansyahLabs – Dynamic XML Sitemap Generator
 * Automatically creates sitemap.xml for SEO indexing.
 * Includes static routes and dynamically generated AI blog posts.
 */

header("Content-Type: text/xml; charset=utf-8");
header("Cache-Control: public, max-age=3600");

require_once __DIR__ . '/../database/db.php';

$pdo = getDB();
$baseUrl = 'https://nurdiansyahlabs.com';

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

function addUrl($loc, $lastmod = null, $changefreq = 'weekly', $priority = '0.8') {
    echo "  <url>\n";
    echo "    <loc>" . htmlspecialchars($loc) . "</loc>\n";
    if ($lastmod) {
        echo "    <lastmod>" . $lastmod . "</lastmod>\n";
    }
    echo "    <changefreq>" . $changefreq . "</changefreq>\n";
    echo "    <priority>" . $priority . "</priority>\n";
    echo "  </url>\n";
}

// 1. Static Core Pages
$today = date('Y-m-d');
addUrl($baseUrl . '/', $today, 'daily', '1.0');
addUrl($baseUrl . '/id', $today, 'daily', '1.0');
addUrl($baseUrl . '/blog', $today, 'daily', '0.9');
addUrl($baseUrl . '/id/blog', $today, 'daily', '0.9');
addUrl($baseUrl . '/trends', $today, 'daily', '0.9');
addUrl($baseUrl . '/id/trends', $today, 'daily', '0.9');

// 2. Showcase Apps (Hardcoded based on routing)
$showcases = [
    '/showcase/fullstack/warehouse-wms',
    '/showcase/data-science/smart-vision',
    '/showcase/data-analyst/crop-yield',
    '/showcase/fullstack/toko-laptop',
    '/showcase/data-science/recommendation',
    '/showcase/data-analyst/clinic-analytics',
    '/showcase/data-science/churn-prediction',
    '/showcase/data-analyst/ecommerce-analytics'
];

foreach ($showcases as $route) {
    addUrl($baseUrl . $route, '2026-06-01', 'monthly', '0.7');
}

// 3. Dynamic Blog Posts from Database
if ($pdo) {
    try {
        $stmt = $pdo->query("SELECT slug, created_at FROM posts ORDER BY created_at DESC");
        while ($row = $stmt->fetch()) {
            $date = date('Y-m-d', strtotime($row['created_at']));
            // Global Route
            addUrl($baseUrl . '/blog/' . $row['slug'], $date, 'monthly', '0.8');
            // ID Route
            addUrl($baseUrl . '/id/blog/' . $row['slug'], $date, 'monthly', '0.8');
        }
    } catch (Exception $e) {
        // Silently ignore DB errors so sitemap doesn't break completely
    }
}

echo '</urlset>';
