/**
 * Utility functions for authentication
 */

/**
 * Clear authentication data from localStorage
 */
export const clearAuth = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser'); // Legacy cleanup
  }
};

/**
 * Check if token exists and is valid format
 */
export const hasValidToken = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  return !!token && token.length > 20; // Basic validation
};

/**
 * Get token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

