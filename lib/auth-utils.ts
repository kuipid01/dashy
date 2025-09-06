import { CookieConfig } from '@/types/auth';

// Cookie configuration constants
export const COOKIE_CONFIG: CookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 15 * 60, // 15 minutes for access token
  path: '/',
};

export const REFRESH_COOKIE_CONFIG: CookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60, // 7 days for refresh token
  path: '/',
};

// Utility functions for cookie management
export const setAuthCookies = (response: Response, accessToken: string, refreshToken: string) => {
  // This would be used in API routes to set cookies
  // The actual cookie setting is done in the API route handlers
};

export const clearAuthCookies = (response: Response) => {
  // This would be used in API routes to clear cookies
  // The actual cookie clearing is done in the API route handlers
};

// Check if we're in a browser environment
export const isBrowser = typeof window !== 'undefined';

// Get redirect URL from search params
export const getRedirectUrl = (searchParams: URLSearchParams): string => {
  return searchParams.get('redirect') || '/dashboard';
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};
