# ⚡ Quick Deploy Guide - 5 Minutes

Get your app deployed to Vercel with a free database in just 5 minutes!

## 🚀 Step 1: Get Free Database (2 minutes)

### Choose PlanetScale (Easiest):

1. **Sign up:** https://planetscale.com (free, no credit card)
2. **Create database:**
   - Click "New database"
   - Name: `gym_management`
   - Plan: **Free**
   - Click "Create"
3. **Get connection string:**
   - Click "Connect" button
   - Copy these values:
     ```
     Host: xxxxx.planetscale.com
     Username: xxxxx
     Password: xxxxx
     Database: gym_management
     Port: 3306
     ```

**📘 More options?** See `FREE_DATABASE_HOSTING.md`

---

## 🚀 Step 2: Deploy to Vercel (2 minutes)

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready to deploy"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to: https://vercel.com/new
   - Import your GitHub repository
   - Click "Deploy"

3. **Add Environment Variables** (in Vercel dashboard):
   - Settings → Environment Variables
   - Add these:
     ```
     DB_HOST=your-planetscale-host.planetscale.com
     DB_PORT=3306
     DB_NAME=gym_management
     DB_USER=your-username
     DB_PASSWORD=your-password
     JWT_SECRET=random_secret_key_at_least_32_characters
     NEXT_PUBLIC_API_URL=/api
     ```

4. **Redeploy:**
   - Deployments → ... → Redeploy

---

## 🗄️ Step 3: Set Up Database Schema (1 minute)

### Option A: Via PlanetScale Console (Easiest)

1. Go to PlanetScale dashboard
2. Click your database → "Branches" → "main" → "Console"
3. Open `backend/database_schema.sql` from your project
4. Copy and paste the SQL into console
5. Click "Run"

### Option B: Via Local Script

1. **Update local `.env.local`** with PlanetScale credentials:
   ```env
   DB_HOST=your-planetscale-host.planetscale.com
   DB_PORT=3306
   DB_NAME=gym_management
   DB_USER=your-username
   DB_PASSWORD=your-password
   ```

2. **Run migrations:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

---

## ✅ Step 4: Test Your Deployment

1. **Visit your Vercel URL:** `https://your-app.vercel.app`
2. **Test API:** `https://your-app.vercel.app/api/health`
3. **Login with default credentials:**
   - Username: `swanand`
   - Password: `password123`

**Done!** 🎉

---

## 🔧 Troubleshooting

### Database connection fails in Vercel:
- ✅ Check all environment variables are set correctly
- ✅ Verify credentials in PlanetScale dashboard
- ✅ Make sure you're using the correct branch (main/production)

### Can't connect locally:
- ✅ Update `.env.local` with PlanetScale credentials
- ✅ Test connection: `npm run db:create`

### Tables not created:
- ✅ Run SQL manually in PlanetScale console
- ✅ Or run `npm run db:migrate` locally

---

## 📚 More Help

- **Free databases:** `FREE_DATABASE_HOSTING.md`
- **Full deployment guide:** `DEPLOYMENT.md`
- **Database setup:** `DATABASE_SETUP.md`

---

**You're live!** 🚀 Your Gym Management System is now deployed with a free database!
