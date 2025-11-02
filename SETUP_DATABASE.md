# 🚀 Quick Database Setup

## Fix the Connection Error

You're seeing `ECONNREFUSED` because:
1. **MySQL server is not running**, OR
2. **Missing `.env` file** with database credentials

## Quick Fix (Choose One Method)

### Method 1: Setup in Backend Directory (Recommended)

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Create `.env` file** (copy from example):
   ```bash
   # Windows PowerShell
   Copy-Item .env.example .env
   
   # Windows CMD
   copy .env.example .env
   
   # Mac/Linux
   cp .env.example .env
   ```

3. **Edit `.env` file** with your MySQL password:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=gym_management
   DB_USER=root
   DB_PASSWORD=YOUR_ACTUAL_MYSQL_PASSWORD_HERE
   JWT_SECRET=any_random_string_at_least_32_characters_long
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MySQL** (if not running):
   ```bash
   # Windows
   net start MySQL80
   
   # Or check Services → MySQL80
   ```

5. **Run the script:**
   ```bash
   npm run db:create
   ```

### Method 2: Setup in Root Directory

1. **Create `.env.local` in root** (`Gym_management_system/.env.local`):
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=gym_management
   DB_USER=root
   DB_PASSWORD=YOUR_ACTUAL_MYSQL_PASSWORD_HERE
   JWT_SECRET=any_random_string_at_least_32_characters_long
   NEXT_PUBLIC_API_URL=/api
   ```

2. **Copy to backend** (scripts still look in backend folder):
   ```bash
   # Windows PowerShell
   Copy-Item .env.local backend\.env
   ```

3. **Run from root:**
   ```bash
   npm run db:create
   ```

## Check MySQL is Running

### Windows:
```bash
# Check status
sc query MySQL80

# Start if not running
net start MySQL80
```

Or open **Services** (Win+R → `services.msc`) and start **MySQL80**

### Test MySQL Connection:
```bash
mysql -u root -p
# Enter your password
```

If this works, your MySQL is running correctly!

## Still Not Working?

1. **Check MySQL Installation:**
   - Is MySQL installed? Download: https://dev.mysql.com/downloads/installer/
   - Or use XAMPP (includes MySQL): https://www.apachefriends.org/

2. **Verify Password:**
   - Try: `mysql -u root -p`
   - If it asks for password, use that in `.env`

3. **Check Port:**
   - Default is 3306
   - If using XAMPP, it might be different

4. **See full troubleshooting:** Check `DATABASE_SETUP.md`

## Next Steps After Database is Created

```bash
# Create tables
npm run db:migrate

# Add sample data
npm run db:seed
```

## Default Login Credentials (after seeding)

- **Admin:** `swanand` / `password123`
- **Member:** `rohit_pawar` / `password123`
- **Member:** `kavita_more` / `password123`

---

**Need more help?** See `DATABASE_SETUP.md` for detailed troubleshooting.
