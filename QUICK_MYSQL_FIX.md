# ⚡ Quick Fix: MySQL Command Not Found

## ✅ Solution: You Don't Need the mysql Command!

**Good news:** Your project doesn't require the `mysql` command line tool. The Node.js scripts will connect directly!

## 🚀 Quick Setup (3 Steps)

### Step 1: Start MySQL Service

Open PowerShell as Administrator and run:

```powershell
net start MySQL80
```

**Or manually:**
- Press `Win + R`, type `services.msc`
- Find **MySQL80** (or **MySQL**)
- Right-click → **Start**

### Step 2: Create `.env` File

Navigate to backend folder:
```powershell
cd Gym_management_system\backend
```

Create `.env` file with this content:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gym_management
DB_USER=root
DB_PASSWORD=
JWT_SECRET=my_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:3000
```

**Note:** If you don't know your MySQL password:
- Try leaving `DB_PASSWORD=` empty (no password)
- Or try `DB_PASSWORD=root`
- Or check MySQL Workbench if you set it up there

### Step 3: Run Database Scripts

From the backend directory:
```powershell
npm run db:create
npm run db:migrate
npm run db:seed
```

**Done!** ✅

## 🔧 Optional: Add MySQL to PATH (If You Want mysql Command)

If you want to use `mysql` command in the future:

1. Press `Win + X` → **System**
2. Click **Advanced system settings**
3. Click **Environment Variables**
4. Under **User variables**, find **Path** → **Edit**
5. Click **New** → Add: `C:\Program Files\MySQL\MySQL Server 8.0\bin`
6. Click **OK** on all windows
7. **Restart PowerShell/CMD**

Then test:
```bash
mysql -u root -p
```

## 🎯 Alternative: Use MySQL Workbench

You already have **MySQL Workbench 8.0** installed!

1. Open **MySQL Workbench**
2. Click **Local instance MySQL80**
3. Enter password (if prompted)
4. Run SQL commands there

You can create the database manually:
```sql
CREATE DATABASE IF NOT EXISTS gym_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## ❓ Don't Know Your MySQL Password?

### Try These Common Defaults:
1. **Empty** (no password) - Try `DB_PASSWORD=` in `.env`
2. **root** - Try `DB_PASSWORD=root`
3. **Check MySQL Workbench** - If you connected there before, use that password

### If None Work, Reset Password:

**Quick Reset Method:**
1. Stop MySQL: `net stop MySQL80`
2. Create file `C:\reset-mysql.txt`:
   ```
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword123';
   FLUSH PRIVILEGES;
   ```
3. Run:
   ```powershell
   cd "C:\Program Files\MySQL\MySQL Server 8.0\bin"
   .\mysqld.exe --init-file=C:\reset-mysql.txt --console
   ```
4. Wait a few seconds, then press `Ctrl+C`
5. Start MySQL: `net start MySQL80`
6. Use password: `newpassword123` in `.env`
7. Delete the file: `del C:\reset-mysql.txt`

## ✅ Test Your Setup

After creating `.env` file, test the connection:

**Create test file:** `backend/test-connection.js`
```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    console.log('✅ MySQL connection successful!');
    await conn.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\nCheck:');
    console.error('1. MySQL service is running (net start MySQL80)');
    console.error('2. Password is correct in .env file');
  }
}
test();
```

Run:
```powershell
cd backend
node test-connection.js
```

## 📋 Checklist

- [ ] MySQL service is running (`net start MySQL80`)
- [ ] `.env` file exists in `backend/` folder
- [ ] `.env` has correct password (or empty if no password)
- [ ] Run `npm run db:create` from backend folder

---

**You're all set!** The Node.js scripts will handle everything. You don't need the `mysql` command! 🎉
