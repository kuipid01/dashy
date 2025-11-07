import axios from "axios";
import Cookies from "js-cookie";
export const api = axios.create({
  //baseURL: "http://localhost:4000/v1/api/",
  baseURL: "https://api.kuipid.com/v1/api/",
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": `Bearer ${Cookies.get("access_token")}`,
  },
});
console.log(Cookies.get("access_token"),"access token been sent")
// ✅ Add an interceptor to attach token dynamically
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    console.log("TOJEN FOR REQUEST", token)
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
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
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          }).then(res => res.json()).then(() => {
         
          });
        
          // window.location.href = "/login";
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
