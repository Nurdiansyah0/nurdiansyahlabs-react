<?php
/**
 * NurdiansyahLabs – Blog CMS API
 * Deployed at: /public_html/api/posts.php
 * 
 * Serves blog articles directly from the high-performance MySQL database.
 * Supports fetching all posts or a specific post by slug.
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once __DIR__ . '/../database/db.php';
$pdo = getDB();

// ── GET Single Post ──────────────────────────────────────────────────────────
if (isset($_GET['slug'])) {
    $slug = trim($_GET['slug']);

    $stmt = $pdo->prepare("SELECT * FROM posts WHERE slug = :slug");
    $stmt->execute(['slug' => $slug]);
    $post = $stmt->fetch();

    if ($post) {
        $post['faqs'] = json_decode($post['faqs'] ?? '[]', true);
        http_response_code(200);
        echo json_encode($post);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Post not found']);
    }
    exit;
}

// ── GET All Posts (Minimal format for listing) ───────────────────────────────
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

http_response_code(200);
echo json_encode(['total' => count($posts), 'posts' => $posts]);
exit;
