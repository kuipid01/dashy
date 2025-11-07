/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { InputField } from "@/app/components/reusables/inputfield";
import { ChevronDown, Eye, Globe } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { PasswordStrengthUi } from "./components/password-strength";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useRegisterUser } from "@/app/(handlers)/auth-handlers/auth";

const Page = () => {
  const { mutateAsync, isPending } = useRegisterUser();
  const router = useRouter();
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formDetails, setFormDetails] = useState({
    email: "",
    password: "",
    name: "",
    passwordConfirm: ""
  });

  const passwordValid = () => {
    const hasUpperCase = /[A-Z]/.test(formDetails.password);
    const hasLowerCase = /[a-z]/.test(formDetails.password);
    const hasNumbers = /\d/.test(formDetails.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formDetails.password);
    const isLengthValid = formDetails.password.length >= 8;
    // const isConfirmed = formDetails.password === formDetails.passwordConfirm;

    return (
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar &&
      isLengthValid
      // isConfirmed
    );
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCreateAccount = async () => {
    try {
      await mutateAsync({
        email: formDetails.email,
        password: formDetails.password,
        name: formDetails.name
      });
      toast.success("Account created successfully");
      router.push(
        `/verify-mail?email=${encodeURIComponent(formDetails.email)}`
      );
    } catch (error: any) {
    
      toast.error(error?.response?.data?.error || "Account failed creation.");
    }
  };
  // console.log(formDetails);
  return (
    <div className=" flex flex-col bg-white h-full p-3 rounded-l-xl">
      <div className="flex justify-between items-center">
        <div className=" rounded-md border-zinc-300 border items-center flex gap-5 p-1">
          {" "}
          <div className=" flex items-center text-xs gap-1">
            <Globe size={20} className=" text-zinc-300" /> ENGLISH
          </div>
          <ChevronDown size={20} className=" text-zinc-300" />
        </div>
        <div className=" flex items-center gap-4 text-zinc-500">
          Already have an account?
          <Link
            href="/login"
            className=" px-3 text-sm text-zinc-500 font-medium hover:bg-zinc-100 py-1 rounded-md border border-zinc-400"
          >
            Log In
          </Link>
        </div>
      </div>
      <div className="flex  justify-center items-center flex-1">
        <form
          className=" max-w-[70%] lg:max-h-[80vh] overflow-y-auto  lg:max-w-md mx-auto b flex flex-col items-center"
          action=""
        >
          <h1 className=" text-[20px] font-medium text-center uppercase text-black mb-5">
            Kuipid
          </h1>

          <p className=" text-black mb-5 font-light text-2xl leading-[1.5] text-center">
            Sell smarter with Kuipid—your store, sales, and growth in one
            place.
          </p>
          <div className="flex flex-col gap-5 mb-5">
            <InputField
              type="text"
              placeholder="Enter Full Name"
              onChange={(e) => {
                setFormDetails({ ...formDetails, name: e.target.value });
              }}
            />
            <InputField
              type="email"
              placeholder="Enter Email"
              onChange={(e) => {
                setFormDetails({ ...formDetails, email: e.target.value });
              }}
            />
            <div className=" relative">
              <InputField
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter Password"
                onChange={(e) => {
                  setFormDetails({ ...formDetails, password: e.target.value });
                }}
              />
              <Eye
                onClick={() => setPasswordVisible(!passwordVisible)}
                className=" absolute top-1/2 -translate-y-1/2 right-4"
              />
            </div>

            {formDetails.password && passwordValid() && (
              <div className=" relative">
                <InputField
                  type={confirmPasswordVisible ? "text" : "password"}
                  placeholder="Confirm Password"
                  onChange={(e) => {
                    setFormDetails({
                      ...formDetails,
                      passwordConfirm: e.target.value
                    });
                  }}
                />
                <Eye
                  onClick={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                  className=" absolute top-1/2 -translate-y-1/2 right-4"
                />
              </div>
            )}
            <PasswordStrengthUi
              password={formDetails.password}
              passwordConfirmed={formDetails.passwordConfirm}
            />
            <div className=" flex  max-w-[400px] gap-3">
              <input
                className=" bg-white accent-primary size-5 border-zinc-300 border"
                type="checkbox"
                name=""
                id=""
              />
              <p className=" text-sm leading-[1.2] font-light ">
                I agree to Kuipid&apos;s{" "}
                <Link href="" className=" underline ">
                  Terms of Service
                </Link>{" "}
                ,{" "}
                <Link href="" className=" underline ">
                  Privacy Policy
                </Link>{" "}
                and
                <Link href="" className=" ml-1 underline ">
                  Data Processing Agreement.
                </Link>{" "}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateAccount}
            disabled={
              !passwordValid() ||
              !isValidEmail(formDetails.email) ||
              isPending ||
              formDetails.password !== formDetails.passwordConfirm
            }
            className="w-[400px] cursor-pointer disabled:opacity-50  text-white h-[40px] font-medium bg-secondary  py-1 rounded-md  flex justify-center items-center gap-3"
          >
            {isPending ? "Creating...." : " Create my account"}
          </button>
          {/* <p className=" max-w-[400px] mt-6 text-sm leading-[1.2] font-light ">
            This site is protected by reCAPTCHA and the Google
            <Link href="" className=" underline ml-1 ">
              Privacy Policy
            </Link>{" "}
            and
            <Link href="" className=" underline ml-1">
              Terms of Service
            </Link>{" "}
            apply
          </p> */}
        </form>
      </div>
    </div>
  );
};

export default Page;
