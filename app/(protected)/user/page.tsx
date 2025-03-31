"use client";

import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";
import ActiveTabContent from "./pages/_comps/active-tab";

export const dynamic = "force-dynamic"; 
const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="h-screen grid place-items-center">
          <Loader2 className="animate-spin duration-300" />
        </div>
      }
    >
      <ActiveTabContent />
    </Suspense>
  );
};

export default Page;
