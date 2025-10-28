"use client";
import React from "react";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function OAuthComp() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      toast.error("no code found or wrong code");
      router.push("/login");
      return;
    }

    const run = async () => {
      try {
        const res = await fetch(
          `/api/auth/exchange?code=${encodeURIComponent(code)}`,
          {
            method: "GET",
            credentials: "include"
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Exchange failed");

        // Cookies are set in the API route response
        router.push("/dashboard");
      } catch (e: unknown) {
        if (e instanceof Error) {
          toast.error(e.message);
          router.push("/login");
        }
      }
    };
    run();
  }, [router, searchParams]);

  return (
    <div className="flex bg-primary flex-col min-h-screen h-full items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-black" />
      <p className="text-black">Completing sign-in…</p>
    </div>
  );
}
