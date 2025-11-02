# 🚀 Quick Start Guide

Get your Gym Management System up and running in 10 minutes!

## ⚡ Prerequisites

Make sure you have these installed:
- ✅ Node.js (v14 or higher) - [Download](https://nodejs.org/)
- ✅ MySQL Server (v8 or higher) - [Download](https://dev.mysql.com/downloads/)
- ✅ A code editor (VS Code recommended)

## 🎯 5-Minute Backend Setup

### Step 1: Navigate to Backend
```bash
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
```bash
# Copy the example file
copy .env.example .env
# or on Mac/Linux:
# cp .env.example .env
```

**Edit `.env` file and set your MySQL password:**
```env
DB_PASSWORD=your_actual_mysql_password
JWT_SECRET=any_random_string_at_least_32_characters_long
```

### Step 4: Create Database
```bash
npm run db:create
```

### Step 5: Setup Tables & Data
```bash
npm run db:migrate
npm run db:seed
```

### Step 6: Start Server
```bash
npm run dev
```

✅ Backend is now running at `http://localhost:3001`

**Test it:** Open http://localhost:3001/api/health in your browser

## 🌐 Frontend Integration (Next Steps)

### Option 1: Quick Test with curl/Postman

Test the API with these commands:

**1. Register a User:**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"phone\":\"+91-98765-00000\",\"email\":\"test@example.com\",\"address\":\"Flat 201, ABC Society, Pune, Maharashtra 411001\",\"username\":\"testuser\",\"password\":\"password123\"}"
```

**2. Login:**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"swanand\",\"password\":\"password123\"}"
```

**3. Get Memberships:**
```bash
curl http://localhost:3001/api/memberships \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Option 2: Integrate with Your Next.js Frontend

**1. Create API Client** (see `backend/FRONTEND_INTEGRATION.md`)

**2. Create Auth Context** (see `backend/FRONTEND_INTEGRATION.md`)

**3. Update Components** to use the API

Full integration guide: `backend/FRONTEND_INTEGRATION.md`

## 📋 Default Login Credentials

After seeding, use these to login:

| Username | Password | Role |
|----------|----------|------|
| swanand | password123 | Admin (Swanand Vidyasagar) |
| rohit_pawar | password123 | Member |
| kavita_more | password123 | Member |

**⚠️ Change these in production!**

## 🧪 Test the API

### Using Postman or Insomnia:

1. **Login** → Get token
2. **Add token** to Authorization header: `Bearer <token>`
3. **Test endpoints** from `backend/API_DOCUMENTATION.md`

### Using Browser:

Visit these URLs:
- http://localhost:3001/api/health
- http://localhost:3001/api/dashboard/stats (requires admin token)

## 📚 Next Steps

1. ✅ Backend is ready
2. 📖 Read `PROJECT_OVERVIEW.md` for complete documentation
3. 🔌 Integrate frontend using `FRONTEND_INTEGRATION.md`
4. 📖 Check `API_DOCUMENTATION.md` for all endpoints
5. 🎨 Customize as needed

## 🆘 Need Help?

**Common Issues:**

❌ **"Cannot connect to database"**
- Check MySQL is running: `sudo service mysql start` (Linux/Mac)
- Verify password in `.env` file

❌ **"Port 3001 already in use"**
- Change `PORT` in `.env` file
- Or kill process using port 3001

❌ **"Module not found"**
- Run `npm install` again in backend directory

**More Help:**
- Detailed setup: `backend/SETUP.md`
- Troubleshooting: `backend/SETUP.md#troubleshooting`
- API reference: `backend/API_DOCUMENTATION.md`

## 🎉 You're Ready!

Your Gym Management System backend is operational!

**Key URLs:**
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/api/health
- Documentation: `backend/README.md`

**Next:** Integrate with your frontend and start managing your gym! 💪

