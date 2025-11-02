# 🚀 Complete Setup Guide

This guide will walk you through setting up the Gym Management System backend from scratch.

## Step 1: Install MySQL

If you don't have MySQL installed:

**Windows:**
1. Download MySQL from https://dev.mysql.com/downloads/installer/
2. Run the installer
3. Remember your root password

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

## Step 2: Install Node.js

Download and install Node.js from https://nodejs.org/ (v14 or higher recommended)

Verify installation:
```bash
node --version
npm --version
```

## Step 3: Clone and Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

## Step 4: Configure Environment

Create `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` file with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gym_management
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_ROOT_PASSWORD

JWT_SECRET=change_this_to_a_random_secret_key_minimum_32_characters
```

## Step 5: Setup Database

### 5.1 Create Database
```bash
npm run db:create
```

This will create the `gym_management` database if it doesn't exist.

### 5.2 Run Migrations
```bash
npm run db:migrate
```

This will create all necessary tables.

### 5.3 Seed Sample Data
```bash
npm run db:seed
```

This will populate the database with sample users, staff, memberships, and payments.

## Step 6: Start the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

You should see:
```
✅ Database connection established successfully.
🚀 Server running on http://localhost:3001
📊 API available at http://localhost:3001/api
💚 Health check: http://localhost:3001/api/health
```

## Step 7: Test the API

### Check Health
Open browser or use curl:
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Gym Management API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "swanand",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "user_id": 1,
      "name": "Swanand Vidyasagar",
      "email": "swanand.vidyasagar@example.com",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Test Protected Route
Use the token from login above:
```bash
curl http://localhost:3001/api/memberships \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Database Connection Error

**Problem:** `Unable to connect to the database`

**Solutions:**
1. Check MySQL is running:
   ```bash
   # Windows
   net start MySQL80
   
   # macOS/Linux
   sudo service mysql start
   ```

2. Verify credentials in `.env`:
   - Check DB_HOST, DB_PORT, DB_USER, DB_PASSWORD

3. Test MySQL connection manually:
   ```bash
   mysql -h localhost -u root -p
   ```

### Port Already in Use

**Problem:** `EADDRINUSE: address already in use :::3001`

**Solutions:**
1. Change PORT in `.env` file
2. Kill process using port 3001:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:3001 | xargs kill -9
   ```

### Migration Errors

**Problem:** Tables already exist

**Solutions:**
1. Drop database and recreate:
   ```bash
   mysql -u root -p
   DROP DATABASE gym_management;
   exit;
   npm run db:create
   npm run db:migrate
   ```

2. Or use force sync (⚠️ deletes all data):
   Edit `backend/scripts/migrateDatabase.js`:
   ```javascript
   await sequelize.sync({ force: true }); // WARNING: deletes all data
   ```

### Module Not Found Errors

**Problem:** Cannot find module 'xxxx'

**Solutions:**
1. Reinstall dependencies:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Check Node.js version:
   ```bash
   node --version  # Should be v14 or higher
   ```

## Next Steps

1. ✅ Backend is running successfully
2. 📝 Test all API endpoints using Postman or curl
3. 🌐 Configure frontend to connect to this backend
4. 🔒 Change default passwords
5. 📧 Configure email settings for notifications

## Frontend Integration

Update your Next.js frontend to use this backend:

Create a `.env.local` file in your root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Production Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET` (at least 32 characters)
3. Configure proper CORS settings
4. Use environment variables for all secrets
5. Enable SSL/HTTPS
6. Use a production database (not localhost)
7. Set up proper logging and monitoring

## Need Help?

If you encounter issues:
1. Check the troubleshooting section
2. Review error logs in console
3. Verify all environment variables
4. Ensure MySQL is running
5. Check port availability

