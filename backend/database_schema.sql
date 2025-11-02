-- Gym Management System Database Schema
-- MySQL Database

-- ===========================================
-- TABLES CREATION
-- ===========================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    address TEXT,
    role ENUM('member', 'admin', 'staff') DEFAULT 'member' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Login Table (one-to-one with Users)
CREATE TABLE IF NOT EXISTS logins (
    login_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_id INT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Staff Table
CREATE TABLE IF NOT EXISTS staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('Trainer', 'Manager', 'Receptionist') DEFAULT 'Trainer' NOT NULL,
    hire_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Memberships Table (many-to-one with Users and Staff)
CREATE TABLE IF NOT EXISTS memberships (
    membership_id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('Basic', 'Premium Plus', 'Elite Pro', 'Annual Unlimited') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    user_id INT NOT NULL,
    staff_id INT NOT NULL,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_staff_id (staff_id),
    INDEX idx_status (status),
    INDEX idx_end_date (end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payments Table (many-to-one with Users and Memberships)
CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    payment_method ENUM('UPI', 'Card', 'Cash', 'Net Banking') NOT NULL,
    user_id INT NOT NULL,
    membership_id INT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (membership_id) REFERENCES memberships(membership_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_membership_id (membership_id),
    INDEX idx_payment_date (payment_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===========================================
-- STORED PROCEDURES
-- ===========================================

-- Procedure to update membership status to expired
DELIMITER $$
CREATE PROCEDURE IF NOT EXISTS UpdateExpiredMemberships()
BEGIN
    UPDATE memberships
    SET status = 'expired'
    WHERE end_date < CURDATE() AND status = 'active';
END$$
DELIMITER ;

-- ===========================================
-- VIEWS
-- ===========================================

-- View: Active Members with Details
CREATE OR REPLACE VIEW vw_active_members AS
SELECT 
    m.membership_id,
    u.user_id,
    u.name AS member_name,
    u.email AS member_email,
    u.phone AS member_phone,
    m.type AS membership_type,
    m.start_date,
    m.end_date,
    m.price,
    DATEDIFF(m.end_date, CURDATE()) AS days_remaining,
    s.name AS staff_name,
    s.role AS staff_role
FROM memberships m
JOIN users u ON m.user_id = u.user_id
JOIN staff s ON m.staff_id = s.staff_id
WHERE m.status = 'active' AND m.end_date >= CURDATE();

-- View: Payment Summary by User
CREATE OR REPLACE VIEW vw_payment_summary AS
SELECT 
    u.user_id,
    u.name AS member_name,
    u.email AS member_email,
    COUNT(p.payment_id) AS total_payments,
    COALESCE(SUM(p.amount), 0) AS total_paid,
    MAX(p.payment_date) AS last_payment_date
FROM users u
LEFT JOIN payments p ON u.user_id = p.user_id
WHERE u.role = 'member'
GROUP BY u.user_id, u.name, u.email;

-- View: Revenue by Payment Method
CREATE OR REPLACE VIEW vw_revenue_by_method AS
SELECT 
    payment_method,
    COUNT(*) AS transaction_count,
    SUM(amount) AS total_amount,
    AVG(amount) AS avg_amount
FROM payments
WHERE status = 'completed'
GROUP BY payment_method;

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- Additional composite indexes for common queries
CREATE INDEX idx_membership_user_status ON memberships(user_id, status);
CREATE INDEX idx_payment_user_date ON payments(user_id, payment_date);

-- ===========================================
-- TRIGGERS
-- ===========================================

-- Trigger to automatically update membership status to expired
DELIMITER $$
CREATE TRIGGER IF NOT EXISTS trg_check_membership_expiry
AFTER INSERT ON memberships
FOR EACH ROW
BEGIN
    IF NEW.end_date < CURDATE() THEN
        SET NEW.status = 'expired';
    END IF;
END$$
DELIMITER ;

-- ===========================================
-- SAMPLE DATA (Optional)
-- ===========================================

-- Insert sample staff
INSERT INTO staff (name, phone, email, role, hire_date) VALUES
('Rajesh Kulkarni', '+91-98765-43210', 'rajesh.kulkarni@gym.com', 'Manager', NOW()),
('Priya Deshpande', '+91-98765-43211', 'priya.deshpande@gym.com', 'Trainer', NOW()),
('Amit Joshi', '+91-98765-43212', 'amit.joshi@gym.com', 'Trainer', NOW()),
('Anjali Patil', '+91-98765-43213', 'anjali.patil@gym.com', 'Receptionist', NOW());

-- ===========================================
-- GRANTS (Adjust as needed for your setup)
-- ===========================================

-- Example: Grant permissions to app user
-- GRANT ALL PRIVILEGES ON gym_management.* TO 'gym_app_user'@'localhost' IDENTIFIED BY 'secure_password';
-- FLUSH PRIVILEGES;

-- ===========================================
-- NOTES
-- ===========================================

-- Membership Duration Reference:
-- - Basic: 30 days
-- - Premium Plus: 90 days
-- - Elite Pro: 180 days
-- - Annual Unlimited: 365 days

-- Auto Expiry Check:
-- Run this event scheduler to auto-update expired memberships:
-- SET GLOBAL event_scheduler = ON;
-- CREATE EVENT IF NOT EXISTS evt_daily_membership_check
-- ON SCHEDULE EVERY 1 DAY
-- STARTS '2024-01-15 00:00:00'
-- DO CALL UpdateExpiredMemberships();

