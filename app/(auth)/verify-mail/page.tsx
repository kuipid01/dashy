"use client";
import React, { Suspense } from "react";
import { VerifyEmailPage } from "./verify-email-page";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPage />
    </Suspense>
  );
};

export default Page;
