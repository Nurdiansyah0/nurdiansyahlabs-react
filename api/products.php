<?php
// /api/products.php — NurdiansyahLabs Portfolio CMS Products API
// Production-hardened: no error output, security headers enforced.
error_reporting(0);
ini_set('display_errors', 0);
require_once __DIR__ . '/../database/db.php';

// ── Security Headers ────────────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$pdo = getDB();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

// Security: Require Admin Token for Modification
function verifyAdmin()
{
    global $pdo;

    $token = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';

    if (empty($token) && function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        if (isset($requestHeaders['X-Admin-Token'])) {
            $token = $requestHeaders['X-Admin-Token'];
        } elseif (isset($requestHeaders['x-admin-token'])) {
            $token = $requestHeaders['x-admin-token'];
        }
    }

    if (empty($token)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id FROM admin_users WHERE token = :token");
    $stmt->execute(['token' => $token]);
    if (!$stmt->fetch()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized or expired session']);
        exit;
    }
}

// ----------------------------------------------------
// 1. GET: Fetch Products (Public, read-only)
// ----------------------------------------------------
if ($method === 'GET') {
    // Sanitize: strip any non-alphanumeric/dash characters from app_id
    $app_id = preg_replace('/[^a-zA-Z0-9\-_]/', '', $_GET['app'] ?? '');

    if (empty($app_id)) {
        // Return all products if no app_id is specified
        $stmt = $pdo->query("SELECT id, app_id, name, price, description, image_url, category, extras FROM products ORDER BY id DESC");
        $products = $stmt->fetchAll();
    } else {
        $stmt = $pdo->prepare("SELECT id, app_id, name, price, description, image_url, category, extras FROM products WHERE app_id = ? ORDER BY id DESC");
        $stmt->execute([$app_id]);
        $products = $stmt->fetchAll();
    }

    // Decode JSON extras for each product before sending to frontend
    foreach ($products as &$post) {
        if (!empty($post['extras'])) {
            $post['extras'] = json_decode($post['extras'], true);
        } else {
            $post['extras'] = new stdClass(); // Empty object
        }
    }

    echo json_encode(['status' => 'success', 'data' => $products]);
    exit;
}

// ----------------------------------------------------
// 2. POST: Create a new product
// ----------------------------------------------------
if ($method === 'POST') {
    verifyAdmin();
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON payload']);
        exit;
    }

    // Validate required fields
    if (empty($data['app_id']) || empty($data['name']) || !isset($data['price'])) {
        http_response_code(400);
        echo json_encode(['error' => 'app_id, name, and price are required']);
        exit;
    }

    // Sanitize inputs
    $data['app_id'] = substr(htmlspecialchars(trim($data['app_id']), ENT_QUOTES, 'UTF-8'), 0, 60);
    $data['name'] = substr(htmlspecialchars(trim($data['name']), ENT_QUOTES, 'UTF-8'), 0, 255);
    $data['price'] = (float) $data['price'];
    $data['category'] = substr(htmlspecialchars(trim($data['category'] ?? ''), ENT_QUOTES, 'UTF-8'), 0, 100);

    $stmt = $pdo->prepare("
        INSERT INTO products (app_id, name, price, description, image_url, category, extras)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");

    $extras = !empty($data['extras']) ? json_encode($data['extras']) : null;

    try {
        $stmt->execute([
            $data['app_id'],
            $data['name'],
            $data['price'],
            $data['description'] ?? '',
            $data['image_url'] ?? '',
            $data['category'] ?? '',
            $extras
        ]);

        $newId = $pdo->lastInsertId();
        echo json_encode(['status' => 'success', 'id' => $newId]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create product: ' . $e->getMessage()]);
    }
    exit;
}

// ----------------------------------------------------
// 3. PUT: Update an existing product
// ----------------------------------------------------
if ($method === 'PUT') {
    verifyAdmin();
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON payload']);
        exit;
    }

    $data['id'] = (int) ($data['id'] ?? 0);
    if ($data['id'] <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Valid numeric Product ID is required']);
        exit;
    }

    // Sanitize inputs
    $data['app_id'] = substr(htmlspecialchars(trim($data['app_id'] ?? ''), ENT_QUOTES, 'UTF-8'), 0, 60);
    $data['name'] = substr(htmlspecialchars(trim($data['name'] ?? ''), ENT_QUOTES, 'UTF-8'), 0, 255);
    $data['price'] = (float) ($data['price'] ?? 0);
    $data['category'] = substr(htmlspecialchars(trim($data['category'] ?? ''), ENT_QUOTES, 'UTF-8'), 0, 100);

    $stmt = $pdo->prepare("
        UPDATE products 
        SET app_id = ?, name = ?, price = ?, description = ?, image_url = ?, category = ?, extras = ?
        WHERE id = ?
    ");

    $extras = !empty($data['extras']) ? json_encode($data['extras']) : null;

    try {
        $stmt->execute([
            $data['app_id'],
            $data['name'],
            $data['price'],
            $data['description'] ?? '',
            $data['image_url'] ?? '',
            $data['category'] ?? '',
            $extras,
            $data['id']
        ]);
        echo json_encode(['status' => 'success']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update product: ' . $e->getMessage()]);
    }
    exit;
}

// ----------------------------------------------------
// 4. DELETE: Remove an existing product
// ----------------------------------------------------
if ($method === 'DELETE') {
    verifyAdmin();
    // Strictly cast to int to prevent injection via query string
    $id = (int) ($_GET['id'] ?? 0);

    if ($id <= 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Valid numeric Product ID is required']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");

    try {
        $stmt->execute([$id]);
        echo json_encode(['status' => 'success']);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to delete product: ' . $e->getMessage()]);
    }
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
