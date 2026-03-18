<?php
/**
 * NurdiansyahLabs – Shared Admin Authentication Middleware
 * 
 * Extracts and verifies the X-Admin-Token header against the database.
 * Include this file and call verifyAdminToken($pdo) in any admin-protected endpoint.
 */

function verifyAdminToken(PDO $pdo): void {
    $providedToken = $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? '';

    if (empty($providedToken) && function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        if (isset($requestHeaders['X-Admin-Token'])) {
            $providedToken = $requestHeaders['X-Admin-Token'];
        } elseif (isset($requestHeaders['x-admin-token'])) {
            $providedToken = $requestHeaders['x-admin-token'];
        }
    }

    if (empty($providedToken)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id FROM admin_users WHERE token = :token");
    $stmt->execute(['token' => $providedToken]);
    if (!$stmt->fetch()) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized or expired session']);
        exit;
    }
}
