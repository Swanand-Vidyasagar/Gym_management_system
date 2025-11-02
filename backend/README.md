# 🏋️ Gym Management System - Backend API

A complete RESTful API backend for managing a gym with users, memberships, payments, and staff.

## 🧩 System Overview

This backend powers a comprehensive Gym Management System that handles:
- **User Management** - Registration, authentication, and profile management
- **Membership Management** - CRUD operations for gym memberships with auto-calculated dates
- **Payment Processing** - Payment recording and history with email notifications
- **Staff Management** - Employee management with different roles
- **Analytics Dashboard** - Revenue reports and statistics

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL
- **ORM:** Sequelize
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs
- **Email:** Nodemailer
- **Validation:** express-validator

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MySQL Server (v8 or higher)
- npm or pnpm

## 🚀 Quick Start

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=gym_management
DB_USER=root
DB_PASSWORD=your_password_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### 3. Create Database

```bash
npm run db:create
```

### 4. Run Migrations

```bash
npm run db:migrate
```

### 5. Seed Sample Data

```bash
npm run db:seed
```

### 6. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:3001`

## 📚 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/auth/me` | Get current user | Required |

**Register Example:**
```json
POST /api/auth/register
{
  "name": "Swanand Vidyasagar",
  "phone": "+91-98765-43220",
  "email": "swanand.vidyasagar@example.com",
  "address": "Flat 302, Sahyadri Apartments, Fergusson College Road, Pune, Maharashtra 411004",
  "username": "swanand",
  "password": "securepass123"
}
```

**Login Example:**
```json
POST /api/auth/login
{
  "username": "swanand",
  "password": "password123"
}
```

### 👥 Users

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/users` | Get all users | Admin |
| GET | `/api/users/:id` | Get user by ID | Required |
| PUT | `/api/users/:id` | Update user | Required |
| DELETE | `/api/users/:id` | Delete user | Admin |

### 🎯 Memberships

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/memberships` | Get all memberships | Required |
| GET | `/api/memberships?userId=123` | Filter by user | Required |
| GET | `/api/memberships/:id` | Get membership by ID | Required |
| POST | `/api/memberships` | Create membership | Staff/Admin |
| PUT | `/api/memberships/:id` | Update membership | Staff/Admin |
| DELETE | `/api/memberships/:id` | Delete membership | Admin |

**Membership Types:** `Basic`, `Premium Plus`, `Elite Pro`, `Annual Unlimited`

**Create Membership Example:**
```json
POST /api/memberships
{
  "type": "Premium Plus",
  "user_id": 2,
  "staff_id": 1
}
```

### 💳 Payments

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/payments` | Get all payments | Required |
| GET | `/api/payments?userId=123` | Filter by user | Required |
| GET | `/api/payments/user/:userId` | Get user's payment history | Required |
| GET | `/api/payments/:id` | Get payment by ID | Required |
| POST | `/api/payments` | Create payment | Staff/Admin |
| DELETE | `/api/payments/:id` | Delete payment | Admin |

**Payment Methods:** `UPI`, `Card`, `Cash`, `Net Banking`

**Create Payment Example:**
```json
POST /api/payments
{
  "amount": 2499.00,
  "payment_method": "Card",
  "user_id": 2,
  "membership_id": 1
}
```

### 👨‍💼 Staff

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/staff` | Get all staff | Admin |
| GET | `/api/staff/:id` | Get staff by ID | Admin |
| POST | `/api/staff` | Create staff | Admin |
| PUT | `/api/staff/:id` | Update staff | Admin |
| DELETE | `/api/staff/:id` | Delete staff | Admin |

**Staff Roles:** `Trainer`, `Manager`, `Receptionist`

### 📊 Dashboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | Admin |
| GET | `/api/dashboard/revenue` | Get revenue analytics | Admin |

### Health Check

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | API health check | Public |

## 🔐 Authentication & Authorization

### JWT Token Flow

1. User logs in with username/password
2. Backend validates credentials
3. JWT token is returned (valid for 7 days by default)
4. Client stores token and sends it in subsequent requests

### Protected Routes

Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Role-Based Access

- **member** - Regular gym members
- **admin** - Full system access
- **staff** - Can manage memberships and payments

## 🗄️ Database Schema

### User
- `user_id` (PK)
- `name`, `phone`, `email`, `address`
- `role` (enum: member, admin, staff)

### Login
- `login_id` (PK)
- `username` (unique)
- `password` (hashed)
- `user_id` (FK → User)

### Membership
- `membership_id` (PK)
- `type` (enum: Basic, Premium Plus, Elite Pro, Annual Unlimited)
- `start_date`, `end_date`
- `price`
- `user_id` (FK → User)
- `staff_id` (FK → Staff)
- `status` (enum: active, expired, cancelled)

### Payment
- `payment_id` (PK)
- `amount`
- `payment_date`
- `payment_method` (enum: UPI, Card, Cash, Net Banking)
- `user_id` (FK → User)
- `membership_id` (FK → Membership, nullable)
- `status` (enum: pending, completed, failed)

### Staff
- `staff_id` (PK)
- `name`, `phone`, `email`
- `role` (enum: Trainer, Manager, Receptionist)
- `hire_date`

## 🧪 Testing with Sample Data

After running `npm run db:seed`, you can test with:

**Admin Login:**
- Username: `swanand`
- Password: `password123`
- Name: Swanand Vidyasagar

**Member Logins:**
- Username: `rohit_pawar`, `kavita_more`, `vikram_chavan`, `neha_shinde`
- Password: `password123`

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ]
}
```

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start development server with nodemon |
| `npm run db:create` | Create database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:reset` | Reset database (migrate + seed) |

## 🚨 Important Notes

1. **Security**: Change `JWT_SECRET` to a strong random string in production
2. **Database**: Use migrations in production, not `force: true`
3. **Email**: Configure email settings to enable payment notifications
4. **CORS**: Update `FRONTEND_URL` in `.env` for your frontend domain
5. **Passwords**: All default passwords should be changed in production

## 🤝 Frontend Integration

Update your frontend API calls to use the backend base URL:

```javascript
const API_BASE_URL = 'http://localhost:3001/api';

// Example: Fetch memberships
fetch(`${API_BASE_URL}/memberships`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## 📄 License

This project is for educational purposes.

## 🤝 Support

For issues or questions, please create an issue in the repository.

