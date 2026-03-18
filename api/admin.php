<?php
/**
 * NurdiansyahLabs – Secure Admin API
 * Deployed at: /public_html/api/admin.php
 * 
 * Handles CRUD for posts and Read for leads using MySQL
 */

header('Content-Type: application/json');
require_once __DIR__ . '/cors.php';
setCorsHeaders(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);

// Handle preflight OPTIONS request
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

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// ── GET Leads ────────────────────────────────────────────────────────────────
if ($method === 'GET' && $action === 'leads') {
    $stmt = $pdo->query("SELECT * FROM leads ORDER BY timestamp DESC");
    http_response_code(200);
    echo json_encode(['leads' => $stmt->fetchAll()]);
    exit;
}

// ── DELETE Leads ─────────────────────────────────────────────────────────────
if ($method === 'DELETE' && $action === 'leads') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Lead ID required']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM leads WHERE id = :id");
    if ($stmt->execute(['id' => $id])) {
        http_response_code(200);
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete lead']);
    }
    exit;
}

// ── GET Posts (Full data including content) ──────────────────────────────────
if ($method === 'GET' && $action === 'posts') {
    $stmt = $pdo->query("SELECT * FROM posts ORDER BY created_at DESC");
    $posts = $stmt->fetchAll();

    // Parse JSON strings back to arrays for the frontend
    foreach ($posts as &$post) {
        $post['faqs'] = json_decode($post['faqs'] ?? '[]', true);
    }

    http_response_code(200);
    echo json_encode(['posts' => $posts]);
    exit;
}

// ── Handle Post Payloads (Create/Update) ─────────────────────────────────────
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true) ?? [];

// ── POST: Create New Article ─────────────────────────────────────────────────
if ($method === 'POST' && $action === 'posts') {
    if (empty($input['slug']) || empty($input['title'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Slug and Title required']);
        exit;
    }

    // Check if slug exists
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM posts WHERE slug = :slug");
    $stmt->execute(['slug' => $input['slug']]);
    if ($stmt->fetchColumn() > 0) {
        http_response_code(409);
        echo json_encode(['error' => 'Article with this slug already exists']);
        exit;
    }

    $newPost = [
        'slug' => $input['slug'],
        'title' => $input['title'],
        'description' => $input['description'] ?? '',
        'service' => $input['service'] ?? 'A',
        'serviceLabel' => $input['serviceLabel'] ?? 'Service',
        'accent' => $input['accent'] ?? '#4f46e5',
        'accentLight' => $input['accentLight'] ?? '#eef2ff',
        'images' => isset($input['images']) && is_array($input['images']) ? json_encode($input['images']) : json_encode([]),
        'faqs' => json_encode($input['faqs'] ?? []),
        'content' => $input['content'] ?? ''
    ];

    $sql = "INSERT INTO posts (slug, title, description, service, serviceLabel, accent, accentLight, images, faqs, content) 
            VALUES (:slug, :title, :description, :service, :serviceLabel, :accent, :accentLight, :images, :faqs, :content)";

    $stmt = $pdo->prepare($sql);
    $success = $stmt->execute([
        'slug' => $newPost['slug'],
        'title' => $newPost['title'],
        'description' => $newPost['description'],
        'service' => $newPost['service'],
        'serviceLabel' => $newPost['serviceLabel'],
        'accent' => $newPost['accent'],
        'accentLight' => $newPost['accentLight'],
        'images' => $newPost['images'],
        'faqs' => $newPost['faqs'],
        'content' => $newPost['content']
    ]);

    // Convert faqs to array for returning newly created object to frontend correctly
    $returnPost = $newPost;
    $returnPost['faqs'] = json_decode($newPost['faqs'], true);

    if ($success) {

        // Append to sitemap.xml
        $sitemapFile = __DIR__ . '/../../public/sitemap.xml';
        if (file_exists($sitemapFile)) {
            $dom = new DOMDocument();
            $dom->preserveWhiteSpace = false;
            $dom->formatOutput = true;

            if ($dom->load($sitemapFile)) {
                $urlset = $dom->getElementsByTagName('urlset')->item(0);
                if ($urlset) {
                    $newUrlNode = $dom->createElement('url');

                    $locNode = $dom->createElement('loc', 'https://nurdiansyahlabs.com/blog/' . $newPost['slug']);
                    $lastmodNode = $dom->createElement('lastmod', date('Y-m-d'));
                    $changefreqNode = $dom->createElement('changefreq', 'weekly');
                    $priorityNode = $dom->createElement('priority', '0.9');

                    $newUrlNode->appendChild($locNode);
                    $newUrlNode->appendChild($lastmodNode);
                    $newUrlNode->appendChild($changefreqNode);
                    $newUrlNode->appendChild($priorityNode);

                    $urlset->appendChild($newUrlNode);
                    $dom->save($sitemapFile);
                }
            }
        }

        http_response_code(201);
        echo json_encode(['status' => 'success', 'post' => $returnPost]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to save dataset']);
    }
    exit;
}

// ── PUT: Update Existing Article ─────────────────────────────────────────────
if ($method === 'PUT' && $action === 'posts') {
    if (empty($input['slug'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Slug required to update']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM posts WHERE slug = :slug");
    $stmt->execute(['slug' => $input['slug']]);
    $existingPost = $stmt->fetch();

    if (!$existingPost) {
        http_response_code(404);
        echo json_encode(['error' => 'Post not found']);
        exit;
    }

    $updateData = [
        'slug' => $input['slug'],
        'title' => $input['title'] ?? $existingPost['title'],
        'description' => $input['description'] ?? $existingPost['description'],
        'service' => $input['service'] ?? $existingPost['service'],
        'serviceLabel' => $input['serviceLabel'] ?? $existingPost['serviceLabel'],
        'accent' => $input['accent'] ?? $existingPost['accent'],
        'accentLight' => $input['accentLight'] ?? $existingPost['accentLight'],
        'images' => isset($input['images']) && is_array($input['images']) ? json_encode($input['images']) : $existingPost['images'],
        'faqs' => isset($input['faqs']) ? json_encode($input['faqs']) : $existingPost['faqs'],
        'content' => $input['content'] ?? $existingPost['content']
    ];

    $sql = "UPDATE posts SET 
            title = :title, 
            description = :description, 
            service = :service, 
            serviceLabel = :serviceLabel, 
            accent = :accent, 
            accentLight = :accentLight, 
            images = :images, 
            faqs = :faqs, 
            content = :content 
            WHERE slug = :slug";

    $stmt = $pdo->prepare($sql);

    if ($stmt->execute($updateData)) {
        http_response_code(200);
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update dataset']);
    }
    exit;
}

// ── DELETE: Remove Article ───────────────────────────────────────────────────
if ($method === 'DELETE' && $action === 'posts') {
    $slugToDelete = $_GET['slug'] ?? '';
    if (empty($slugToDelete)) {
        http_response_code(400);
        echo json_encode(['error' => 'Slug query parameter required for deletion']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM posts WHERE slug = :slug");
    $stmt->execute(['slug' => $slugToDelete]);

    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'Post not found']);
        exit;
    }

    // Remove from sitemap.xml
    $sitemapFile = __DIR__ . '/../../public/sitemap.xml';
    if (file_exists($sitemapFile)) {
        $dom = new DOMDocument();
        $dom->preserveWhiteSpace = false;
        $dom->formatOutput = true;

        if ($dom->load($sitemapFile)) {
            $urlset = $dom->getElementsByTagName('urlset')->item(0);
            if ($urlset) {
                $targetLoc = 'https://nurdiansyahlabs.com/blog/' . $slugToDelete;
                $urls = $urlset->getElementsByTagName('url');

                // Iterate backwards since we are removing nodes
                for ($i = $urls->length - 1; $i >= 0; $i--) {
                    $urlNode = $urls->item($i);
                    $locNodes = $urlNode->getElementsByTagName('loc');
                    if ($locNodes->length > 0 && $locNodes->item(0)->nodeValue === $targetLoc) {
                        $urlset->removeChild($urlNode);
                    }
                }
                $dom->save($sitemapFile);
            }
        }
    }

    http_response_code(200);
    echo json_encode(['status' => 'success']);
    exit;
}

// If no route matched
http_response_code(404);
echo json_encode(['error' => 'Route not found or Invalid Method']);
exit;
