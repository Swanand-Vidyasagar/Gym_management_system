'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, User } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for saved token on mount
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      loadUser();
    } else {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUser = async () => {
    try {
      const response = await apiClient.getMe();
      if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        // Invalid response, clear token silently
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    } catch (error: any) {
      // Handle authentication errors
      const errorMessage = error?.message || '';
      
      // Log errors for debugging in production
      if (process.env.NODE_ENV === 'production') {
        console.error('Auth loadUser error:', errorMessage);
      }
      
      // Clear invalid tokens
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      setToken(null);
      setUser(null);
      
      // Only suppress expected errors
      const isExpectedError = 
        errorMessage.includes('User not found') ||
        errorMessage.includes('Invalid or expired token') ||
        errorMessage.includes('Cannot connect to server') ||
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('401') ||
        errorMessage.includes('404');
      
      if (!isExpectedError && errorMessage) {
        console.warn('Auth error:', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await apiClient.login(username, password);
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser'); // Clean up legacy data
    router.push('/');
  };

  const register = async (data: any) => {
    const response = await apiClient.register(data);
    setToken(response.data.token);
    setUser(response.data.user);
    localStorage.setItem('token', response.data.token);
    router.push('/dashboard');
  };

  const refreshUser = async () => {
    if (token) {
      await loadUser();
    }
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
        refreshUser,
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

