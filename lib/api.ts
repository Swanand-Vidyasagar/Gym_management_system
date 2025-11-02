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

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
        }
        const errorMessage = errorData.message || `HTTP ${response.status}: ${response.statusText}`;
        const apiError = new Error(errorMessage);
        // Add status code for better error handling
        (apiError as any).status = response.status;
        throw apiError;
      }

      return response.json();
    } catch (error: any) {
      // If it's a network error (backend not running)
      if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
        throw new Error('Cannot connect to server. Please ensure the backend is running on http://localhost:3001');
      }
      throw error;
    }
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

  async deleteUser(id: number) {
    return this.request<ApiResponse>(`/users/${id}`, {
      method: 'DELETE',
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

  async deletePayment(id: number) {
    return this.request<ApiResponse>(`/payments/${id}`, {
      method: 'DELETE',
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

  async updateStaff(id: number, data: Partial<Staff>) {
    return this.request<SingleStaffResponse>(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStaff(id: number) {
    return this.request<ApiResponse>(`/staff/${id}`, {
      method: 'DELETE',
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
  address?: string;
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
  user_id?: number;
  staff_id?: number;
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
  user_id?: number;
  membership_id?: number;
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
  hire_date?: string;
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

