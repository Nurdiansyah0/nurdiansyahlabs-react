<?php
header('Content-Type: application/json');
require_once __DIR__ . '/cors.php';
setCorsHeaders(['POST', 'OPTIONS']);

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Authentication
require_once __DIR__ . '/auth_middleware.php';
require_once __DIR__ . '/../database/db.php';
$pdo = getDB();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

verifyAdminToken($pdo);

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

    // Validate actual MIME type (prevents disguised file uploads)
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    $allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!in_array($mime, $allowedMimes, true)) {
        http_response_code(400);
        echo json_encode(['error' => 'File content does not match an allowed image type.']);
        exit;
    }

    // Validate file size (max 5MB)
    $maxSize = 5 * 1024 * 1024;
    if ($file['size'] > $maxSize) {
        http_response_code(400);
        echo json_encode(['error' => 'File too large. Maximum size: 5MB.']);
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
        // Return structured data array suitable for the `images` JSON column
        $imageUrl = '/upload_articles/' . $filename;

        $structuredData = [
            'url' => $imageUrl,
            'alt' => str_replace(['_', '-'], ' ', pathinfo($file['name'], PATHINFO_FILENAME)),
            'is_primary' => true // Default to primary for single uploads
        ];

        http_response_code(200);
        echo json_encode(['status' => 'success', 'url' => $imageUrl, 'image_data' => $structuredData]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file.']);
    }
}
