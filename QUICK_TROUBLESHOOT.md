# 🚨 Quick Troubleshooting Guide

## What's Not Working?

### Issue 1: "npm run dev" Doesn't Start

**Error:** Command not found or script fails

**Fix:**
```bash
# Make sure you're in the right directory
cd Gym_management_system

# Install dependencies first
npm install

# Then start
npm run dev
```

---

### Issue 2: Port 3000 Already in Use

**Error:** "Port 3000 is already in use"

**Fix Option A - Kill the process:**
```powershell
# Windows PowerShell
netstat -ano | findstr :3000
# Note the PID number
taskkill /PID <PID_NUMBER> /F
```

**Fix Option B - Use different port:**
```bash
npm run dev -- -p 3001
# Then visit: http://localhost:3001
```

---

### Issue 3: Page Loads But Shows Errors

**Check Browser Console:**
1. Press **F12** → **Console** tab
2. Look for red errors
3. Share the error message

**Common Errors:**

#### "Failed to fetch" or "NetworkError"
- **Cause:** API routes not working
- **Fix:** Check `.env.local` file exists

#### "Cannot connect to database"
- **Cause:** Database credentials wrong
- **Fix:** Check `DATABASE_URL` or `DB_HOST` in `.env.local`

---

### Issue 4: Login Doesn't Work / Stays on Login Page

**Quick Test:**
1. Open: http://localhost:3000/api/health
2. Should show: `{"success":true,"message":"Gym Management API is running"}`

**If health check fails:**
- API routes not working
- Check `.env.local` file

**Test Database:**
1. Open: http://localhost:3000/api/test-db
2. Should show database connected

**If test-db fails:**
- Database connection issue
- Check Supabase credentials in `.env.local`

---

### Issue 5: "Module not found" Errors

**Error:** Cannot find module 'backend/models'

**Fix:**
```bash
# Make sure you're in Gym_management_system directory
cd Gym_management_system

# Reinstall dependencies
npm install

# Clear Next.js cache
rm -rf .next
# Or on Windows:
Remove-Item -Recurse -Force .next

# Restart dev server
npm run dev
```

---

## 🚀 Quick Fix Checklist

Run these commands in order:

```bash
# 1. Navigate to project
cd Gym_management_system

# 2. Install dependencies
npm install

# 3. Check if .env.local exists
# If NOT, create it with your Supabase credentials

# 4. Clear cache
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# 5. Start dev server
npm run dev
```

---

## 📝 Create .env.local File

**Location:** `Gym_management_system/.env.local`

**For Supabase:**
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require
DB_DIALECT=postgres
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
NEXT_PUBLIC_API_URL=/api
```

**For Local MySQL:**
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gym_management
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_secret_key
NEXT_PUBLIC_API_URL=/api
```

---

## 🔍 Debug Steps

### Step 1: Check Dev Server is Running

Look for this in terminal:
```
✓ Ready in 2.5s
○ Compiling / ...
✓ Compiled / in 500ms
```

### Step 2: Test in Browser

1. Open: http://localhost:3000
2. Press **F12** → **Console** tab
3. Look for errors

### Step 3: Test API

Open these URLs:

- http://localhost:3000/api/health
- http://localhost:3000/api/debug
- http://localhost:3000/api/test-db

Each should return JSON (not an error page).

---

## 💬 Tell Me What You See

Please share:

1. **What error message do you see?** (Browser console or terminal)
2. **What happens when you run `npm run dev`?**
3. **What happens when you visit http://localhost:3000?**
4. **Do you have `.env.local` file?** (Check in `Gym_management_system` folder)

---

## ⚡ Most Common Issues & Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| "npm: command not found" | Install Node.js: https://nodejs.org |
| Port 3000 in use | Use port 3001: `npm run dev -- -p 3001` |
| "Cannot find module" | Run `npm install` |
| "Failed to fetch" | Create `.env.local` file |
| Database error | Check Supabase credentials |
| Page blank/errors | Check browser console (F12) |

---

**Share the specific error and I'll help fix it!** 🔧
