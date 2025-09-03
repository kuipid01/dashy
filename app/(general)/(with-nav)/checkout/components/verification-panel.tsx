"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { BACKEND_URL } from "@/constants/backend-url";

export default function AuthCheckoutFlow({
  isOpen,
  onClose,
  email
}: {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}) {
  const handleGoogleLogin = () => {
    console.log("clicked");
    // Redirect to the backend to start the Google OAuth flow
    window.location.href = `${BACKEND_URL}/v1/api/users`;
  };

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [authMethod, setAuthMethod] = useState<"google" | "email" | null>(null);
  const [form, setForm] = useState({
    email: email,
    password: "",
    confirmPassword: "",
    otp: ""
  });

  // Step 1: handle auth choice
  const handleAuthChoice = (method: "google" | "email") => {
    setAuthMethod(method);
  };

  const handleEmailSubmit = () => {
    if (
      !form.email ||
      !form.password ||
      form.password !== form.confirmPassword
    ) {
      alert("Please fill all fields correctly");
      return;
    }
    setStep(2);
  };

  const handleGoogleAuth = () => {
    // TODO: integrate google login
    setStep(2);
  };

  // Step 2: OTP verify
  const handleVerifyOtp = () => {
    if (!form.otp) {
      alert("Enter OTP");
      return;
    }
    setStep(3);
  };

  // Step 3: Checkout
  const handleCheckout = () => {
    alert("Proceeding with payment...");
    onClose(); // close after checkout
  };

  return (
    <Sheet open={isOpen}>
      <SheetContent
        side="right"
        className="w-[450px] sm:w-[440px] md:w-[500px] lg:w-[600px] max-w-full py-6"
      >
        <SheetHeader className="text-left">
          <SheetTitle>
            {step === 1 && "Sign in to Continue"}
            {step === 2 && "Verify Your Email"}
            {step === 3 && "Checkout"}
          </SheetTitle>
          <SheetDescription>
            {step === 1 &&
              "Choose how you’d like to sign in to continue your order."}
            {step === 2 &&
              "Enter the OTP we sent to your email to verify your account."}
            {step === 3 && "Complete your purchase securely."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-6">
          {/* Step 1: Auth */}
          {step === 1 && (
            <div className="space-y-4">
              {!authMethod && (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full cursor-pointer mb-5 text-zinc-900 h-[40px] font-medium hover:bg-zinc-100 py-1 rounded-md border border-zinc-400 flex justify-center items-center gap-3"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M22.5984 12.2509C22.5984 11.4681 22.5281 10.7154 22.3977 9.99274H12V14.2632H17.9415C17.6856 15.6432 16.9078 16.8124 15.7385 17.5953V20.3653H19.3065C21.394 18.4434 22.5984 15.6131 22.5984 12.2509Z"
                        fill="#4285F4"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 23.0398C14.9808 23.0398 17.4799 22.0513 19.3065 20.3652L15.7386 17.5951C14.75 18.2575 13.4854 18.6489 12 18.6489C9.12461 18.6489 6.69079 16.7069 5.82264 14.0974H2.13428V16.9578C3.95086 20.5659 7.68439 23.0398 12 23.0398Z"
                        fill="#34A853"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M5.82258 14.0977C5.60178 13.4353 5.47632 12.7277 5.47632 12.0001C5.47632 11.2724 5.60178 10.5649 5.82258 9.90246V7.0421H2.13422C1.38651 8.5325 0.959961 10.2186 0.959961 12.0001C0.959961 13.7815 1.38651 15.4676 2.13422 16.958L5.82258 14.0977Z"
                        fill="#FBBC05"
                      ></path>
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12 5.35092C13.6209 5.35092 15.0762 5.90793 16.2203 7.0019L19.3868 3.83542C17.4749 2.05397 14.9758 0.960007 12 0.960007C7.68439 0.960007 3.95086 3.43397 2.13428 7.04204L5.82264 9.90241C6.69079 7.29295 9.12461 5.35092 12 5.35092Z"
                        fill="#EA4335"
                      ></path>
                    </svg>
                    Sign in with Google
                  </button>
                  <Button
                    className="w-full"
                    onClick={() => handleAuthChoice("email")}
                  >
                    Continue with Email
                  </Button>
                </div>
              )}

              {authMethod === "email" && (
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full border px-3 py-2 rounded"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full border px-3 py-2 rounded"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border px-3 py-2 rounded"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      setForm({ ...form, confirmPassword: e.target.value })
                    }
                  />
                  <Button className="w-full" onClick={handleEmailSubmit}>
                    Continue
                  </Button>
                </div>
              )}

              {authMethod === "google" && (
                <div>
                  <Button className="w-full" onClick={handleGoogleAuth}>
                    Authenticate with Google
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full border px-3 py-2 rounded"
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
              />
              <Button className="w-full mt-2" onClick={handleVerifyOtp}>
                Verify
              </Button>
            </div>
          )}

          {/* Step 3: Checkout */}
          {step === 3 && (
            <div className="space-y-4">
              <Button
                className="w-full py-6 text-lg font-semibold"
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
