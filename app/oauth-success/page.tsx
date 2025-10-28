"use client";

import { Suspense } from "react";
import OAuthComp from "./oauth-success-comp";

export default function OAuthSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthComp />
    </Suspense>
  );
}
