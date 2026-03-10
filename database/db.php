<?php
/**
 * NurdiansyahLabs – Centralized MySQL Database Connection
 * Provides a single PDO instance for all API endpoint operations
 */

function getDB()
{
    // Map to Docker Environment Variables, fall back to cPanel defaults
    $host = getenv('DB_HOST') ?: 'localhost';
    $username = getenv('DB_USER') ?: 'uygpuazs_root';
    $password = getenv('DB_PASS') !== false ? getenv('DB_PASS') : 'Nurdiansyah@024';
    $dbname = getenv('DB_NAME') ?: 'uygpuazs_nurdiansyahlabs_db';

    try {
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
