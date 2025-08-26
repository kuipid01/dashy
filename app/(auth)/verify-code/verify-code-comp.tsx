/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot
} from "@/components/ui/input-otp";
import { useVerifyCode } from "@/app/(handlers)/auth-handlers/auth";
import { toast } from "sonner";

export const VerifyCodePage = () => {
  const { mutateAsync, isPending } = useVerifyCode();
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email") ?? "";
  const [code, setCode] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!code || code.length < 6) {
      setError("Enter the 6-digit code sent to your email.");
      return;
    }

    try {
      setIsSubmitting(true);

      await mutateAsync({
        code: code
      });
      toast.success("Code Valid");
      router.push("/login/email");
    } catch (err: any) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex-1 bg-white min-h-screen flex justify-center items-center p-4">
        <div className="w-full flex flex-col justify-center items-center   max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Enter verification code
          </h1>

          {emailFromQuery ? (
            <p className="text-sm text-zinc-500 mb-6">
              We sent a code to{" "}
              <span className="font-medium text-zinc-700">
                {emailFromQuery}
              </span>
            </p>
          ) : (
            <p className="text-sm text-zinc-500 mb-6">
              Check your email for your verification code.
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col items-center justify-center"
          >
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(val) => setCode(val)} // <-- important!
            >
              <InputOTPGroup>
                <InputOTPSlot className=" size-[60px]" index={0} />
                <InputOTPSlot className=" size-[60px]" index={1} />
                <InputOTPSlot className=" size-[60px]" index={2} />
                <InputOTPSlot className=" size-[60px]" index={3} />
                <InputOTPSlot className=" size-[60px]" index={4} />
                <InputOTPSlot className=" size-[60px]" index={5} />
              </InputOTPGroup>
            </InputOTP>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting || code.length < 6}
              className="w-full cursor-pointer disabled:opacity-50 text-white h-[44px] font-medium bg-secondary py-1 rounded-md"
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => router.push("/verify-mail")}
            className="mt-4 w-full h-[40px] text-secondary font-medium"
          >
            Didn’t get a code? Go back
          </button>
        </div>
      </div>
    </Suspense>
  );
};

// export default VerifyCodePage;
