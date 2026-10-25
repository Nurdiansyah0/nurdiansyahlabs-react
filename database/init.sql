CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL,
    service VARCHAR(255) NULL,
    message TEXT NOT NULL,
    timestamp DATETIME NOT NULL
);

-- Primatera ERP Seeder
CREATE TABLE IF NOT EXISTS `primatera_users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `role` ENUM('viewer', 'mitra') DEFAULT 'viewer',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TRUNCATE TABLE `primatera_users`;

INSERT INTO `primatera_users` (`username`, `password_hash`, `name`, `role`) VALUES 
('userdemo1', '$2y$10$VQa19beqbfDTiHVCBf7HmOW9Ph3E7vfHuVejJgWy4M0nuUU7GWe36', 'Demo User 1', 'viewer'),
('userdemo2', '$2y$10$VQa19beqbfDTiHVCBf7HmOW9Ph3E7vfHuVejJgWy4M0nuUU7GWe36', 'Demo User 2', 'viewer'),
('userdemo3', '$2y$10$VQa19beqbfDTiHVCBf7HmOW9Ph3E7vfHuVejJgWy4M0nuUU7GWe36', 'Demo User 3', 'viewer'),
('nardi', '$2y$10$VQa19beqbfDTiHVCBf7HmOW9Ph3E7vfHuVejJgWy4M0nuUU7GWe36', 'Mitra Nardi', 'mitra'),
('ardiansyah', '$2y$10$VQa19beqbfDTiHVCBf7HmOW9Ph3E7vfHuVejJgWy4M0nuUU7GWe36', 'Mitra Ardiansyah', 'mitra');
