# 🚀 Supabase Integration Guide

Complete guide to migrate from MySQL to Supabase (PostgreSQL).

## 📋 What Changed

- **Database:** MySQL → PostgreSQL (Supabase)
- **No MySQL needed** - Everything is hosted on Supabase
- **Connection:** Uses Supabase connection string

## 🔧 Step 1: Install PostgreSQL Dependencies

Add PostgreSQL support to your project:

```bash
cd Gym_management_system
npm install pg pg-hstore
```

## 🔧 Step 2: Get Supabase Connection Details

1. **Go to Supabase Dashboard:** https://supabase.com/dashboard
2. **Select your project**
3. **Go to:** Settings → Database
4. **Copy connection details:**

You'll see connection strings. Use the **Connection Pooling** string for production.

Or use individual values:
- **Host:** `db.xxxxx.supabase.co`
- **Port:** `5432`
- **Database:** `postgres`
- **User:** `postgres` (or your custom user)
- **Password:** Your database password
- **Connection String:** Available in Supabase dashboard

## 🔧 Step 3: Update Environment Variables

### Local Development (.env.local in root):

```env
# Supabase Database Configuration
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_DIALECT=postgres

# Or use connection string (alternative)
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRE=7d

# API Configuration
NEXT_PUBLIC_API_URL=/api

# Supabase Additional Settings (if using Supabase features)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Backend .env (if using separate backend):

Update `backend/.env`:
```env
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_DIALECT=postgres
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

## 🔧 Step 4: Update Database Configuration

Update `backend/config/database.js`:

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Support both connection string and individual values
let sequelizeConfig;

if (process.env.DATABASE_URL) {
  // Use connection string if provided (Supabase connection pooling)
  sequelizeConfig = {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Supabase uses SSL
      }
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5, // Lower for serverless
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  
  sequelize = new Sequelize(process.env.DATABASE_URL, sequelizeConfig);
} else {
  // Use individual connection values
  sequelize = new Sequelize(
    process.env.DB_NAME || 'postgres',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      dialect: process.env.DB_DIALECT || 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Required for Supabase
        }
      },
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, testConnection };
```

## 🗄️ Step 5: Create PostgreSQL Schema

Create `backend/database_schema_postgres.sql` with PostgreSQL-compatible SQL:

```sql
-- Gym Management System Database Schema
-- PostgreSQL (Supabase)

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
```

## 📝 Step 6: Run Schema in Supabase

### Option A: Via Supabase SQL Editor (Easiest)

1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Click **New query**
4. Copy the entire SQL from `database_schema_postgres.sql`
5. Paste and click **Run**

### Option B: Via psql Command Line

```bash
# Connect to Supabase
psql "postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require"

# Run SQL file
\i backend/database_schema_postgres.sql
```

## 🌱 Step 7: Seed Initial Data

After creating tables, you can seed data using the existing seed script, or manually:

```sql
-- Sample staff data
INSERT INTO staff (name, phone, email, role, hire_date) VALUES
('Rajesh Kulkarni', '+91-98765-43210', 'rajesh.kulkarni@gym.com', 'Manager', NOW()),
('Priya Deshpande', '+91-98765-43211', 'priya.deshpande@gym.com', 'Trainer', NOW()),
('Amit Joshi', '+91-98765-43212', 'amit.joshi@gym.com', 'Trainer', NOW()),
('Anjali Patil', '+91-98765-43213', 'anjali.patil@gym.com', 'Receptionist', NOW())
ON CONFLICT DO NOTHING;
```

Or use the seed script:
```bash
npm run db:seed
```

## ✅ Step 8: Test Connection

Update your models to work with PostgreSQL. The Sequelize models should work, but check for:

1. **ENUM types** - Now use CHECK constraints
2. **AUTO_INCREMENT** - Now SERIAL
3. **TIMESTAMP updates** - Now handled by triggers

Test the connection:

```bash
# From backend folder
node -e "require('./config/database').testConnection()"
```

Or start the server:
```bash
npm run dev
```

## 🚀 Step 9: Update Vercel Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

```
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DB_DIALECT=postgres
JWT_SECRET=your_secret_key
NEXT_PUBLIC_API_URL=/api
```

Or use connection string:
```
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

## 🔍 Step 10: Verify Everything Works

1. **Test API endpoints:**
   ```bash
   curl http://localhost:3000/api/health
   ```

2. **Test authentication:**
   - Register a user
   - Login
   - Check JWT token works

3. **Test database operations:**
   - Create membership
   - Create payment
   - Check dashboard stats

## 🔧 Differences: MySQL vs PostgreSQL

| Feature | MySQL | PostgreSQL (Supabase) |
|---------|-------|----------------------|
| Auto Increment | `AUTO_INCREMENT` | `SERIAL` |
| ENUM | `ENUM('value1', 'value2')` | `VARCHAR` + `CHECK` constraint |
| Timestamp Update | `ON UPDATE CURRENT_TIMESTAMP` | Trigger function |
| Boolean | `TINYINT(1)` | `BOOLEAN` |
| String Concatenation | `CONCAT()` | `\|\|` or `CONCAT()` |

## 🐛 Troubleshooting

### Connection Issues

**Error: "ssl required"**
- Add `ssl: { require: true, rejectUnauthorized: false }` to Sequelize config

**Error: "password authentication failed"**
- Check password in Supabase dashboard
- Reset password if needed

**Error: "relation does not exist"**
- Tables not created - run SQL schema in Supabase SQL Editor

### Sequelize Issues

**ENUM errors:**
- PostgreSQL uses CHECK constraints instead of ENUM
- Update models to use `DataTypes.STRING` with validation

**Timestamp issues:**
- PostgreSQL uses triggers for `updated_at`
- Already handled in the schema

## 📚 Next Steps

1. ✅ Database is set up on Supabase
2. ✅ Connection is configured
3. ✅ Tables are created
4. 🚀 Deploy to Vercel
5. 🎉 Your app is live!

## 🔗 Useful Links

- **Supabase Dashboard:** https://supabase.com/dashboard
- **Supabase Docs:** https://supabase.com/docs
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Sequelize PostgreSQL:** https://sequelize.org/docs/v6/other-topics/dialect-specific-things/

---

**Your Supabase integration is complete!** 🎉
