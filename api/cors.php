<?php
/**
 * NurdiansyahLabs – Shared CORS Configuration
 * 
 * Restricts Access-Control-Allow-Origin to known domains instead of wildcard '*'.
 * Include this file at the top of any API endpoint that needs CORS.
 */

function setCorsHeaders(array $allowedMethods = ['GET', 'POST', 'OPTIONS'], bool $allowPublicGet = false): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = [
        'https://nurdiansyahlabs.com',
        'https://www.nurdiansyahlabs.com',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
    ];

    // Also allow SITE_URL if set via environment
    $siteUrl = getenv('SITE_URL');
    if ($siteUrl && !in_array($siteUrl, $allowed, true)) {
        $allowed[] = $siteUrl;
    }

    if (in_array($origin, $allowed, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Vary: Origin');
    } elseif ($allowPublicGet && !empty($allowedMethods) && count(array_diff($allowedMethods, ['GET', 'OPTIONS', 'HEAD'])) === 0) {
        header('Access-Control-Allow-Origin: *');
    }

    header('Access-Control-Allow-Methods: ' . implode(', ', $allowedMethods));
    header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
}
