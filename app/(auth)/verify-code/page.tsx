"use client";

import React, { Suspense } from "react";
import { VerifyCodePage } from "./verify-code-comp";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyCodePage />
    </Suspense>
  );
};

export default page;
