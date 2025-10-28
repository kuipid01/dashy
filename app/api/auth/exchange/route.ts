/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.nile.ng/go";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ message: "Missing code" }, { status: 400 });
  }

  try {
    const res = await fetch(`${BACKEND_BASE}/v1/api/users/exchange?code=${encodeURIComponent(code)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await res.json();
    const nextRes = NextResponse.json(data, { status: res.status });

    if (data.access_token) {
      nextRes.cookies.set("access_token", data.access_token, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        path: "/",
      });
    }

    if (data.refresh_token) {
      nextRes.cookies.set("refresh_token", data.refresh_token, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        path: "/",
      });
    }

    return nextRes;
  } catch (e) {
    return NextResponse.json({ message: "Exchange failed" }, { status: 500 });
  }
}


