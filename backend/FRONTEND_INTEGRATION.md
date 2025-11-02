# 🌐 Frontend Integration Guide

This guide explains how to integrate the Gym Management backend API with your Next.js frontend.

## Quick Integration Steps

### 1. Create API Configuration

Create a new file `lib/api.ts` in your Next.js project:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// API Client with auth support
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('token') 
      : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Auth endpoints
  async register(data: RegisterData) {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(username: string, password: string) {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  async getMe() {
    return this.request<UserResponse>('/auth/me');
  }

  // User endpoints
  async getAllUsers() {
    return this.request<UsersResponse>('/users');
  }

  async getUser(id: number) {
    return this.request<UserResponse>(`/users/${id}`);
  }

  async updateUser(id: number, data: Partial<User>) {
    return this.request<UserResponse>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Membership endpoints
  async getAllMemberships(userId?: number) {
    const url = userId ? `/memberships?userId=${userId}` : '/memberships';
    return this.request<MembershipsResponse>(url);
  }

  async getMembership(id: number) {
    return this.request<MembershipResponse>(`/memberships/${id}`);
  }

  async createMembership(data: CreateMembershipData) {
    return this.request<MembershipResponse>('/memberships', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMembership(id: number, data: Partial<Membership>) {
    return this.request<MembershipResponse>(`/memberships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteMembership(id: number) {
    return this.request<ApiResponse>(`/memberships/${id}`, {
      method: 'DELETE',
    });
  }

  // Payment endpoints
  async getAllPayments(userId?: number) {
    const url = userId ? `/payments?userId=${userId}` : '/payments';
    return this.request<PaymentsResponse>(url);
  }

  async getUserPayments(userId: number) {
    return this.request<PaymentsResponse>(`/payments/user/${userId}`);
  }

  async getPayment(id: number) {
    return this.request<PaymentResponse>(`/payments/${id}`);
  }

  async createPayment(data: CreatePaymentData) {
    return this.request<PaymentResponse>('/payments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Staff endpoints
  async getAllStaff() {
    return this.request<StaffResponse>('/staff');
  }

  async getStaff(id: number) {
    return this.request<SingleStaffResponse>(`/staff/${id}`);
  }

  async createStaff(data: CreateStaffData) {
    return this.request<SingleStaffResponse>('/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request<DashboardStatsResponse>('/dashboard/stats');
  }

  async getRevenueAnalytics() {
    return this.request<RevenueAnalyticsResponse>('/dashboard/revenue');
  }
}

export const apiClient = new ApiClient();

// Types
export interface RegisterData {
  name: string;
  phone: string;
  email: string;
  address: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface User {
  user_id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: 'member' | 'admin' | 'staff';
}

export interface UserResponse {
  success: boolean;
  data: { user: User };
}

export interface UsersResponse {
  success: boolean;
  count: number;
  data: { users: User[] };
}

export interface Membership {
  membership_id: number;
  type: 'Basic' | 'Premium Plus' | 'Elite Pro' | 'Annual Unlimited';
  start_date: string;
  end_date: string;
  price: number;
  status: 'active' | 'expired' | 'cancelled';
  user?: User;
  staff?: Staff;
}

export interface CreateMembershipData {
  type: Membership['type'];
  user_id: number;
  staff_id: number;
  start_date?: string;
}

export interface MembershipResponse {
  success: boolean;
  message?: string;
  data: { membership: Membership };
}

export interface MembershipsResponse {
  success: boolean;
  count: number;
  data: { memberships: Membership[] };
}

export interface Payment {
  payment_id: number;
  amount: number;
  payment_date: string;
  payment_method: 'UPI' | 'Card' | 'Cash' | 'Net Banking';
  status: 'pending' | 'completed' | 'failed';
  user?: User;
  membership?: Membership;
}

export interface CreatePaymentData {
  amount: number;
  payment_method: Payment['payment_method'];
  user_id: number;
  membership_id?: number;
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  data: { payment: Payment };
}

export interface PaymentsResponse {
  success: boolean;
  count: number;
  data: { payments: Payment[] };
}

export interface Staff {
  staff_id: number;
  name: string;
  phone: string;
  email: string;
  role: 'Trainer' | 'Manager' | 'Receptionist';
  hire_date: string;
}

export interface CreateStaffData {
  name: string;
  phone: string;
  email: string;
  role: Staff['role'];
}

export interface StaffResponse {
  success: boolean;
  count: number;
  data: { staff: Staff[] };
}

export interface SingleStaffResponse {
  success: boolean;
  message?: string;
  data: { staff: Staff };
}

export interface DashboardStatsResponse {
  success: boolean;
  data: {
    stats: {
      totalUsers: number;
      activeMemberships: number;
      totalRevenue: number;
      monthlyRevenue: number;
      totalStaff: number;
    };
    expiringMemberships: Membership[];
    recentPayments: Payment[];
  };
}

export interface RevenueAnalyticsResponse {
  success: boolean;
  data: {
    monthlyRevenue: Record<string, number>;
    paymentMethods: Array<{
      method: Payment['payment_method'];
      total: number;
    }>;
  };
}

export interface ApiResponse {
  success: boolean;
  message?: string;
}

export default apiClient;
```

### 2. Create Auth Context

Create `contexts/AuthContext.tsx`:

```typescript
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, User } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved token on mount
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const response = await apiClient.getMe();
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to load user:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await apiClient.login(username, password);
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const register = async (data: any) => {
    const response = await apiClient.register(data);
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 3. Update Root Layout

Update `app/layout.tsx`:

```typescript
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

### 4. Example: Update Login Component

Update `components/auth/login-form.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(username, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-500">{error}</div>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

### 5. Example: Fetch Memberships

Update `app/memberships/page.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { apiClient, Membership } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function MembershipsPage() {
  const { user } = useAuth();
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemberships();
  }, []);

  const loadMemberships = async () => {
    try {
      const response = await apiClient.getAllMemberships(user?.user_id);
      setMemberships(response.data.memberships);
    } catch (error) {
      console.error('Failed to load memberships:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>My Memberships</h1>
      {memberships.map((membership) => (
        <div key={membership.membership_id}>
          <h3>{membership.type}</h3>
          <p>Price: ₹{membership.price}</p>
          <p>Start: {new Date(membership.start_date).toLocaleDateString()}</p>
          <p>End: {new Date(membership.end_date).toLocaleDateString()}</p>
          <p>Status: {membership.status}</p>
        </div>
      ))}
    </div>
  );
}
```

### 6. Example: Create Payment

```typescript
import { apiClient } from '@/lib/api';

const createPayment = async () => {
  try {
    const response = await apiClient.createPayment({
      amount: 2499.00,
      payment_method: 'Card',
      user_id: 2,
      membership_id: 1,
    });
    console.log('Payment created:', response.data.payment);
    // Show success message
  } catch (error) {
    console.error('Payment failed:', error);
    // Show error message
  }
};
```

### 7. Environment Variables

Create `.env.local` in your Next.js root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Testing the Integration

1. Start the backend:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Test login with default credentials:
   - Username: `swanand`
   - Password: `password123`

## Common Patterns

### Protected Route

```typescript
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export function ProtectedComponent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
```

### Error Handling

```typescript
try {
  const response = await apiClient.getAllMemberships();
  // Handle success
} catch (error: any) {
  if (error.message === 'Invalid or expired token') {
    // Redirect to login
    router.push('/login');
  } else {
    // Show error to user
    toast.error(error.message);
  }
}
```

## Next Steps

1. Update all your existing components to use `apiClient`
2. Add loading states
3. Add error handling
4. Implement optimistic updates
5. Add toast notifications for success/error

## Need Help?

Refer to:
- `backend/API_DOCUMENTATION.md` - Complete API reference
- `backend/README.md` - Backend overview
- `backend/SETUP.md` - Setup instructions

