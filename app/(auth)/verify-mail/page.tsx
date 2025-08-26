"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const router = useRouter();
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex-1 bg-white min-h-screen flex justify-center items-center flex-col p-4">
        <div className="text-center flex flex-col items-center justify-center  max-w-md w-full">
          <Image
            alt="veify mail"
            src="/animated/email.gif"
            width={80}
            height={80}
            className="mb-4 mx-auto"
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Verify Your Email Address
          </h1>
          <p className="text-zinc-500 mb-2">
            We&apos;ve sent a verification link to{" "}
            <span className="font-bold text-zinc-700">{email}</span>
          </p>
          <p className="text-sm text-zinc-500">
            Please check your inbox (and spam/junk folder) and click the link to
            verify your account.
          </p>
          <div className="mt-6 w-full flex flex-col items-center gap-3">
            <button
              className="w-[400px] cursor-pointer disabled:opacity-50  text-white h-[40px] font-medium bg-secondary  py-1 rounded-md  flex justify-center items-center gap-3"
              onClick={() =>
                router.push(`/verify-code?email=${encodeURIComponent(email)}`)
              }
            >
              Enter code
            </button>
            <button
              className="w-[400px] cursor-pointer disabled:opacity-50  text-secondary h-[40px] font-medium  py-1 rounded-md  flex justify-center items-center gap-3"
              onClick={() => {
                /* TODO: trigger resend email */
              }}
            >
              Didn&apos;t receive an email? Resend
            </button>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Page;
