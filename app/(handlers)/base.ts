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
          console.log("logging out");
          await api.post("/users/logout");
        } catch (logoutError) {
          console.warn("Logout request failed:", logoutError);
        }

        // Routes where we don't want to redirect even if auth fails
        const allowedRoutes = ["/product-details", "/cart", "/checkout","/" ,"/public-dashboard"];

        const isAllowedRoute = allowedRoutes.some((route) =>
          window.location.pathname.startsWith(route)
        );

        // Redirect to login only if NOT in allowed routes
        if (window.location.pathname !== "/login" && !isAllowedRoute) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
