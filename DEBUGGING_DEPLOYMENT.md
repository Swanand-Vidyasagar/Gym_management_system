# 🐛 Debugging Deployment Issues

## Problem: App Stays on Login Page After Deploying

### Common Causes:

1. **Database connection failing** ❌
2. **JWT_SECRET not set or incorrect** ❌
3. **API routes returning errors** ❌
4. **Environment variables not configured** ❌

## ✅ Step-by-Step Debugging

### Step 1: Check Vercel Logs

1. Go to **Vercel Dashboard** → Your Project
2. Click **Deployments** → Click latest deployment
3. Click **Functions** tab
4. Check for errors in API route logs

**Look for:**
- Database connection errors
- JWT errors
- Module not found errors

### Step 2: Test API Endpoints Directly

Visit these URLs on your deployed site:

```
https://your-app.vercel.app/api/health
```

Should return:
```json
{"success":true,"message":"Gym Management API is running"}
```

**If this fails:** API routes aren't working

### Step 3: Check Environment Variables in Vercel

Go to: **Vercel Dashboard** → Settings → Environment Variables

**Required Variables:**
- ✅ `DATABASE_URL` (Supabase connection string)
- ✅ `DB_DIALECT=postgres`
- ✅ `JWT_SECRET` (must be set and same as when tokens were created)
- ✅ `NEXT_PUBLIC_API_URL=/api`

### Step 4: Test Database Connection

Add this test endpoint to check database:

Create `app/api/test-db/route.ts`:
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { sequelize } = await import('../../../../backend/config/database');
    await sequelize.authenticate();
    return NextResponse.json({ 
      success: true, 
      message: 'Database connected successfully' 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      env: {
        hasDbUrl: !!process.env.DATABASE_URL,
        hasDbDialect: !!process.env.DB_DIALECT,
        hasJwtSecret: !!process.env.JWT_SECRET
      }
    }, { status: 500 });
  }
}
```

Visit: `https://your-app.vercel.app/api/test-db`

### Step 5: Check Browser Console

1. Open deployed app in browser
2. Press F12 → Console tab
3. Look for:
   - Network errors (failed API calls)
   - Authentication errors
   - CORS errors

### Step 6: Test Login Flow

1. Try logging in with credentials
2. Check Network tab in browser DevTools
3. Look for `/api/auth/login` request
4. Check if it returns a token

## 🔧 Common Fixes

### Fix 1: Database Connection

**Problem:** `DATABASE_URL` not set correctly

**Solution:**
1. Get connection string from Supabase
2. Add to Vercel as `DATABASE_URL`
3. Make sure it includes `?sslmode=require`

Format:
```
postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require
```

### Fix 2: JWT_SECRET Mismatch

**Problem:** JWT_SECRET in Vercel doesn't match what was used to create tokens

**Solution:**
1. Set `JWT_SECRET` in Vercel environment variables
2. Make sure it's the same value
3. Users may need to log in again (old tokens won't work)

### Fix 3: Missing Environment Variables

**Check these are all set in Vercel:**
```
DATABASE_URL=postgresql://...
DB_DIALECT=postgres
JWT_SECRET=your_secret_key
NEXT_PUBLIC_API_URL=/api
```

### Fix 4: API Routes Not Working

**Check:**
1. Build succeeded on Vercel
2. No TypeScript errors
3. All routes are in `app/api/` directory

## 🧪 Quick Test Script

Add this to test everything:

**Create:** `app/api/debug/route.ts`
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const env = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasDbDialect: !!process.env.DB_DIALECT,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasApiUrl: !!process.env.NEXT_PUBLIC_API_URL,
  };

  try {
    const { sequelize } = await import('../../../../backend/config/database');
    await sequelize.authenticate();
    return NextResponse.json({
      success: true,
      message: 'All checks passed',
      env,
      database: 'connected'
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Database connection failed',
      env,
      error: error.message
    }, { status: 500 });
  }
}
```

Visit: `https://your-app.vercel.app/api/debug`

This will show what's missing!

## ✅ Verification Checklist

After fixing, verify:

- [ ] `/api/health` returns success
- [ ] `/api/debug` shows all environment variables set
- [ ] Can log in successfully
- [ ] Token is saved in localStorage
- [ ] `/api/auth/me` returns user data
- [ ] Redirects to `/dashboard` after login

---

**Still stuck?** Check Vercel function logs for specific error messages!
