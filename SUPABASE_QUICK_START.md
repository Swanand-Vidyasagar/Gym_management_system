# ⚡ Supabase Quick Start - 5 Minutes

Get your app connected to Supabase in 5 minutes!

## 🚀 Step 1: Install Dependencies (1 minute)

```bash
cd Gym_management_system
npm install pg pg-hstore
```

## 🔑 Step 2: Get Supabase Credentials (2 minutes)

1. **Go to:** https://supabase.com/dashboard
2. **Select your project** (or create new one)
3. **Go to:** Settings → Database
4. **Copy connection string:**
   - Click "Connection string" → "URI"
   - Or copy individual values:
     - Host: `db.xxxxx.supabase.co`
     - Port: `5432`
     - Database: `postgres`
     - User: `postgres`
     - Password: (your password)

## ⚙️ Step 3: Update Environment Variables (1 minute)

### Option A: Use Connection String (Easiest)

Create/update `.env.local` in root:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres?sslmode=require
DB_DIALECT=postgres
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
NEXT_PUBLIC_API_URL=/api
```

### Option B: Use Individual Values

```env
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DB_DIALECT=postgres
JWT_SECRET=your_secret_key
NEXT_PUBLIC_API_URL=/api
```

## 🗄️ Step 4: Create Database Schema (1 minute)

1. **Go to Supabase Dashboard**
2. **Click:** SQL Editor
3. **Click:** New query
4. **Open:** `backend/database_schema_postgres.sql`
5. **Copy entire file** and paste into SQL Editor
6. **Click:** Run (or press Ctrl+Enter)

✅ Tables created!

## ✅ Step 5: Test Connection

```bash
# Test from backend
cd backend
node -e "require('./config/database').testConnection().then(() => process.exit(0)).catch(() => process.exit(1))"
```

Should see: `✅ Database connection established successfully.`

## 🎉 You're Done!

Your app is now connected to Supabase!

### Next Steps:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Test API:**
   - Visit: http://localhost:3000/api/health
   - Should work!

3. **Seed sample data (optional):**
   ```bash
   npm run db:seed
   ```

## 🚀 Deploy to Vercel

1. **Add environment variables in Vercel:**
   - Go to Vercel dashboard → Your project → Settings → Environment Variables
   - Add all variables from `.env.local`

2. **Redeploy:**
   - Deployments → ... → Redeploy

## 🔧 Troubleshooting

**Connection error?**
- Check SSL is enabled (already configured)
- Verify password is correct
- Check Supabase project is active

**Tables not created?**
- Run SQL in Supabase SQL Editor
- Check for errors in SQL Editor

**Sequelize errors?**
- Make sure `pg` and `pg-hstore` are installed
- Check `DB_DIALECT=postgres` is set

---

**See `SUPABASE_SETUP.md` for detailed guide!**
