/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { Suspense, useEffect, useState } from "react";
import CartPage from "./cart-page";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CartPage />
    </Suspense>
  );
};

export default page;
