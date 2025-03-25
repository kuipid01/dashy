"use client";
import clsx from "clsx";
import { Bell, Menu, MessageSquare, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavbarProtected = () => {
  const links = [
    {
      href: "dashboard",
    },
    {
      href: "products",
    },
    {
      href: "earnings",
    },
    {
      href: "orders",
    },
    {
      href: "calendars",
    },
    {
      href: "settings",
    },
    {
      href: "flows",
    },
  ];
  const pathname = usePathname();
  console.log(pathname);
  return (
    <div className=" w-[90%] fixed z-10 backdrop-blur-[100px] top-[20px] bg-white/50 px-4 rounded-xl left-1/2 -translate-x-1/2 flex items-center justify-between h-[7vh] md:h-[10vh] ">
      <div className=" flex items-center gap-4">
        {/* wIP: LOGO GPES HERE */}
        <h1 className=" text-[20px] font-bold">Hubsell</h1>
      </div>
      <div className="lg:flex hidden ">
        <ul className=" flex items-center gap-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                className={clsx(
                  "capitalize px-5 py-2 rounded-md",
                  pathname.toLowerCase() === `/${link.href.toLowerCase()}` &&
                    "bg-[#d4d4d4]"
                )}
                href={link.href}
              >
                {link.href}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:flex hidden items-center gap-2">
        <div className=" rounded-full grid place-items-center size-[30px] bg-[#F7F7F8]">
          <Search size={18} className=" text-zinc-600" />
        </div>
        <div className=" rounded-full grid place-items-center size-[30px] bg-[#F7F7F8]">
          <Bell size={18} className=" text-zinc-600" />
        </div>
        <div className=" rounded-full grid place-items-center size-[30px] bg-[#F7F7F8]">
          <MessageSquare size={18} className=" text-zinc-600" />
        </div>
        <div className=" size-[40px] overflow-hidden ml-3 rounded-full relative">
          <Image
            alt="user profile picture"
            fill
            className="object-cover"
            src="/assets/login.jpg"
          />
        </div>
      </div>

      <Menu className=" lg:hidden"/>
    </div>
  );
};

export default NavbarProtected;
