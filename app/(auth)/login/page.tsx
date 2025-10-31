"use client";

import LoginBtn from "./components/login-btn";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col bg-[#F7F7F8] h-full p-3">
      <div className="flex justify-center items-center flex-1">
        <form
          className="w-full max-w-[100%] justify-center  lg:max-w-md mx-auto flex flex-col items-center"
          action=""
        >
          <h1 className="text-[20px] font-medium text-center w-full uppercase text-black mb-5">
            Kuipid
          </h1>

          <p className="text-black mb-5 font-light text-2xl leading-[1.5] text-center w-full">
            Log in to manage your thriving online business.
          </p>

          {/* 👇 Wrap your LoginBtn in Suspense */}
          <Suspense fallback={<div>Loading...</div>}>
            <LoginBtn />
          </Suspense>
        </form>
      </div>
    </div>
  );
}
