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

    if (!originalRequest._retryCount) {
      originalRequest._retryCount = 0;
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/users/refresh")
    ) {
      if (window.location.pathname === "/login") {
        return Promise.reject(error);
      }

      if (isRefreshing) {
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

        // ✅ Call backend to clear cookies
        try {
          await api.post("/users/logout");
        } catch (logoutError) {
          console.warn("Logout request failed:", logoutError);
        }

        // Redirect to login
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
