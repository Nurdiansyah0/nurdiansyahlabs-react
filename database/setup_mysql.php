<?php
/**
 * NurdiansyahLabs – MySQL Schema Setup Script
 * Run this script once to generate the database and all necessary tables 
 * to match the JSON structures (posts, leads, analytics).
 * 
 * Usage: php setup_mysql.php or run it from a local browser.
 */

require_once __DIR__ . '/db.php';

try {
    $pdo = getDB();
    if (!$pdo) {
        throw new PDOException("Database connection failed. Please check your credentials in db.php");
    }

    $dbname = $pdo->query("SELECT DATABASE()")->fetchColumn();
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

    // 5. Create the Products Table (for Portfolio Apps)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `products` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `app_id` VARCHAR(50) NOT NULL,
            `name` VARCHAR(255) NOT NULL,
            `description` TEXT,
            `price` DECIMAL(15,2) DEFAULT 0.00,
            `category` VARCHAR(100),
            `image_url` VARCHAR(255),
            `extras` JSON NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX (`app_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");
    echo "✅ Table `products` created successfully.\n";

    // 6. Create Admin Users Table
    $pdo->exec("DROP TABLE IF EXISTS `admin_users` "); // Ensure clean schema for the fix
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `admin_users` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `username` VARCHAR(50) UNIQUE NOT NULL,
            `password_hash` VARCHAR(255) NOT NULL,
            `email` VARCHAR(255) NOT NULL,
            `token` VARCHAR(255) NULL,
            `reset_token` VARCHAR(255) NULL,
            `reset_expires` TIMESTAMP NULL DEFAULT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // Insert Default admin: Admin / Nurdiansyah@024
    $hashed = '$2y$10$BnwY8oWZPA4W7pHyQjrJN.GoxVaDLtuOBHjd5ms7zooZsZ7q57UcS';
    $stmt = $pdo->prepare("INSERT IGNORE INTO admin_users (username, password_hash, email) VALUES (?, ?, ?)");
    $stmt->execute(['Admin', $hashed, 'nudiansyahdian28.adv@gmail.com']);
    echo "✅ Table `admin_users` created and default user initialized (Admin / Nurdiansyah@024).\n";

    // 7. Create Primatera Users Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `primatera_users` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `username` VARCHAR(50) NOT NULL UNIQUE,
            `password_hash` VARCHAR(255) NOT NULL,
            `name` VARCHAR(100) NOT NULL,
            `role` ENUM('viewer', 'mitra') DEFAULT 'viewer',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $stmtPrimatera = $pdo->prepare("INSERT IGNORE INTO `primatera_users` (`username`, `password_hash`, `name`, `role`) VALUES (?, ?, ?, ?)");
    $primateraHash = '$2y$10$VQa19beqbfDTiHVCBf7HmOW9Ph3E7vfHuVejJgWy4M0nuUU7GWe36'; // 'password123'
    $stmtPrimatera->execute(['userdemo1', $primateraHash, 'Demo User 1', 'viewer']);
    $stmtPrimatera->execute(['nardi', $primateraHash, 'Mitra Nardi', 'mitra']);
    $stmtPrimatera->execute(['ardiansyah', $primateraHash, 'Mitra Ardiansyah', 'mitra']);
    echo "✅ Table `primatera_users` created and 5 ERP users initialized (password123).\n";

    // 8. Create Primatera ERP Tables (Records, Transactions, Inventory)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `primatera_records` (
            `id` VARCHAR(50) PRIMARY KEY,
            `date` BIGINT NOT NULL,
            `dateString` VARCHAR(20),
            `flockId` VARCHAR(50),
            `feedConsumedKg` DECIMAL(10,2),
            `medicineUsedPcs` INT DEFAULT 0,
            `mortalityCount` INT,
            `bodyWeightGrams` INT,
            `notes` TEXT,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS `primatera_transactions` (
            `id` VARCHAR(50) PRIMARY KEY,
            `date` BIGINT NOT NULL,
            `dateString` VARCHAR(20),
            `type` VARCHAR(20),
            `category` VARCHAR(50),
            `amount` DECIMAL(15,2),
            `quantity` DECIMAL(10,2),
            `harvestCount` INT DEFAULT 0,
            `notes` TEXT,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

        CREATE TABLE IF NOT EXISTS `primatera_inventory` (
            `id` INT PRIMARY KEY DEFAULT 1,
            `feed` DECIMAL(10,2) DEFAULT 0,
            `medicine` INT DEFAULT 0
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $pdo->exec("INSERT IGNORE INTO `primatera_inventory` (`id`, `feed`, `medicine`) VALUES (1, 0, 0)");
    echo "✅ Tables `primatera_records`, `primatera_transactions`, `primatera_inventory` created.\n";

    echo "\n🎉 All database schemas have been fully synchronized to match your application's structure!\n";

} catch (PDOException $e) {
    die("\n❌ Database Error: " . $e->getMessage() . "\n");
}
?>