"use client";

import { usePathname } from "next/navigation";
import { ChevronDown, Copyright, Globe } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Toaster } from "sonner";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isLoginPage = pathname.includes("login");

  // Redirect logged-in users

  return (
    <>
      <Toaster richColors />
      {isLoginPage ? (
        <div className="flex flex-col h-screen bg-white p-3 w-full ">
          <div className="flex justify-between items-center">
            <div className="rounded-md border-zinc-300 border items-center flex gap-5 p-1">
              <div className="flex items-center text-xs gap-1">
                <Globe size={20} className="text-zinc-300" /> ENGLISH
              </div>
              <ChevronDown size={20} className="text-zinc-300" />
            </div>
            <div className="flex items-center gap-4 text-zinc-500">
              Don&apos;t have an account?
              <Link
                href="/signup"
                className="px-3 cursor-pointer text-sm text-zinc-500 font-medium hover:bg-zinc-100 py-1 rounded-md border border-zinc-400"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <div className="w-full my-10 rounded-3xl overflow-hidden flex flex-1">
            <div className="w-full lg:w-[55%] bg-[#F7F7F8]">{children}</div>
            <div className="hidden bg-[#ECCDBA] w-[45%] lg:flex justify-center items-center flex-col h-full relative">
              <Image
                alt="Login Placeholder Image"
                src="/assets/login.jpg"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-screen  w-full bg-[#DBEEF5]">
          <div className="hidden w-[45%] lg:flex justify-center items-center flex-col h-full relative">
            <h1 className="text-white text-3xl leading-[1.4] font-medium text-center">
              Sign up <br /> and come on in
            </h1>
            <p className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center text-sm text-zinc-900 gap-1">
              <Copyright size={15} /> Kuipid
            </p>
            <Image
              alt="Sign Up Placeholder Image"
              src="/assets/signUp.jpg"
              fill
              className="object-cover"
            />
          </div>
          <div className="w-full lg:w-[55%]">{children}</div>
        </div>
      )}
    </>
  );
}
