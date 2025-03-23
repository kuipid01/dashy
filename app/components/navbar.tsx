"use client";
import clsx from "clsx";
import Link from "next/link";
import { Button } from "./button";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();
  return (
    <div className="fixed h-fit w-full items-start  z-100 flex flex-col _gap-10">
      <nav
        className={clsx(
          "flex  py-4 px-4 sm:px-10 w-full bg-primary  justify-between  items-center _h-[10vh]"
        )}
      >
        <p className=" text-[20px] font-bold">Hubsell</p>
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <Button
          onClick={() => router.push("/signup")}
          className=" hidden cursor-pointer lg:block !bg-black text-white"
          text="Get Started"
        />
        <div className=" flex lg:hidden flex-col text-black gap-1">
          <div className=" w-[25px] shrink-0 border-b-[2px] border-black"></div>
          <div className=" w-[25px] border-b-[2px] shrink-0 border-black"></div>
        </div>
      </nav>
    </div>
  );
};
