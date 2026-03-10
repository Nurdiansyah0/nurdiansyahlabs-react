<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Authentication
$providedToken = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
if (empty($providedToken) && function_exists('apache_request_headers')) {
    $requestHeaders = apache_request_headers();
    $providedToken = $requestHeaders['X-Admin-Token'] ?? $requestHeaders['x-admin-token'] ?? '';
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

$stmt = $pdo->prepare("SELECT id FROM admin_users WHERE token = :token");
$stmt->execute(['token' => $providedToken]);
if (!$stmt->fetch()) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized or expired session']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'No image uploaded or upload error.']);
        exit;
    }

    $file = $_FILES['image'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    // Validate Extension
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!in_array($ext, $allowed)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type. Allowed: jpg, jpeg, png, gif, webp.']);
        exit;
    }

    // Determine correct upload path based on environment (Vite vs. cPanel production)
    $isLocalDev = is_dir(__DIR__ . '/../public');
    $uploadDir = $isLocalDev ? __DIR__ . '/../public/upload_articles' : __DIR__ . '/../upload_articles';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $filename = time() . '_' . preg_replace('/[^a-zA-Z0-9.\-_]/', '', $file['name']);
    $destination = $uploadDir . '/' . $filename;

    if (move_uploaded_file($file['tmp_name'], $destination)) {
        // Return relative path. It is accessible statically via /upload_articles/
        http_response_code(200);
        echo json_encode(['status' => 'success', 'url' => '/upload_articles/' . $filename]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file.']);
    }
}
