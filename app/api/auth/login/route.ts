import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const res = await fetch("https://api.nile.ng/go/v1/api/users/login-mail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  const data = await res.json();

  const nextRes = NextResponse.json(data, { status: res.status });

  const rawCookies = res.headers.get("set-cookie");
  if (rawCookies) {
    const accessMatch = rawCookies.match(/access_token=([^;]+)/);
    const refreshMatch = rawCookies.match(/refresh_token=([^;]+)/);

    if (accessMatch) {
      nextRes.cookies.set("access_token", accessMatch[1], {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
    }

    if (refreshMatch) {
      nextRes.cookies.set("refresh_token", refreshMatch[1], {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
    }
  }

  return nextRes;
}
