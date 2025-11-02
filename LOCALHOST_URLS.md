# 🌐 Localhost URLs

## Frontend (Next.js)

### Main Application
```
http://localhost:3000
```

This is your main app URL - opens the login/signup page.

### Direct Pages
- **Home/Login:** http://localhost:3000
- **Dashboard:** http://localhost:3000/dashboard
- **Admin:** http://localhost:3000/admin
- **Memberships:** http://localhost:3000/memberships
- **Payments:** http://localhost:3000/payments
- **Staff:** http://localhost:3000/staff

## API Endpoints

All API endpoints are available at:

### Health Check
```
http://localhost:3000/api/health
```

### Authentication
```
POST http://localhost:3000/api/auth/register
POST http://localhost:3000/api/auth/login
GET  http://localhost:3000/api/auth/me
```

### Debug Endpoints
```
GET http://localhost:3000/api/debug
GET http://localhost:3000/api/test-db
```

### Other API Routes
```
GET  http://localhost:3000/api/users
GET  http://localhost:3000/api/memberships
GET  http://localhost:3000/api/payments
GET  http://localhost:3000/api/staff
GET  http://localhost:3000/api/dashboard/stats
```

## How to Start

### 1. Install Dependencies (First Time)
```bash
npm install
```

### 2. Set Up Environment Variables

Create `.env.local` in root directory:

```env
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres?sslmode=require
DB_DIALECT=postgres
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters_long
NEXT_PUBLIC_API_URL=/api
```

**OR for local MySQL:**

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gym_management
DB_USER=root
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_secret_key
NEXT_PUBLIC_API_URL=/api
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open Browser
```
http://localhost:3000
```

## Default Login Credentials

After seeding the database:

| Username | Password | Role |
|----------|----------|------|
| swanand | password123 | Admin |
| rohit_pawar | password123 | Member |
| kavita_more | password123 | Member |

## Testing API Endpoints

### Using Browser
- Visit: http://localhost:3000/api/health
- Should see JSON response

### Using curl
```bash
# Health check
curl http://localhost:3000/api/health

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"swanand","password":"password123"}'
```

### Using Postman/Thunder Client
- Base URL: `http://localhost:3000/api`
- Test all endpoints from there

## Troubleshooting

### Port Already in Use
If port 3000 is taken:

```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port
PORT=3001 npm run dev
# Then visit: http://localhost:3001
```

### API Not Working
1. Check `.env.local` exists and has correct values
2. Check database is connected (visit `/api/test-db`)
3. Check console for errors

---

**Quick Start:**
1. `npm run dev`
2. Open: http://localhost:3000
3. Login with: `swanand` / `password123`
