-- NurdiansyahLabs MySQL Schema
-- Run these commands in cPanel's phpMyAdmin or MySQL Terminal

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

CREATE TABLE IF NOT EXISTS `leads` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `contact` VARCHAR(255) NOT NULL,
    `service` VARCHAR(100),
    `message` TEXT,
    `timestamp` DATETIME NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
