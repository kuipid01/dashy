"use client";
import clsx from "clsx";
import {
  Bell,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Store,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import React from "react";
import {
  useFetchUser,
  useFetchUserStore,
  useHandleLogout,
} from "@/app/(handlers)/auth-handlers/auth";

const NavbarProtected = () => {
  const { user, isLoading } = useFetchUser();
  const { store } = useFetchUserStore();

  const userStore = store?.store;
  console.log(userStore);
  const { handleLogout, loading } = useHandleLogout();
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
    // {
    //   href: "calendars",
    // },
    {
      href: "settings",
    },
    // {
    //   href: "flows",
    // },
  ];
  const pathname = usePathname();
  // console.log(pathname);
  return (
    <div className=" w-[90%] fixed z-10 backdrop-blur-[100px] top-[20px] bg-white/50 px-4 rounded-xl left-1/2 -translate-x-1/2 flex items-center justify-between h-[7vh] md:h-[10vh] ">
      <div className=" flex items-center gap-4">
        {/* wIP: LOGO GPES HERE */}
        <Link href="/" className=" text-[20px] font-bold">
          Hubsell
        </Link>
      </div>
      <div className="lg:flex hidden ">
        <ul className=" flex items-center gap-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                className={clsx(
                  "capitalize px-5 py-2 rounded-md",
                  link.href === "settings" && pathname.toLowerCase() === "/user"
                    ? "bg-[#d4d4d4]"
                    : pathname.toLowerCase() ===
                        `/${link.href.toLowerCase()}` && "bg-[#d4d4d4]"
                )}
                href={link.href === "settings" ? "/user" : `/${link.href}`}
              >
                {link.href}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="lg:flex relative hidden items-center gap-2">
        <div className=" rounded-full grid place-items-center size-[30px] bg-[#F7F7F8]">
          <Search size={18} className=" text-zinc-600" />
        </div>
        <div className=" rounded-full grid place-items-center size-[30px] bg-[#F7F7F8]">
          <Bell size={18} className=" text-zinc-600" />
        </div>
        <Link
          href="/chat"
          className=" rounded-full grid place-items-center size-[30px] bg-[#F7F7F8]"
        >
          <MessageSquare size={18} className=" text-zinc-600" />
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className=" size-[40px]  cursor-pointer overflow-hidden ml-3 rounded-full relative">
              <Image
                alt="user profile picture"
                fill
                className="object-cover"
                src={
                  user?.avatar ||
                  user?.AvatarURL ||
                  user?.avatar_url ||
                  "/assets/login.jpg"
                }
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            className="min-w-[300px] mr-20 p-5"
          >
            <DropdownMenuLabel className="mb-3">Account</DropdownMenuLabel>

            {isLoading ? (
              <div className="flex items-center gap-2 mb-3">
                <div className="size-10 bg-gray-300 rounded-full animate-pulse" />
                <div className="flex flex-col gap-1">
                  <div className="w-32 h-4 bg-gray-300 rounded-md animate-pulse" />
                  <div className="w-48 h-3 bg-gray-200 rounded-md animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="flex items-center mb-3 justify-between">
                <div className="flex gap-2">
                  <div className="size-10 relative rounded-full">
                    <Image
                      alt="user profile picture"
                      fill
                      className="object-cover rounded-full"
                      src={user?.avatar || "/assets/login.jpg"}
                    />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold">{user?.Name}</p>
                    <p className="text-sm text-gray-600">{user?.Email}</p>
                  </div>
                </div>
              </div>
            )}

            <DropdownMenuSeparator className="mb-3" />
            <DropdownMenuItem asChild>
              <Link
                href={`/store/${userStore?.id}`}
                className="flex items-center py-3 hover:bg-gray-200 cursor-pointer gap-3"
              >
                <Store size={24} />
                Store
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center py-3 hover:bg-gray-200 cursor-pointer gap-3">
              <LayoutDashboard size={24} />
              Dashboard
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link
                href="/user"
                className="flex items-center py-3 hover:bg-gray-200 cursor-pointer gap-3"
              >
                <Settings size={24} />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="mt-5" />
            <DropdownMenuItem asChild>
              <button
                onClick={handleLogout}
                className="text-red-500 cursor-pointer py-3 mt-2 focus:bg-red-50 flex items-center gap-3"
              >
                {loading ? (
                  <Loader2 className="animate-spin duration-200" />
                ) : (
                  <LogOut color="#fb2c36" size={24} />
                )}
                {loading ? "Loading" : "Log Out"}
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        className="flex gap-3  lg:hidden  items-center
"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className=" size-[40px]  cursor-pointer overflow-hidden ml-3 rounded-full relative">
              <Image
                alt="user profile picture"
                fill
                className="object-cover"
                src="/assets/login.jpg"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            className="min-w-[300px] mr-20  p-5"
          >
            <DropdownMenuLabel className="mb-3">Account</DropdownMenuLabel>
            <div className="flex items-center  mb-3 justify-between">
              <div className="flex gap-2">
                <div className="size-10 relative rounded-full">
                  <Image
                    alt="user profile picture"
                    fill
                    className="object-cover rounded-full"
                    src="/assets/login.jpg"
                  />
                </div>
                <div className="flex flex-col ">
                  <p className=" font-bold ">Stephen Adegoke</p>
                  <p className=" text-sm text-gray-600">kuipid01@gmail.com</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator className="mb-3" />
            <DropdownMenuItem asChild>
              <Link
                href={`/store/${userStore?.id || userStore?.ID}`}
                className=" flex items-center  py-3 hover:bg-gray-200 cursor-pointer  gap-3"
              >
                <Store size={24} />
                Store
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem className=" flex items-center  py-3 hover:bg-gray-200 cursor-pointer  gap-3">
              {" "}
              <LayoutDashboard size={24} />
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/user"
                className=" flex items-center  py-3 hover:bg-gray-200 cursor-pointer  gap-3"
              >
                <Settings size={24} /> Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="mt-5" />
            <DropdownMenuItem asChild>
              <button
                onClick={handleLogout}
                className=" text-red-500 cursor-pointer py-3 mt-2 focus:bg-red-50 flex items-center gap-3"
              >
                {loading ? (
                  <Loader2 className="animate-spin duration-200" />
                ) : (
                  <LogOut color="#fb2c36" size={24} />
                )}
                {loading ? "Loading" : "Log Out"}
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Menu />
      </div>
    </div>
  );
};

export default NavbarProtected;
