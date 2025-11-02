# 🏋️ Gym Management System - Complete Project Overview

## 📋 Project Structure

```
DBMS/
├── app/                      # Next.js frontend application
│   ├── admin/               # Admin dashboard pages
│   ├── dashboard/           # User dashboard pages
│   ├── memberships/         # Membership management pages
│   ├── payments/            # Payment pages
│   ├── staff/               # Staff directory pages
│   └── layout.tsx           # Root layout
│
├── components/              # React components
│   ├── admin/              # Admin-specific components
│   ├── auth/               # Authentication components
│   ├── dashboard/          # Dashboard components
│   ├── memberships/        # Membership components
│   ├── payments/           # Payment components
│   ├── staff/              # Staff components
│   └── ui/                 # Reusable UI components
│
└── backend/                 # Express.js backend API
    ├── config/             # Configuration files
    │   └── database.js     # Database connection
    │
    ├── controllers/        # Request handlers
    │   ├── authController.js
    │   ├── userController.js
    │   ├── membershipController.js
    │   ├── paymentController.js
    │   ├── staffController.js
    │   └── dashboardController.js
    │
    ├── middleware/         # Express middleware
    │   └── auth.js         # Authentication & authorization
    │
    ├── models/             # Sequelize ORM models
    │   ├── User.js
    │   ├── Login.js
    │   ├── Staff.js
    │   ├── Membership.js
    │   ├── Payment.js
    │   └── index.js
    │
    ├── routes/             # API routes
    │   ├── auth.js
    │   ├── users.js
    │   ├── memberships.js
    │   ├── payments.js
    │   ├── staff.js
    │   ├── dashboard.js
    │   └── index.js
    │
    ├── scripts/            # Database scripts
    │   ├── createDatabase.js
    │   ├── migrateDatabase.js
    │   └── seedDatabase.js
    │
    ├── utils/              # Utility functions
    │   ├── jwt.js
    │   └── membershipCalculator.js
    │
    ├── server.js           # Express server entry point
    ├── package.json        # Backend dependencies
    ├── .env.example        # Environment variables template
    ├── README.md           # Backend documentation
    ├── SETUP.md            # Setup instructions
    ├── API_DOCUMENTATION.md # Complete API reference
    ├── FRONTEND_INTEGRATION.md # Frontend integration guide
    └── database_schema.sql # SQL schema
```

## 🎯 System Features

### ✅ Backend Features

#### 🔐 Authentication & Authorization
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin, Staff, Member)
- Protected routes with middleware

#### 👥 User Management
- User registration with validation
- User login with JWT token generation
- Profile retrieval and updates
- User deletion (Admin only)

#### 🎯 Membership Management
- CRUD operations for memberships
- 4 membership types:
  - Basic (30 days - ₹999)
  - Premium Plus (90 days - ₹2499)
  - Elite Pro (180 days - ₹4999)
  - Annual Unlimited (365 days - ₹8999)
- Automatic end date calculation
- Status tracking (active, expired, cancelled)
- Staff assignment to memberships

#### 💳 Payment Processing
- Payment recording
- Multiple payment methods (UPI, Card, Cash, Net Banking)
- Payment history tracking
- Email notifications on payment confirmation
- Payment status management

#### 👨‍💼 Staff Management
- Staff CRUD operations (Admin only)
- Role management (Trainer, Manager, Receptionist)
- Staff assignment to memberships

#### 📊 Analytics Dashboard
- Total users count
- Active memberships count
- Total and monthly revenue
- Expiring memberships (next 7 days)
- Recent payments
- Revenue by payment method
- Monthly revenue trends (12 months)

#### 🗄️ Database
- MySQL database with Sequelize ORM
- Automatic table creation and migration
- Sample data seeding
- Database views and procedures
- Comprehensive indexes for performance

## 🛠️ Technology Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Sequelize
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Email:** Nodemailer
- **Validation:** express-validator
- **CORS:** Enabled for frontend

### Frontend
- **Framework:** Next.js 16
- **Language:** TypeScript
- **UI Library:** Radix UI components
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Form Handling:** React Hook Form + Zod
- **Charts:** Recharts

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MySQL (v8+)
- npm or pnpm

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your MySQL credentials
   ```

4. **Setup database:**
   ```bash
   npm run db:create      # Create database
   npm run db:migrate     # Create tables
   npm run db:seed        # Add sample data
   ```

5. **Start server:**
   ```bash
   npm run dev           # Development mode
   # or
   npm start             # Production mode
   ```

Server will run on `http://localhost:3001`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd ..
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure environment:**
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

Frontend will run on `http://localhost:3000`

## 📚 Documentation

### Backend Documentation
- **README.md** - Overview and quick start
- **SETUP.md** - Detailed setup instructions
- **API_DOCUMENTATION.md** - Complete API reference with examples
- **FRONTEND_INTEGRATION.md** - Frontend integration guide
- **database_schema.sql** - Complete SQL schema

### Frontend Documentation
Refer to component files for frontend-specific documentation

## 🔌 API Endpoints Summary

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users (Protected)
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin)

### Memberships
- `GET /api/memberships` - Get all memberships
- `GET /api/memberships?userId=X` - Filter by user
- `GET /api/memberships/:id` - Get by ID
- `POST /api/memberships` - Create (Staff/Admin)
- `PUT /api/memberships/:id` - Update (Staff/Admin)
- `DELETE /api/memberships/:id` - Delete (Admin)

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments?userId=X` - Filter by user
- `GET /api/payments/user/:userId` - User's history
- `GET /api/payments/:id` - Get by ID
- `POST /api/payments` - Create (Staff/Admin)
- `DELETE /api/payments/:id` - Delete (Admin)

### Staff
- `GET /api/staff` - Get all staff (Admin)
- `GET /api/staff/:id` - Get by ID (Admin)
- `POST /api/staff` - Create (Admin)
- `PUT /api/staff/:id` - Update (Admin)
- `DELETE /api/staff/:id` - Delete (Admin)

### Dashboard
- `GET /api/dashboard/stats` - Statistics (Admin)
- `GET /api/dashboard/revenue` - Revenue analytics (Admin)

### Utility
- `GET /api/health` - Health check

## 🧪 Testing Credentials

After seeding the database, use these credentials:

### Admin
- Username: `swanand`
- Password: `password123`
- Role: Admin (full access)
- Name: Swanand Vidyasagar

### Members
- Username: `rohit_pawar`, `kavita_more`, `vikram_chavan`, `neha_shinde`
- Password: `password123`
- Role: Member

## 📊 Database Schema

### Tables
1. **users** - User accounts
2. **logins** - Authentication credentials
3. **staff** - Staff members
4. **memberships** - Membership plans
5. **payments** - Payment records

### Relationships
- User ↔ Login (1:1)
- User ↔ Memberships (1:Many)
- User ↔ Payments (1:Many)
- Staff ↔ Memberships (1:Many)
- Membership ↔ Payments (1:Many)

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- Role-based authorization
- Input validation with express-validator
- SQL injection protection (Sequelize ORM)
- CORS configuration
- Environment variable management

## 📈 Future Enhancements

### Suggested Additions
- [ ] Password reset functionality
- [ ] Email verification
- [ ] Rate limiting
- [ ] API pagination
- [ ] Image upload for users/staff
- [ ] Gym equipment management
- [ ] Class/event scheduling
- [ ] Workout tracking
- [ ] Nutrition logging
- [ ] Real-time notifications
- [ ] Mobile app backend
- [ ] Advanced analytics
- [ ] Report generation (PDF)
- [ ] Automated membership renewal

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check MySQL is running
- Verify .env configuration
- Ensure port 3001 is available

**Database connection error:**
- Verify MySQL credentials
- Check database exists
- Ensure MySQL service is running

**Frontend can't connect to backend:**
- Verify backend is running
- Check NEXT_PUBLIC_API_URL in .env.local
- Verify CORS settings

**Authentication fails:**
- Check JWT_SECRET is set
- Verify token is being sent in headers
- Check token expiration

For detailed troubleshooting, see `backend/SETUP.md`

## 📄 License

This project is for educational purposes.

## 🤝 Support

For issues or questions:
1. Check documentation files
2. Review API_DOCUMENTATION.md
3. Verify environment setup
4. Check error logs

## 📞 Quick Reference

### Important Commands

**Backend:**
```bash
cd backend
npm install
npm run db:create
npm run db:migrate
npm run db:seed
npm run dev
```

**Frontend:**
```bash
npm install
npm run dev
```

**Database Reset:**
```bash
cd backend
npm run db:reset
```

### Important URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/api/health

### Important Files

- Backend config: `backend/.env`
- Frontend API: `lib/api.ts` (needs to be created)
- Auth context: `contexts/AuthContext.tsx` (needs to be created)

---

**🎉 Your Gym Management System is ready to use!**

Start by setting up the backend, then integrate it with your frontend using the provided guides.

