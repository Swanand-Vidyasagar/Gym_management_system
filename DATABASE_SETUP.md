# 🗄️ Database Setup Guide

## Quick Fix for Connection Error

If you're seeing `ECONNREFUSED` error, follow these steps:

## Step 1: Check MySQL is Running

### Windows:
1. Open **Services** (Win + R, type `services.msc`)
2. Look for **MySQL** or **MySQL80** service
3. If it's not running, right-click and select **Start**

Or check via Command Prompt:
```bash
# Check if MySQL is running
sc query MySQL80
```

If not running, start it:
```bash
net start MySQL80
```

### macOS:
```bash
# Check if MySQL is running
sudo /usr/local/mysql/support-files/mysql.server status

# Start MySQL if not running
sudo /usr/local/mysql/support-files/mysql.server start
```

### Linux:
```bash
# Check status
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql
```

## Step 2: Create Environment File

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Copy the example file:**
   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env
   
   # Windows (CMD)
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

3. **Edit `.env` file** with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=gym_management
   DB_USER=root
   DB_PASSWORD=your_actual_mysql_password
   JWT_SECRET=any_random_string_at_least_32_characters_long
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

## Step 3: Find Your MySQL Password

If you don't remember your MySQL password:

### Windows (MySQL Installer):
- Usually set during installation
- Check MySQL Installer if you forgot it

### Reset MySQL Password:

1. **Stop MySQL service**
2. **Start MySQL in safe mode:**
   ```bash
   # Windows - navigate to MySQL bin directory
   cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
   mysqld --skip-grant-tables
   ```

3. **Open new terminal and connect:**
   ```bash
   mysql -u root
   ```

4. **Reset password:**
   ```sql
   USE mysql;
   UPDATE user SET authentication_string=PASSWORD('newpassword') WHERE User='root';
   FLUSH PRIVILEGES;
   EXIT;
   ```

### Or use MySQL Workbench:
- Download MySQL Workbench
- Try connecting with your password
- Reset if needed through Workbench

## Step 4: Test Connection

Test if you can connect to MySQL:

```bash
# Windows
mysql -u root -p

# Enter your password when prompted
```

If this works, your MySQL is running and password is correct.

## Step 5: Run Database Scripts

From the **root project directory** (Gym_management_system):

```bash
# Make sure you have .env file in backend directory
npm run db:create
npm run db:migrate
npm run db:seed
```

Or from backend directory:
```bash
cd backend
npm run db:create
npm run db:migrate
npm run db:seed
```

## Common Issues & Solutions

### Issue: ECONNREFUSED
**Solution:** 
- MySQL server is not running → Start MySQL service
- Wrong port → Check if MySQL is on port 3306 (or update DB_PORT)

### Issue: Access Denied
**Solution:**
- Wrong password → Check your `.env` file
- Wrong username → Usually `root`, but check your setup

### Issue: Can't find .env file
**Solution:**
- Make sure `.env` file is in `backend/` directory
- File name is exactly `.env` (not `.env.txt` or `.env.example`)

### Issue: MySQL not found
**Solution:**
- Install MySQL: https://dev.mysql.com/downloads/installer/
- Or use XAMPP/WAMP (includes MySQL)

## Alternative: Use Root Directory Scripts

If you're running from root directory with the updated setup:

1. **Create `.env.local` in root directory:**
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=gym_management
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   JWT_SECRET=your_secret_key
   NEXT_PUBLIC_API_URL=/api
   ```

2. **Run from root:**
   ```bash
   npm run db:create
   npm run db:migrate
   npm run db:seed
   ```

## Verify Setup

After running scripts, verify:

```bash
# Connect to MySQL
mysql -u root -p

# Check database exists
SHOW DATABASES;
# Should see 'gym_management'

# Use database
USE gym_management;

# Check tables
SHOW TABLES;
# Should see: users, logins, memberships, payments, staff
```

## Still Having Issues?

1. **Check MySQL service is running**
2. **Verify credentials in `.env` file**
3. **Test connection manually:**
   ```bash
   mysql -h localhost -P 3306 -u root -p
   ```
4. **Check firewall isn't blocking port 3306**
5. **Verify MySQL installation is correct**

---

**Quick Checklist:**
- [ ] MySQL service is running
- [ ] `.env` file exists in `backend/` directory
- [ ] Correct password in `.env` file
- [ ] Can connect via `mysql -u root -p`
- [ ] Running scripts from correct directory
