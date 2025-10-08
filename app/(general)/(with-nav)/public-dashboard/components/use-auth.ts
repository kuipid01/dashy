import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' for App Router
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Define the name of your access token cookie
const ACCESS_TOKEN_COOKIE_NAME = 'access_token_purchase';

/**
 * Checks for the presence and validity of the access token cookie on mount.
 */
export function useAuthCheck() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get(ACCESS_TOKEN_COOKIE_NAME);
    
    // Debug: Log all cookies to see what's available
    console.log('All cookies:', document.cookie);
    console.log('Looking for cookie:', ACCESS_TOKEN_COOKIE_NAME);
    console.log('Token found:', token);

    if (!token) {
      // 1. Cookie is missing: Redirect immediately
      console.log('Token missing, redirecting to login.');
      router.push('/public-dashboard');
      return;
    }

    try {
      // 2. Decode the token to check claims
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Time in seconds
      if (!decodedToken?.exp) {
        // 3. Token is expired: Redirect immediately
        console.log('Token expired, redirecting to login.');
        // Optionally, delete the expired cookie before redirecting
        Cookies.remove(ACCESS_TOKEN_COOKIE_NAME); 
        router.push('/login');
        return;
      }
      if (decodedToken?.exp < currentTime) {
        // 3. Token is expired: Redirect immediately
        console.log('Token expired, redirecting to login.');
        // Optionally, delete the expired cookie before redirecting
        Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
        router.push('/login');
        return;
      }

      // 4. Token is valid
      setIsAuthenticated(true);

    } catch (error) {
      // 5. Decoding failed (Invalid JWT format): Treat as unauthorized
      console.error('Invalid token format:', error);
      Cookies.remove(ACCESS_TOKEN_COOKIE_NAME);
      router.push('/public-dashboard');
    }
  }, [router]);

  return isAuthenticated;
}