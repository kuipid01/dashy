"use client";
import clsx from "clsx";
import { Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "./button";

export const Navbar = () => {

  return (
    <div

      className="fixed h-fit w-full items-start  z-10 flex flex-col _gap-10"
    >
      <nav
        className={clsx(
          "flex  py-4 px-4 sm:px-10 w-full bg-primary  justify-between  items-center _h-[10vh]",

        )}
      >

        <div className=" flex lg:hidden flex-col text-black gap-1">
          <div className=" w-[15px] shrink-0 border-b-[1px] border-black"></div>
          <div className=" w-[15px] border-b-[1px] shrink-0 border-black"></div>
        </div>
        <p className=" font-bold">Hubsell</p>
        <div className="flex items-center gap-4">
          <Link href="/features">
            Features</Link>
          <Link href="/pricing">
            Pricing</Link>
          <Link href="/contact">
            Contact</Link>
        </div>
        <Button className=" !bg-black text-white" text="Get Started" />
      </nav>
    </div>
  );
};


