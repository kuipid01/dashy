/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes = ["/dashboard", "/chat", "/earnings", "/orders", "/settings", "/profile"];

// Your secret key (must be Uint8Array for jose)
const secret = new TextEncoder().encode("secretforaccess");
// const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET!);


export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((path) => pathname.startsWith(path));
  if (!isProtected) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("access_token")?.value;

  if (!accessToken) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    console.log("secret", secret)
    // 🔥 Validate token using jose

    console.log(accessToken,"accesstoken")
    await jwtVerify(accessToken, secret);

    return NextResponse.next();
  } catch (err) {
    // console.error("Invalid token", err);
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/chat/:path*",
    "/earnings/:path*",
    "/orders/:path*",
    "/settings/:path*",
    "/profile/:path*",
  ],
};
