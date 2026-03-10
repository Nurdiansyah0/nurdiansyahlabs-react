<?php
/**
 * NurdiansyahLabs – MySQL Schema Setup Script
 * Run this script once to generate the database and all necessary tables 
 * to match the JSON structures (posts, leads, analytics).
 * 
 * Usage: php setup_mysql.php or run it from a local browser.
 */

$host = 'localhost';             // Change if using a remote server
$username = 'uygpuazs_root';              // Change to your MySQL User
$password = 'Nurdiansyah@024';                  // Change to your MySQL Password
$dbname = 'uygpuazs_nurdiansyahlabs_db';  // Change to your desired Database Name

try {
    // Connect directly to the specific database assigned by cPanel
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    echo "✅ Connected to Database `$dbname` successfully.\n";

    // 2. Create the Posts Table (matches posts.json)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `posts` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `slug` VARCHAR(255) UNIQUE NOT NULL,
            `title` VARCHAR(255) NOT NULL,
            `description` TEXT,
            `service` VARCHAR(50),
            `serviceLabel` VARCHAR(100),
            `accent` VARCHAR(20),
            `accentLight` VARCHAR(20),
            `img` VARCHAR(255) NULL,
            `faqs` JSON NULL,
            `content` LONGTEXT,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    echo "✅ Table `posts` created successfully.\n";

    // 3. Create the Leads Table (matches leads.json)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `leads` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(255) NOT NULL,
            `contact` VARCHAR(255) NOT NULL,
            `service` VARCHAR(100),
            `message` TEXT,
            `timestamp` DATETIME NOT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    echo "✅ Table `leads` created successfully.\n";

    // 4. Create the Analytics Table (matches analytics.json)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `analytics` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `type` VARCHAR(50) NOT NULL,
            `path` VARCHAR(255) NULL,
            `visitorId` VARCHAR(255) NOT NULL,
            `timestamp` DATETIME NOT NULL,
            `title` VARCHAR(255) NULL,
            `service` VARCHAR(100) NULL,
            `duration` INT NULL,
            `route` VARCHAR(255) NULL,
            `userAgent` TEXT,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    echo "✅ Table `analytics` created successfully.\n";

    echo "\n🎉 All database schemas have been fully synchronized to match your application's JSON structure!\n";

} catch (PDOException $e) {
    die("\n❌ Database Error: " . $e->getMessage() . "\n");
}
?>