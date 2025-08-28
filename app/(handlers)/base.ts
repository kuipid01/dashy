import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:4000/v1/api/",
  withCredentials: true, // Ensure cookies are sent with requests
});

// Flag to avoid infinite refresh loops
let isRefreshing = false;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Ensure retry count
    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    // Only handle 401 errors (excluding refresh endpoint itself!)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/users/refresh")
    ) {
      if (isRefreshing) {
        // Prevent multiple refresh attempts if many requests fail at once
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh token
        await api.post("/users/refresh");
        isRefreshing = false;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        console.error("Token refresh failed:", refreshError);

        // Redirect to login if refresh fails
         window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
