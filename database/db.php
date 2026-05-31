<?php
/**
 * NurdiansyahLabs – Centralized MySQL Database Connection
 * Provides a single PDO instance for all API endpoint operations
 */

function getDB()
{
    // !! DB credentials MUST come from environment variables. !!
    // Dev: set in Docker Compose. cPanel: set via .user.ini or SetEnv in .htaccess.
    // Do NOT add hardcoded fallback passwords here — this file is version-controlled.
    // 1. Coba baca file konfigurasi lokal di cPanel (agar tidak ter-overwrite oleh Git)
    if (file_exists(__DIR__ . '/env.local.php')) {
        require_once __DIR__ . '/env.local.php';
    }

    $host = getenv('DB_HOST') ?: (defined('DB_HOST') ? DB_HOST : 'localhost');
    $username = getenv('DB_USER') ?: (defined('DB_USER') ? DB_USER : 'root');
    $password = (getenv('DB_PASS') !== false) ? getenv('DB_PASS') : (defined('DB_PASS') ? DB_PASS : '');
    $dbname = getenv('DB_NAME') ?: (defined('DB_NAME') ? DB_NAME : 'uygpuazs_nurdiansyahlabs_db');

    try {
        // Biarkan PHP yang menentukan socket default dari php.ini (hapus unix_socket statis)
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        // Ensure returning associative arrays by default for easy JSON encoding
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        return $pdo;
    } catch (PDOException $e) {
        // Log the error securely instead of exposing to frontend in production
        error_log("Database Connection Error: " . $e->getMessage());
        // Allow the script to continue without a database (useful for local development)
        return null;
    }
}
