<?php
/**
 * NurdiansyahLabs – Authentication API
 * Handles Login, Forgot Password, and Reset Password
 */

require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');
require_once __DIR__ . '/cors.php';
setCorsHeaders(['GET', 'POST', 'OPTIONS']);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$action = $_GET['action'] ?? '';

// ── Verify Token (GET) ───────────────────────────────────────────────────────
// Used by the React ProtectedRoute component to validate a stored session token.
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'verify') {
    require_once __DIR__ . '/../database/db.php';
    $pdo = getDB();

    if (!$pdo) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit;
    }

    $providedToken = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';
    if (empty($providedToken) && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $providedToken = $headers['X-Admin-Token'] ?? $headers['x-admin-token'] ?? '';
    }

    if (empty($providedToken)) {
        http_response_code(401);
        echo json_encode(['error' => 'No token provided']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id FROM admin_users WHERE token = :token");
    $stmt->execute(['token' => $providedToken]);
    if ($stmt->fetch()) {
        http_response_code(200);
        echo json_encode(['status' => 'valid']);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/../database/db.php';
$pdo = getDB();

if (!$pdo) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true) ?? [];

// ── Login ────────────────────────────────────────────────────────────────────
if ($action === 'login') {
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => 'Username and password are required']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = :username");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        // Generate a new secure token for this session
        $token = bin2hex(random_bytes(32));
        
        // Save the active token back to the DB to invalidate old ones (single session only)
        $updateStmt = $pdo->prepare("UPDATE admin_users SET token = :token WHERE id = :id");
        $updateStmt->execute(['token' => $token, 'id' => $user['id']]);

        http_response_code(200);
        echo json_encode(['status' => 'success', 'token' => $token, 'username' => $user['username']]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid username or password']);
    }
    exit;
}

// ── Forgot Password ──────────────────────────────────────────────────────────
if ($action === 'forgot_password') {
    // Determine if input is email or username
    $identifier = trim($input['identifier'] ?? '');

    if (empty($identifier)) {
        http_response_code(400);
        echo json_encode(['error' => 'Username or Email is required']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE username = :id OR email = :id");
    $stmt->execute(['id' => $identifier]);
    $user = $stmt->fetch();

    if ($user) {
        $resetToken = bin2hex(random_bytes(32));
        // Reset token expires in 1 hour
        $expires = date('Y-m-d H:i:s', time() + 3600);

        $updateStmt = $pdo->prepare("UPDATE admin_users SET reset_token = :token, reset_expires = :expires WHERE id = :id");
        $updateStmt->execute(['token' => $resetToken, 'expires' => $expires, 'id' => $user['id']]);

        // Send Email via PHPMailer
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host       = 'smtp.gmail.com';
            $mail->SMTPAuth   = true;
            $mail->Username   = getenv('SMTP_USER') ?: 'Nudiansyahdian28.adv@gmail.com';
            $mail->Password   = getenv('SMTP_PASS') ?: '';
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port       = 587;

            $mail->setFrom('Nudiansyahdian28.adv@gmail.com', 'NurdiansyahLabs Admin');
            $mail->addAddress($user['email'], $user['username']);

            $siteUrl = getenv('SITE_URL') ?: 'https://nurdiansyahlabs.com';
            $resetLink = $siteUrl . "/admin?reset=" . $resetToken;

            $mail->isHTML(true);
            $mail->Subject = 'Password Reset Request';
            $mail->Body    = "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
                <h2>Password Reset Request</h2>
                <p>Hello <b>{$user['username']}</b>,</p>
                <p>We received a request to reset your password for the admin dashboard. 
                Please click the button below to set a new password. This link will expire in 1 hour.</p>
                <div style='text-align: center; margin: 30px 0;'>
                    <a href='{$resetLink}' style='background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>Reset Password</a>
                </div>
                <p style='color: #666; font-size: 12px;'>If you did not request this, please ignore this email.</p>
            </div>";

            $mail->send();
            
            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Password reset email sent (if account exists)']);
        } catch (Exception $e) {
            error_log("Message could not be sent. Mailer Error: {$mail->ErrorInfo}");
            http_response_code(500);
            echo json_encode(['error' => 'Could not send email right now']);
        }
    } else {
        // Obscure the fact that the user doesn't exist for security reasons
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Password reset email sent (if account exists)']);
    }
    exit;
}

// ── Reset Password ───────────────────────────────────────────────────────────
if ($action === 'reset_password') {
    $token = trim($input['token'] ?? '');
    $newPassword = trim($input['password'] ?? '');

    if (empty($token) || empty($newPassword)) {
        http_response_code(400);
        echo json_encode(['error' => 'Token and new password are required']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM admin_users WHERE reset_token = :token AND reset_expires > NOW()");
    $stmt->execute(['token' => $token]);
    $user = $stmt->fetch();

    if ($user) {
        $hashed = password_hash($newPassword, PASSWORD_BCRYPT);
        
        $updateStmt = $pdo->prepare("UPDATE admin_users SET password_hash = :hash, reset_token = NULL, reset_expires = NULL, token = NULL WHERE id = :id");
        $updateStmt->execute(['hash' => $hashed, 'id' => $user['id']]);

        http_response_code(200);
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid or expired reset token']);
    }
    exit;
}

http_response_code(404);
echo json_encode(['error' => 'Invalid action']);
exit;
