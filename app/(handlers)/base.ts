import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/v1/api/",
  withCredentials: true, // Ensure cookies are sent with requests
});

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Initialize retry count if not set
    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    // Check for 401 and allow up to 1 retry
    if (error.response?.status === 401 && originalRequest._retryCount < 3) {
      originalRequest._retryCount += 1;
      console.log("here ran");
      try {
        // Attempt to refresh token
        await api.post("/users/refresh");
        return api(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Redirect to login if refresh fails
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Redirect to login if exceeded retry limit
    if (originalRequest._retryCount >= 1) {
      console.warn("Too many retry attempts, redirecting to login.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);
