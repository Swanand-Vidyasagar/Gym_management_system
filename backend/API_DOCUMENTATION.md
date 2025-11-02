# 📚 Complete API Documentation

This document provides detailed information about all API endpoints in the Gym Management System.

## Base URL
```
http://localhost:3001/api
```

## Authentication
Most endpoints require authentication using a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "name": "Swanand Vidyasagar",
  "phone": "+91-98765-43220",
  "email": "swanand.vidyasagar@example.com",
  "address": "Flat 302, Sahyadri Apartments, Fergusson College Road, Pune, Maharashtra 411004",
  "username": "swanand",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "user_id": 1,
      "name": "Swanand Vidyasagar",
      "email": "swanand.vidyasagar@example.com",
      "phone": "+91-98765-43220",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `400` - Validation errors
- `500` - Server error

---

### Login User
**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "username": "swanand",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "user_id": 1,
      "name": "Swanand Vidyasagar",
      "email": "swanand.vidyasagar@example.com",
      "phone": "+91-98765-43220",
      "role": "admin"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses:**
- `401` - Invalid credentials
- `400` - Missing fields

---

### Get Current User
**GET** `/auth/me`

Get the authenticated user's profile.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": 1,
      "name": "Swanand Vidyasagar",
      "email": "swanand.vidyasagar@example.com",
      "phone": "+91-98765-43220",
      "address": "Flat 302, Sahyadri Apartments, Fergusson College Road, Pune, Maharashtra 411004",
      "role": "admin"
    }
  }
}
```

**Error Responses:**
- `401` - Unauthorized

---

## 👥 User Endpoints

### Get All Users
**GET** `/users`

Retrieve all users (Admin only).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": {
    "users": [
      {
        "user_id": 1,
        "name": "Swanand Vidyasagar",
        "email": "swanand.vidyasagar@example.com",
        "phone": "+91-98765-43220",
        "role": "admin",
        "created_at": "2024-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

**Authorization:** Admin only

---

### Get User by ID
**GET** `/users/:id`

Retrieve a specific user.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": 2,
      "name": "Rohit Pawar",
      "email": "rohit.pawar@example.com",
      "phone": "+91-98765-43221",
      "address": "House No. 15, Shivaji Nagar, Mumbai, Maharashtra 400018",
      "role": "member"
    }
  }
}
```

**Error Responses:**
- `404` - User not found

---

### Update User
**PUT** `/users/:id`

Update user information.

**Request Body:**
```json
{
  "name": "Rohit Pawar",
  "phone": "+91-98765-43221",
  "address": "House No. 20, New Colony, Mumbai, Maharashtra 400020"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "user": {
      "user_id": 2,
      "name": "Rohit Pawar",
      "phone": "+91-98765-43221",
      "address": "House No. 20, New Colony, Mumbai, Maharashtra 400020"
    }
  }
}
```

---

### Delete User
**DELETE** `/users/:id`

Delete a user (Admin only).

**Authorization:** Admin only

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 🎯 Membership Endpoints

### Get All Memberships
**GET** `/memberships`

Retrieve all memberships.

**Query Parameters:**
- `userId` (optional) - Filter by user ID

**Example:** `/memberships?userId=2`

**Response (200):**
```json
{
  "success": true,
  "count": 4,
  "data": {
    "memberships": [
      {
        "membership_id": 1,
        "type": "Premium Plus",
        "start_date": "2024-01-15T00:00:00.000Z",
        "end_date": "2024-04-15T00:00:00.000Z",
        "price": 2499.00,
        "status": "active",
        "user": {
          "user_id": 2,
          "name": "Rohit Pawar",
          "email": "rohit.pawar@example.com",
          "phone": "+91-98765-43221"
        },
        "staff": {
          "staff_id": 1,
          "name": "Rajesh Kulkarni",
          "role": "Manager"
        }
      }
    ]
  }
}
```

---

### Get Membership by ID
**GET** `/memberships/:id`

Retrieve a specific membership.

**Response (200):** Same format as above (single membership object)

---

### Create Membership
**POST** `/memberships`

Create a new membership. End date and price are auto-calculated.

**Request Body:**
```json
{
  "type": "Premium Plus",
  "user_id": 2,
  "staff_id": 1,
  "start_date": "2024-01-15"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Membership created successfully",
  "data": {
    "membership": {
      "membership_id": 5,
      "type": "Premium Plus",
      "start_date": "2024-01-15T00:00:00.000Z",
      "end_date": "2024-04-15T00:00:00.000Z",
      "price": 2499.00,
      "user": { ... },
      "staff": { ... }
    }
  }
}
```

**Authorization:** Staff or Admin

**Membership Types:**
- `Basic` - 30 days - ₹999
- `Premium Plus` - 90 days - ₹2499
- `Elite Pro` - 180 days - ₹4999
- `Annual Unlimited` - 365 days - ₹8999

---

### Update Membership
**PUT** `/memberships/:id`

Update a membership. If type or start_date changes, end_date is recalculated.

**Request Body:**
```json
{
  "type": "Elite Pro",
  "status": "active"
}
```

**Authorization:** Staff or Admin

---

### Delete Membership
**DELETE** `/memberships/:id`

Delete a membership.

**Authorization:** Admin only

**Response (200):**
```json
{
  "success": true,
  "message": "Membership deleted successfully"
}
```

---

## 💳 Payment Endpoints

### Get All Payments
**GET** `/payments`

Retrieve all payments.

**Query Parameters:**
- `userId` (optional) - Filter by user ID

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": {
    "payments": [
      {
        "payment_id": 1,
        "amount": 2499.00,
        "payment_date": "2024-01-15T00:00:00.000Z",
        "payment_method": "Card",
        "status": "completed",
        "user": {
          "user_id": 2,
          "name": "Bob Martinez",
          "email": "bob@example.com"
        },
        "membership": {
          "membership_id": 1,
          "type": "Premium Plus",
          "price": 2499.00
        }
      }
    ]
  }
}
```

---

### Get Payment by ID
**GET** `/payments/:id`

Retrieve a specific payment.

---

### Get User Payment History
**GET** `/payments/user/:userId`

Get all payments for a specific user.

**Response:** Same format as Get All Payments

---

### Create Payment
**POST** `/payments`

Record a new payment. Triggers confirmation email.

**Request Body:**
```json
{
  "amount": 2499.00,
  "payment_method": "Card",
  "user_id": 2,
  "membership_id": 1
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Payment recorded successfully",
  "data": {
    "payment": {
      "payment_id": 6,
      "amount": 2499.00,
      "payment_method": "Card",
      "status": "completed",
      "user": { ... },
      "membership": { ... }
    }
  }
}
```

**Authorization:** Staff or Admin

**Payment Methods:**
- `UPI`
- `Card`
- `Cash`
- `Net Banking`

---

### Delete Payment
**DELETE** `/payments/:id`

Delete a payment.

**Authorization:** Admin only

---

## 👨‍💼 Staff Endpoints

### Get All Staff
**GET** `/staff`

Retrieve all staff members.

**Authorization:** Admin only

**Response (200):**
```json
{
  "success": true,
  "count": 4,
  "data": {
    "staff": [
      {
        "staff_id": 1,
        "name": "Rajesh Kulkarni",
        "phone": "+91-98765-43210",
        "email": "rajesh.kulkarni@gym.com",
        "role": "Manager",
        "hire_date": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Get Staff by ID
**GET** `/staff/:id`

Retrieve a specific staff member.

**Authorization:** Admin only

---

### Create Staff
**POST** `/staff`

Create a new staff member.

**Request Body:**
```json
{
  "name": "Sanjay Jadhav",
  "phone": "+91-98765-43214",
  "email": "sanjay.jadhav@gym.com",
  "role": "Trainer"
}
```

**Authorization:** Admin only

**Staff Roles:**
- `Trainer`
- `Manager`
- `Receptionist`

---

### Update Staff
**PUT** `/staff/:id`

Update staff information.

**Authorization:** Admin only

---

### Delete Staff
**DELETE** `/staff/:id`

Delete a staff member.

**Authorization:** Admin only

---

## 📊 Dashboard Endpoints

### Get Dashboard Statistics
**GET** `/dashboard/stats`

Get comprehensive dashboard statistics.

**Authorization:** Admin only

**Response (200):**
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalUsers": 5,
      "activeMemberships": 4,
      "totalRevenue": 19096.00,
      "monthlyRevenue": 19096.00,
      "totalStaff": 4
    },
    "expiringMemberships": [
      {
        "membership_id": 4,
        "type": "Basic",
        "end_date": "2024-02-14T00:00:00.000Z",
        "user": {
          "name": "Neha Shinde",
          "email": "neha.shinde@example.com"
        }
      }
    ],
    "recentPayments": [
      {
        "payment_id": 5,
        "amount": 2499.00,
        "payment_date": "2024-01-15T00:00:00.000Z",
        "user": {
          "name": "Bob Martinez"
        }
      }
    ]
  }
}
```

---

### Get Revenue Analytics
**GET** `/dashboard/revenue`

Get revenue analytics for the last 12 months.

**Authorization:** Admin only

**Response (200):**
```json
{
  "success": true,
  "data": {
    "monthlyRevenue": {
      "Jan 2024": 19096.00,
      "Dec 2023": 2499.00
    },
    "paymentMethods": [
      {
        "method": "Card",
        "total": 12496.00
      },
      {
        "method": "UPI",
        "total": 4999.00
      },
      {
        "method": "Cash",
        "total": 999.00
      }
    ]
  }
}
```

---

## Health Check

### API Health Check
**GET** `/health`

Check if the API is running.

**Response (200):**
```json
{
  "success": true,
  "message": "Gym Management API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [  // Only for validation errors
    {
      "msg": "Email is required",
      "param": "email"
    }
  ]
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider adding rate limiting for production use.

## CORS

CORS is enabled for the frontend URL specified in `.env`:
```env
FRONTEND_URL=http://localhost:3000
```

To allow multiple origins, modify `backend/server.js`.

## Pagination

Currently, pagination is not implemented. All endpoints return complete results. Consider adding pagination for production use, especially for large datasets.

