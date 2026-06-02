<?php
// api/primatera_auth.php
// Endpoint login untuk Primatera Poultry ERP
require_once __DIR__ . '/cors.php';
require_once __DIR__ . '/../database/db.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo JSON_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$username = trim($input['username'] ?? '');
$password = trim($input['password'] ?? '');

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Username dan password wajib diisi']);
    exit;
}

$pdo = getDB();
if (!$pdo) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT id, username, password_hash, name, role FROM primatera_users WHERE username = :username LIMIT 1");
    $stmt->execute([':username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        if (password_verify($password, $user['password_hash'])) {
            // Hilangkan hash password sebelum dikirim ke frontend
            unset($user['password_hash']);
            
            // Response sukses login
            echo json_encode([
                'success' => true,
                'message' => 'Login berhasil',
                'user' => $user
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['success' => false, 'message' => 'Password salah']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Username tidak ditemukan']);
    }

} catch (PDOException $e) {
    error_log("Login Error (Primatera): " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Internal server error']);
}
