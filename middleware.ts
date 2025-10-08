import { NextRequest, NextResponse } from "next/server";

// Define protected routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
  "/products",
  "/orders",
  "/earnings",
  "/chat",
  "/contents",
  "/user",
  
];

// Define auth routes that should redirect to dashboard if user is already authenticated
const AUTH_ROUTES = ["/login", "/signup", "/verify-code", "/verify-mail"];

// Define public routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/discover", "/product-details","/user-dashboard", "/public-dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path is a protected route
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // ✅ FIXED: Make sure to return inside `.some()`
  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is a public route
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  // Get the auth cookie (accessToken)
  const authCookie = request.cookies.get("access_token");
  const hasAuth = !!authCookie?.value;

  // Handle protected routes
  if (isProtectedRoute) {
    if (!hasAuth) {
      console.log("here ran")
      // Redirect to login if no auth cookie
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle auth routes
  if (isAuthRoute) {
    if (hasAuth) {
      // Redirect to dashboard if already authenticated
      const dashboardUrl = new URL("/dashboard", request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Default: allow access (API routes, etc.)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - .well-known (needed for Apple/Google services)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public|.well-known).*)",
  ],
};
