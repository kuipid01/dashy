"use client";
import { Button } from "@/app/components/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

const Page = () => {
  const router = useRouter();
  return (
    <div className=" flex flex-col gap-3 items-center justify-center min-h-screen">
      <Image
        src="/animated/Success.gif"
        alt="success anim"
        width={100}
        height={100}
      />
      <p className="text-zinc-500 text-sm">Your mail has been verified</p>
      <h1 className="text-2xl font-bold">Lets Go to your Hubsell Hubsell 🎉</h1>

      <Button
        onClick={() => router.push("/dashboard")}
        className=" cursor-pointer !text-white w-[300px] h-[50px] flex justify-center  !bg-black"
        text="Continue"
      />
    </div>
  );
};

export default Page;
