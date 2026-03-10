CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_expires TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Delete existing admin user if any to prevent duplicate errors during re-runs
DELETE FROM admin_users WHERE username = 'Admin';

-- Insert default admin user: Admin / Nurdiansyah@024
-- Note: bcrypt hash of "Nurdiansyah@024"
INSERT INTO admin_users (username, password_hash, email) 
VALUES ('Admin', '$2y$10$BnwY8oWZPA4W7pHyQjrJN.GoxVaDLtuOBHjd5ms7zooZsZ7q57UcS', 'nudiansyahdian28.adv@gmail.com');
