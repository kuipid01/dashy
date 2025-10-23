/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, ArrowLeft, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { useVerifyPurchaseOrder } from "@/app/(handlers)/order-tracking/query";
import { toast } from "sonner";

export default function OTPVerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const orderId = searchParams.get("orderId");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { mutateAsync, isPending } = useVerifyPurchaseOrder();
  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Redirect back if email or orderId is missing
    if (!email || !orderId) {
      router.push("/public-dashboard");
      console.log("this is running");
    }
  }, [email, orderId, router]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or last input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("ORDER ID", orderId);
    if (!orderId) {
      console.log("no order id");
      return;
    }
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await mutateAsync({ email: email!, purchaseId: orderId!, otp: otpCode });
      toast.success("OTP verified successfully! Redirecting...");
      router.push(`/public-dashboard/${orderId}`);
    } catch (err: any) {
      console.log(err);
      toast.error(
        err.response?.data?.error || "Failed to verify OTP. Please try again."
      );
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");

    // Simulate API call to resend OTP
    setTimeout(() => {
      setIsResending(false);
      // Show success message (you could add a toast notification here)
      setError("");
    }, 1000);
  };

  const maskedEmail = email
    ? email.replace(
        /(.{2})(.*)(@.*)/,
        (_, start, middle, end) => start + "*".repeat(middle.length) + end
      )
    : "";

  return (
    <div className="min-h-screen _bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/public-dashboard")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Order Lookup
        </Button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-general rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">
            Verify Your Identity
          </h1>
          <p className="text-muted-foreground">
            We&lsquo;ve sent a 6-digit verification code to
          </p>
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Mail className="w-4 h-4 text-primary" />
            <span>{maskedEmail}</span>
          </div>
        </div>

        {/* OTP Form Card */}
        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle>Enter Verification Code</CardTitle>
            <CardDescription>
              Please enter the 6-digit code to access your order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-bold"
                    disabled={isLoading}
                  />
                ))}
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20 text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isPending || otp.join("").length !== 6}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Verify & Continue
                  </>
                )}
              </Button>

              {/* Resend Code */}
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Didn&#39;t receive the code?
                </p>
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-general"
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            The verification code will expire in 10 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
