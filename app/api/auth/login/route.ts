import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch("https://api.kuipid.com/v1/api/users/login-mail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  const data = await res.json();

  const nextRes = NextResponse.json(data, { status: res.status });

  // ✅ Manually set cookies from tokens in body
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
}
