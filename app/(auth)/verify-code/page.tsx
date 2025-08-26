"use client";

import React, { Suspense } from "react";

const VerifyCodePage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyCodePage />
    </Suspense>
  );
};

export default VerifyCodePage;
