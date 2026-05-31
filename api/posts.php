<?php
/**
 * NurdiansyahLabs – Blog CMS API
 * Deployed at: /public_html/api/posts.php
 * 
 * Serves blog articles directly from the high-performance MySQL database.
 * Supports fetching all posts or a specific post by slug.
 * 
 * Added file-based caching to prevent cPanel max_user_connections exhaustion
 * during heavy concurrent traffic (like Lighthouse audits).
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

define('CACHE_DIR', __DIR__ . '/../cache/');
define('CACHE_TTL', 300); // 5 minutes cache

function readCache(string $key): ?array {
    $file = CACHE_DIR . md5($key) . '.json';
    if (!file_exists($file)) return null;
    if (time() - filemtime($file) > CACHE_TTL) return null;
    $data = json_decode(file_get_contents($file), true);
    return $data ?: null;
}

function writeCache(string $key, array $data): void {
    if (!is_dir(CACHE_DIR)) mkdir(CACHE_DIR, 0755, true);
    file_put_contents(CACHE_DIR . md5($key) . '.json', json_encode($data));
}

// ── GET Single Post ──────────────────────────────────────────────────────────
if (isset($_GET['slug'])) {
    $slug = trim($_GET['slug']);
    $cacheKey = 'post_' . $slug;
    
    $cached = readCache($cacheKey);
    if ($cached) {
        http_response_code(200);
        echo json_encode($cached);
        exit;
    }

    require_once __DIR__ . '/../database/db.php';
    $pdo = getDB();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM posts WHERE slug = :slug");
    $stmt->execute(['slug' => $slug]);
    $post = $stmt->fetch();

    if ($post) {
        $post['faqs'] = json_decode($post['faqs'] ?? '[]', true);
        writeCache($cacheKey, $post);
        http_response_code(200);
        echo json_encode($post);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Post not found']);
    }
    exit;
}

// ── GET All Posts (Minimal format for listing) ───────────────────────────────
$cacheKey = 'all_posts_listing';
$cached = readCache($cacheKey);
if ($cached) {
    http_response_code(200);
    echo json_encode($cached);
    exit;
}

require_once __DIR__ . '/../database/db.php';
$pdo = getDB();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed']);
    exit;
}

// We strip out the full content column to save bandwidth on the listing page
$stmt = $pdo->query("SELECT slug, title, description, service, serviceLabel, accent, accentLight, images FROM posts ORDER BY created_at DESC");
$posts = $stmt->fetchAll();

foreach ($posts as &$post) {
    if (!empty($post['images'])) {
        $post['images'] = json_decode($post['images'], true);
    } else {
        $post['images'] = [];
    }
}

$response = ['total' => count($posts), 'posts' => $posts];
writeCache($cacheKey, $response);

http_response_code(200);
echo json_encode($response);
exit;
