<?php
// /home/nurdiansyah/Nurdiansyah/react-app/api/products.php
// Centralized API for Portfolio CMS Products
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once __DIR__ . '/../database/db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token');

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
    $app_id = $_GET['app'] ?? '';

    if (empty($app_id)) {
        // Return all products if no app_id is specified
        $stmt = $pdo->query("SELECT * FROM products ORDER BY id DESC");
        $products = $stmt->fetchAll();
    } else {
        $stmt = $pdo->prepare("SELECT * FROM products WHERE app_id = ? ORDER BY id DESC");
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
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['app_id']) || empty($data['name']) || empty($data['price'])) {
        http_response_code(400);
        echo json_encode(['error' => 'app_id, name, and price are required']);
        exit;
    }

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
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID is required']);
        exit;
    }

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
    $id = $_GET['id'] ?? '';

    if (empty($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID is required']);
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
