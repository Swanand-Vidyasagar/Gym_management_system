# ✅ Vercel Deployment Checklist

Use this checklist to ensure your deployment is successful.

## Before Deployment

### Code Preparation
- [ ] All code is committed to Git
- [ ] Pushed to GitHub repository
- [ ] `.env.local` is in `.gitignore` (not committed)
- [ ] `node_modules` is in `.gitignore`

### Dependencies
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] All backend dependencies are in root `package.json`
- [ ] No TypeScript errors (or they're ignored in config)

### Database Setup
- [ ] Created MySQL database on hosting provider (PlanetScale, Railway, etc.)
- [ ] Have database connection details ready:
  - [ ] Host
  - [ ] Port (usually 3306)
  - [ ] Database name
  - [ ] Username
  - [ ] Password

### Database Schema
- [ ] Database schema is ready (`backend/database_schema.sql`)
- [ ] Can run migrations or SQL manually

## Vercel Setup

### Project Configuration
- [ ] GitHub repository is connected to Vercel
- [ ] Framework is set to Next.js
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`

### Environment Variables
Add these in Vercel dashboard → Settings → Environment Variables:

- [ ] `DB_HOST` - Your database host
- [ ] `DB_PORT` - Usually 3306
- [ ] `DB_NAME` - Your database name
- [ ] `DB_USER` - Database username
- [ ] `DB_PASSWORD` - Database password
- [ ] `JWT_SECRET` - Random string (32+ characters)
- [ ] `JWT_EXPIRE` - e.g., `7d`
- [ ] `NEXT_PUBLIC_API_URL` - Set to `/api`
- [ ] `EMAIL_HOST` (optional) - SMTP host
- [ ] `EMAIL_PORT` (optional) - SMTP port
- [ ] `EMAIL_USER` (optional) - Email username
- [ ] `EMAIL_PASS` (optional) - Email password

### Database Initialization
- [ ] Database schema is created (run `database_schema.sql`)
- [ ] Initial data is seeded (optional, for testing)

## After Deployment

### Testing
- [ ] Visit deployed URL
- [ ] Test health endpoint: `https://your-app.vercel.app/api/health`
- [ ] Test frontend loads correctly
- [ ] Test login functionality
- [ ] Test API endpoints with authentication

### Verification
- [ ] No errors in Vercel function logs
- [ ] Database connections are working
- [ ] Authentication is working
- [ ] Frontend can communicate with API

## Post-Deployment

### Security
- [ ] Changed default passwords
- [ ] `JWT_SECRET` is strong and unique
- [ ] Database is not publicly accessible
- [ ] Environment variables are secured in Vercel

### Monitoring
- [ ] Set up error tracking (optional)
- [ ] Monitor Vercel analytics
- [ ] Check database performance

## Quick Deploy Commands

```bash
# 1. Install dependencies locally
npm install

# 2. Test build locally
npm run build

# 3. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 4. Deploy (if using Vercel CLI)
vercel --prod
```

## Troubleshooting

If deployment fails:

1. **Check Vercel Build Logs:**
   - Go to your project → Deployments → Click on failed deployment
   - Check build logs for errors

2. **Common Issues:**
   - Missing environment variables → Add them in Vercel dashboard
   - Database connection failed → Verify credentials and host
   - Build errors → Check TypeScript/dependency issues locally first

3. **Test Locally:**
   ```bash
   npm run build
   npm start
   ```
   - If it works locally, it should work on Vercel

## Support

If you encounter issues:
1. Check `DEPLOYMENT.md` for detailed instructions
2. Review Vercel logs
3. Verify all environment variables are set
4. Test database connection separately
