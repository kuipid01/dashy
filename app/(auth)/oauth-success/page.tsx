"use client";

import { Suspense } from "react";
import OAuthComp from "./oauth-success-comp";
import { Loader2 } from "lucide-react";

export default function OAuthSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen h-full items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin" />
        </div>
      }
    >
      <OAuthComp />
    </Suspense>
  );
}
