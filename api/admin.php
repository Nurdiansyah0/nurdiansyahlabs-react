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
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
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

/**
 * Purge all .json cache files from cache directories
 * 
 * @return array{purged_files: string[], errors: string[]}
 */
function purgeCacheFiles(): array {
    $cacheDirs = [
        __DIR__ . '/../cache/',
        __DIR__ . '/cache/'
    ];
    $purged = [];
    $errors = [];

    foreach ($cacheDirs as $dir) {
        if (!is_dir($dir)) {
            continue;
        }
        $files = glob($dir . '*.json');
        if ($files === false) {
            continue;
        }
        foreach ($files as $file) {
            if (is_file($file)) {
                if (@unlink($file)) {
                    $purged[] = basename($file);
                } else {
                    $errors[] = basename($file);
                }
            }
        }
    }

    return [
        'purged_files' => array_values(array_unique($purged)),
        'errors' => $errors
    ];
}

/**
 * Safely clean up old test artifacts and orphaned directories
 * 
 * @return array{deleted_files: string[], removed_dirs: string[], errors: string[]}
 */
function cleanupOrphans(): array {
    $deletedFiles = [];
    $removedDirs = [];
    $errors = [];

    // 1. Clean test files matching *_valid.png or test_* in upload_articles/
    $uploadDirs = [
        __DIR__ . '/../upload_articles/',
        __DIR__ . '/../public/upload_articles/',
        __DIR__ . '/upload_articles/'
    ];

    foreach ($uploadDirs as $dir) {
        if (!is_dir($dir)) {
            continue;
        }
        $patterns = [
            $dir . '*_valid.png',
            $dir . 'test_*.png',
            $dir . 'test_*.jpg',
            $dir . 'test_*.webp'
        ];
        foreach ($patterns as $pattern) {
            $files = glob($pattern);
            if ($files === false) {
                continue;
            }
            foreach ($files as $file) {
                if (is_file($file)) {
                    if (@unlink($file)) {
                        $deletedFiles[] = basename($file);
                    } else {
                        $errors[] = 'Failed to delete ' . basename($file);
                    }
                }
            }
        }
    }

    // 2. Safely remove orphaned blog/jp, blog/us, blog/id directories
    $orphanDirCandidates = [
        __DIR__ . '/../blog/jp',
        __DIR__ . '/../blog/us',
        __DIR__ . '/../blog/id',
        __DIR__ . '/../public/blog/jp',
        __DIR__ . '/../public/blog/us',
        __DIR__ . '/../public/blog/id'
    ];

    $deleteDirRecursive = function (string $dir) use (&$deleteDirRecursive, &$deletedFiles, &$errors): bool {
        if (!is_dir($dir)) return false;
        $items = scandir($dir);
        if ($items === false) return false;
        foreach ($items as $item) {
            if ($item === '.' || $item === '..') continue;
            $path = $dir . DIRECTORY_SEPARATOR . $item;
            if (is_dir($path)) {
                $deleteDirRecursive($path);
            } else {
                if (@unlink($path)) {
                    $deletedFiles[] = $path;
                } else {
                    $errors[] = 'Failed to delete ' . $path;
                }
            }
        }
        return @rmdir($dir);
    };

    foreach ($orphanDirCandidates as $cand) {
        $real = realpath($cand);
        if ($real && is_dir($real)) {
            // Strict regex verification to prevent accidental path traversal
            if (preg_match('#/blog/(jp|us|id)$#', $real)) {
                if ($deleteDirRecursive($real)) {
                    $removedDirs[] = basename(dirname($real)) . '/' . basename($real);
                } else {
                    $errors[] = 'Failed to remove directory: ' . $real;
                }
            }
        }
    }

    return [
        'deleted_files' => array_values(array_unique($deletedFiles)),
        'removed_dirs' => array_values(array_unique($removedDirs)),
        'errors' => $errors
    ];
}

// ── PURGE CACHE Action ───────────────────────────────────────────────────────
if (($method === 'POST' || $method === 'GET') && $action === 'purge_cache') {
    $result = purgeCacheFiles();
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'action' => 'purge_cache',
        'purged_count' => count($result['purged_files']),
        'purged_files' => $result['purged_files'],
        'errors' => $result['errors'],
        'timestamp' => date('c'),
        'message' => count($result['purged_files']) . ' cache file(s) safely wiped.'
    ]);
    exit;
}

// ── CLEANUP ORPHANS Action ───────────────────────────────────────────────────
if (($method === 'POST' || $method === 'GET') && $action === 'cleanup_orphans') {
    $result = cleanupOrphans();
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'action' => 'cleanup_orphans',
        'deleted_files_count' => count($result['deleted_files']),
        'deleted_files' => $result['deleted_files'],
        'removed_dirs_count' => count($result['removed_dirs']),
        'removed_dirs' => $result['removed_dirs'],
        'errors' => $result['errors'],
        'timestamp' => date('c'),
        'message' => 'Orphaned files and test directories cleaned successfully.'
    ]);
    exit;
}

// ── CACHE STATUS Action ──────────────────────────────────────────────────────
if ($method === 'GET' && $action === 'cache_status') {
    $cacheDir = __DIR__ . '/../cache/';
    $files = [];
    if (is_dir($cacheDir)) {
        $matches = glob($cacheDir . '*.json');
        if ($matches !== false) {
            foreach ($matches as $m) {
                $files[] = [
                    'filename' => basename($m),
                    'size' => filesize($m),
                    'mtime' => date('c', filemtime($m)),
                    'age_seconds' => time() - filemtime($m)
                ];
            }
        }
    }
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'action' => 'cache_status',
        'count' => count($files),
        'files' => $files
    ]);
    exit;
}

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

        // Invalidate frontend cache immediately
        purgeCacheFiles();

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
        // Invalidate frontend cache immediately
        purgeCacheFiles();

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

    // Invalidate frontend cache immediately
    purgeCacheFiles();

    http_response_code(200);
    echo json_encode(['status' => 'success']);
    exit;
}

// If no route matched
http_response_code(404);
echo json_encode(['error' => 'Route not found or Invalid Method']);
exit;
