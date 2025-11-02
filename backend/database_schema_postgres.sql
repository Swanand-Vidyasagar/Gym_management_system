-- Gym Management System Database Schema
-- PostgreSQL (Supabase Compatible)

-- Enable UUID extension (if needed)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- TABLES CREATION
-- ===========================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    address TEXT,
    role VARCHAR(20) DEFAULT 'member' NOT NULL CHECK (role IN ('member', 'admin', 'staff')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role ON users(role);

-- Login Table (one-to-one with Users)
CREATE TABLE IF NOT EXISTS logins (
    login_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logins_username ON logins(username);

-- Staff Table
CREATE TABLE IF NOT EXISTS staff (
    staff_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role VARCHAR(20) DEFAULT 'Trainer' NOT NULL CHECK (role IN ('Trainer', 'Manager', 'Receptionist')),
    hire_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_staff_email ON staff(email);
CREATE INDEX idx_staff_role ON staff(role);

-- Memberships Table
CREATE TABLE IF NOT EXISTS memberships (
    membership_id SERIAL PRIMARY KEY,
    type VARCHAR(30) NOT NULL CHECK (type IN ('Basic', 'Premium Plus', 'Elite Pro', 'Annual Unlimited')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    staff_id INTEGER NOT NULL REFERENCES staff(staff_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_memberships_user_id ON memberships(user_id);
CREATE INDEX idx_memberships_staff_id ON memberships(staff_id);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_end_date ON memberships(end_date);
CREATE INDEX idx_membership_user_status ON memberships(user_id, status);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    payment_id SERIAL PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('UPI', 'Card', 'Cash', 'Net Banking')),
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    membership_id INTEGER REFERENCES memberships(membership_id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_membership_id ON payments(membership_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payment_user_date ON payments(user_id, payment_date);

-- ===========================================
-- FUNCTIONS AND TRIGGERS
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_logins_updated_at BEFORE UPDATE ON logins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check membership expiry
CREATE OR REPLACE FUNCTION check_membership_expiry()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.end_date < CURRENT_DATE THEN
        NEW.status = 'expired';
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for membership expiry
CREATE TRIGGER trg_check_membership_expiry
    BEFORE INSERT OR UPDATE ON memberships
    FOR EACH ROW EXECUTE FUNCTION check_membership_expiry();

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
    (m.end_date - CURRENT_DATE) AS days_remaining,
    s.name AS staff_name,
    s.role AS staff_role
FROM memberships m
JOIN users u ON m.user_id = u.user_id
JOIN staff s ON m.staff_id = s.staff_id
WHERE m.status = 'active' AND m.end_date >= CURRENT_DATE;

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

