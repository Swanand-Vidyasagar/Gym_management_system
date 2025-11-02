# 🚀 Quick Fix: Start Your Backend

## Issue: Backend is NOT running

The backend server needs to be started for login to work.

## Quick Start Steps:

### 1. Open a NEW Terminal Window
Keep your frontend running in the current terminal, open a new one for the backend.

### 2. Navigate to Backend Directory
```bash
cd backend
```

### 3. Check if .env file exists
```bash
# Windows PowerShell
if (Test-Path ".env") { Write-Output "✅ .env exists" } else { Write-Output "❌ Create .env file" }
```

If `.env` doesn't exist, create it:
```bash
copy .env.example .env
```

Then edit `.env` with your MySQL password:
```env
DB_PASSWORD=your_mysql_password_here
JWT_SECRET=any_random_string_minimum_32_characters
```

### 4. Start the Backend Server
```bash
npm run dev
```

You should see:
```
✅ Database connection established successfully.
🚀 Server running on http://localhost:3001
📊 API available at http://localhost:3001/api
💚 Health check: http://localhost:3001/api/health
```

### 5. Test Backend is Running
Open in browser: http://localhost:3001/api/health

You should see:
```json
{
  "success": true,
  "message": "Gym Management API is running",
  "timestamp": "..."
}
```

## If Backend Won't Start:

### Issue 1: Database Connection Error
**Error:** `Unable to connect to the database`

**Solution:**
1. Make sure MySQL is running:
   - Windows: Check Services (services.msc) → MySQL80
   - Or run: `net start MySQL80`
2. Check your `.env` file has correct MySQL credentials

### Issue 2: Database Doesn't Exist
**Error:** `Unknown database 'gym_management'`

**Solution:**
```bash
cd backend
npm run db:create
npm run db:migrate
npm run db:seed
```

### Issue 3: Missing Dependencies
**Error:** `Cannot find module...`

**Solution:**
```bash
cd backend
npm install
```

## Test Login After Backend Starts:

1. Backend running on: http://localhost:3001
2. Frontend running on: http://localhost:3000
3. Try logging in with:
   - Username: `swanand`
   - Password: `password123`
   - Name: Swanand Vidyasagar

## Summary:

✅ Frontend is running (on port 3000)  
❌ Backend is NOT running (needs to be on port 3001)

**Fix:** Start backend in a separate terminal with `npm run dev` in the `backend` folder.

