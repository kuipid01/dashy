import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4000/v1/api/',
  withCredentials: true, // Ensure cookies are sent with requests
});

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried to avoid infinite loops

      try {
        // Call the refresh endpoint
        await api.post('/users/refresh');
        // Retry the original request with new access_token (sent via cookie)
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails (e.g., invalid refresh_token), redirect to login
        console.error('Token refresh failed:', refreshError);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // If error is not 401 or retry fails, reject the error
    return Promise.reject(error);
  }
);