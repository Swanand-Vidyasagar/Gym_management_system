# 🔗 Connecting Supabase to Vercel - Quick Guide

## When Vercel Asks for "Custom Prefix"

### What It Means
- **NOT a URL to enter** ❌
- **A prefix for environment variable names** ✅

### What to Enter

**Best Option: Leave Empty or Use "DATABASE"**

This will create:
- `DATABASE_URL` ✅ (Your code uses this!)

### Steps:

1. **In the Custom Prefix field:**
   - **Leave it empty** (default)
   - **OR** type: `DATABASE`
   
2. **Check Environments:**
   - ✅ Development
   - ✅ Preview  
   - ✅ Production

3. **Click "Connect"**

## After Connecting

### Check Environment Variables in Vercel:

1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

2. You should see:
   ```
   DATABASE_URL=postgresql://postgres:xxx@db.xxxxx.supabase.co:5432/postgres
   ```

3. **If `DATABASE_URL` is missing**, add it manually:
   - Get connection string from Supabase Dashboard
   - Settings → Database → Connection string → URI
   - Add to Vercel as `DATABASE_URL`

### Additional Variables You May Need:

Add these in Vercel manually:

```env
DB_DIALECT=postgres
JWT_SECRET=your_secret_key_at_least_32_characters
NEXT_PUBLIC_API_URL=/api
```

## Common Prefixes and What They Create

| Prefix | Creates Variables Like | Your Code? |
|--------|------------------------|------------|
| (empty) | `DATABASE_URL` | ✅ Perfect! |
| `DATABASE` | `DATABASE_URL` | ✅ Perfect! |
| `DB` | `DB_URL`, `DB_HOST` | ⚠️ Works but not preferred |
| `STORAGE` | `STORAGE_URL` | ❌ Wrong for database |

## ✅ Recommended Setup

1. **Custom Prefix:** Leave empty or `DATABASE`
2. **Environments:** Check all (Development, Preview, Production)
3. **Result:** `DATABASE_URL` is automatically created
4. **Add manually:** `DB_DIALECT=postgres`, `JWT_SECRET`, `NEXT_PUBLIC_API_URL`

## 🚀 Your Code Already Supports This!

Your `backend/config/database.js` checks for `DATABASE_URL` first:

```javascript
if (process.env.DATABASE_URL && dialect === 'postgres') {
  // Uses DATABASE_URL - perfect!
}
```

So once Vercel creates `DATABASE_URL`, your app will use it automatically!

---

**Summary:** Leave prefix empty or use "DATABASE" - your code is already set up for this! ✅
