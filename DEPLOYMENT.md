# 🚀 Deployment Guide - Vercel

Complete guide to deploy your Gym Management System to Vercel.

## 📋 Prerequisites

1. **GitHub Account** - Your code should be in a GitHub repository
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **MySQL Database** - You'll need a hosted MySQL database (PlanetScale, Railway, or any MySQL provider)

## 🔧 Step 1: Set Up Your Database

**📘 For detailed free database hosting options, see: `FREE_DATABASE_HOSTING.md`**

### Option A: PlanetScale ⭐ (Recommended - 100% Free)

1. Go to [PlanetScale.com](https://planetscale.com) and sign up (free)
2. Create a new database (select Free plan)
3. Copy your connection details (host, username, password, database name)
4. **See `FREE_DATABASE_HOSTING.md` for detailed setup steps**

### Option B: Railway (Free Tier with $5 Credit)

1. Go to [Railway.app](https://railway.app) and sign up
2. Create a new project
3. Add a MySQL database
4. Copy connection details
5. **See `FREE_DATABASE_HOSTING.md` for detailed setup steps**

### Option C: Other Free Options

- **Render** - Free tier available
- **Supabase** - PostgreSQL (requires migration)
- **See `FREE_DATABASE_HOSTING.md` for complete list and comparison**

## 🔐 Step 2: Prepare Environment Variables

Create a `.env.local` file in your project root with these variables:

```env
# Database Configuration
DB_HOST=your_database_host
DB_PORT=3306
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
JWT_EXPIRE=7d

# API Configuration (use /api for Vercel)
NEXT_PUBLIC_API_URL=/api

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```

## 🗄️ Step 3: Set Up Database Schema

### Before Deployment

1. **Run database scripts locally:**
   ```bash
   # Make sure your .env.local has database credentials
   npm run db:create
   npm run db:migrate
   npm run db:seed
   ```

2. **Or manually run SQL:**
   - Find `backend/database_schema.sql`
   - Run it on your hosted database

## 📦 Step 4: Deploy to Vercel

### Method 1: Via Vercel Dashboard (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard:**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository

3. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: Leave as default (`.`)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Add Environment Variables:**
   - Click "Environment Variables"
   - Add all variables from your `.env.local`:
     - `DB_HOST`
     - `DB_PORT`
     - `DB_NAME`
     - `DB_USER`
     - `DB_PASSWORD`
     - `JWT_SECRET`
     - `JWT_EXPIRE`
     - `NEXT_PUBLIC_API_URL` (set to `/api`)
     - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` (if using email)

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete

### Method 2: Via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Add Environment Variables:**
   ```bash
   vercel env add DB_HOST
   vercel env add DB_PORT
   vercel env add DB_NAME
   vercel env add DB_USER
   vercel env add DB_PASSWORD
   vercel env add JWT_SECRET
   vercel env add NEXT_PUBLIC_API_URL
   ```

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

## ✅ Step 5: Verify Deployment

1. **Visit your deployed URL:**
   - Vercel will provide a URL like `your-app.vercel.app`

2. **Test API Endpoints:**
   - Health: `https://your-app.vercel.app/api/health`
   - Should return: `{"success":true,"message":"Gym Management API is running"}`

3. **Test Frontend:**
   - Visit `https://your-app.vercel.app`
   - Try logging in with default credentials:
     - Username: `swanand`
     - Password: `password123`

## 🔄 Step 6: Database Setup on Production

After deployment, you need to set up your production database:

1. **Connect to your production database**

2. **Run migration scripts** (if you have access via SSH or database console):
   - Or use a tool like MySQL Workbench, phpMyAdmin, or DBeaver
   - Run the SQL from `backend/database_schema.sql`

3. **Seed initial data** (optional):
   - You can run the seed script or manually insert data

## 📝 Important Notes

### Database Connection in Serverless

- Vercel uses serverless functions
- Database connections need to be properly pooled
- The Sequelize configuration is already optimized for serverless

### Environment Variables

- Never commit `.env.local` to Git
- All secrets should be in Vercel's Environment Variables
- `NEXT_PUBLIC_*` variables are exposed to the browser
- Regular variables (like `DB_PASSWORD`) are server-only

### CORS

- Next.js API routes don't need CORS configuration
- All routes are same-origin
- The frontend and API are on the same domain

### Custom Domain

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS setup instructions

## 🐛 Troubleshooting

### Database Connection Errors

- Check environment variables are set correctly
- Verify database host allows connections from Vercel's IPs
- Some databases require IP whitelisting (check your database provider)

### Build Errors

- Check that all dependencies are in `package.json`
- Verify TypeScript errors (they're ignored but check anyway)
- Look at Vercel build logs for specific errors

### API Routes Not Working

- Verify routes are in `app/api/` directory
- Check that environment variables are set
- Look at Vercel function logs

### Authentication Not Working

- Verify `JWT_SECRET` is set
- Check token is being sent in Authorization header
- Verify database has users table and data

## 🔒 Security Checklist

- [ ] `JWT_SECRET` is a strong random string (32+ characters)
- [ ] Database password is strong
- [ ] Environment variables are set in Vercel (not in code)
- [ ] Database allows connections only from Vercel IPs (if possible)
- [ ] Default passwords are changed
- [ ] HTTPS is enabled (automatic on Vercel)

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PlanetScale with Next.js](https://planetscale.com/docs/tutorials/nextjs)
- [Railway Documentation](https://docs.railway.app)

## 🎉 You're Done!

Your Gym Management System is now live on Vercel!

**Next Steps:**
- Set up custom domain
- Configure email notifications
- Set up monitoring
- Enable analytics

## 💡 Pro Tips

1. **Use Vercel Preview Deployments:**
   - Every PR gets a preview URL
   - Test before merging to production

2. **Set Up Database Migrations:**
   - Create a migration system for production updates
   - Never modify production database directly

3. **Monitor Performance:**
   - Use Vercel Analytics
   - Monitor database connection pool
   - Set up error tracking (Sentry, etc.)

4. **Backup Database:**
   - Regular backups are essential
   - Most database providers offer automated backups

---

**Need Help?** Check the main README or project documentation.
