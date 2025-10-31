/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import clsx from "clsx";
import {
  Bell,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  // Search,
  Settings,
  Store,
  X
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
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  useFetchUser,
  useFetchUserStore,
  useHandleLogout
} from "@/app/(handlers)/auth-handlers/auth";
import { AnimatePresence, motion } from "framer-motion";

const NavbarProtected = () => {
  const { user, isLoading } = useFetchUser();
  const { store, isLoading: storeLoading } = useFetchUserStore();
  const { handleLogout, loading } = useHandleLogout();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userStore = store?.store;
  console.log(userStore);
  const links = [
    { href: "dashboard" },
    { href: "products" },
    { href: "earnings" },
    { href: "orders" },
    { href: "settings" },
    { href: "contents" }
  ];

  return (
    <>
      <div className="w-[90%] fixed z-10 backdrop-blur-[100px] top-[20px] bg-white/50 px-4 rounded-xl left-1/2 -translate-x-1/2 flex items-center justify-between h-[7vh] md:h-[10vh]">
        <Link href="/" className="text-[20px] font-bold">
          Kuipid
        </Link>

        <div className="lg:flex hidden">
          <ul className="flex items-center gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  className={clsx(
                    "capitalize px-5 py-2 rounded-md",
                    link.href === "settings" &&
                      pathname.toLowerCase() === "/user"
                      ? "bg-[#d4d4d4]"
                      : pathname.toLowerCase() === `/${link.href}` &&
                          "bg-[#d4d4d4]"
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
          {/* <div className="rounded-full grid place-items-center size-[30px] bg-[#F7F7F8]">
            <Search size={18} className="text-zinc-600" />
          </div>
          <div className="rounded-full grid place-items-center size-[30px] bg-[#F7F7F8]">
            <Bell size={18} className="text-zinc-600" />
          </div> */}
          {/* <Link
            href="/chat"
            className="rounded-full grid place-items-center size-[30px] bg-[#F7F7F8]"
          >
            <MessageSquare size={18} className="text-zinc-600" />
          </Link> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="size-[40px] bg-gray-400 border border-gray-600 cursor-pointer overflow-hidden ml-3 rounded-full relative">
                <Image
                  alt="user profile picture"
                  fill
                  className="object-cover"
                  src={user?.avatar || "/assets/login.jpg"}
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
              {storeLoading ? (
                <DropdownMenuItem className="flex items-center py-3 gap-3 cursor-not-allowed opacity-50">
                  <div className="w-6 h-6 bg-gray-300 rounded animate-pulse" />
                  <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
                </DropdownMenuItem>
              ) : !userStore?.name ? (
                <div></div>
              ) : (
                <DropdownMenuItem asChild>
                  <Link
                    href={`/store/${userStore?.name}`}
                    className="flex items-center py-3 hover:bg-gray-200 gap-3"
                  >
                    <Store size={24} /> Store
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="flex items-center py-3 hover:bg-gray-200 gap-3">
                <LayoutDashboard size={24} /> Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/user"
                  className="flex items-center py-3 hover:bg-gray-200 gap-3"
                >
                  <Settings size={24} /> Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mt-5" />
              <DropdownMenuItem asChild>
                <button
                  onClick={handleLogout}
                  className="text-red-500 py-3 mt-2 flex items-center gap-3"
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

        <div className="flex gap-3 lg:hidden items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="size-[40px] bg-gray-400 border border-gray-600 cursor-pointer overflow-hidden ml-3 rounded-full relative">
                <Image
                  alt="user profile picture"
                  fill
                  className="object-cover"
                  src={user?.avatar || "/assets/login.jpg"}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              className="min-w-[300px] bg-primary lg:mr-20 mr-5 p-5"
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
              {storeLoading ? (
                <DropdownMenuItem className="flex items-center py-3 gap-3 cursor-not-allowed opacity-50">
                  <div className="w-6 h-6 bg-gray-300 rounded animate-pulse" />
                  <div className="w-16 h-4 bg-gray-300 rounded animate-pulse" />
                </DropdownMenuItem>
              ) : !userStore?.name ? (
                <div></div>
              ) : (
                <DropdownMenuItem asChild>
                  <Link
                    href={`/store/${userStore?.name}`}
                    className="flex items-center py-3 hover:bg-gray-200 gap-3"
                  >
                    <Store size={24} /> Store
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="flex items-center py-3 hover:bg-gray-200 gap-3">
                <LayoutDashboard size={24} /> Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/user"
                  className="flex items-center py-3 hover:bg-gray-200 gap-3"
                >
                  <Settings size={24} /> Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mt-5" />
              <DropdownMenuItem asChild>
                <button
                  onClick={handleLogout}
                  className="text-red-500 py-3 mt-2 flex items-center gap-3"
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
          <button
            className=" cursor-pointer"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="sidebar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.05 }}
            className="fixed  inset-0 z-20 bg-black/50 flex"
          >
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.8 }}
              transition={{ duration: 0.1 }}
              key="sidebar-content"
              className="bg-primary absolute right-0 top-0 bottom-0 w-[250px] flex flex-col p-5"
            >
              <div className="flex justify-between items-center mb-5">
                <p className="font-bold text-lg">Menu</p>
                <button
                  className="cursor-pointer"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={24} />
                </button>
              </div>

              <ul className="flex flex-col gap-4">
                {links.map((link, index) => (
                  <motion.li
                    initial={{
                      opacity: 0,
                      x: index * 10,
                      y: index * 10,
                      scale: 0.8,
                      rotate: index * 3
                    }}
                    animate={{ opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 }}
                    exit={{
                      opacity: 0,
                      x: 100,
                      y: index * 10,
                      scale: 0.8,
                      rotate: index * 3
                    }}
                    transition={{ delay: index * 0.1, duration: 0.1 }}
                    key={link.href}
                  >
                    <Link
                      onClick={() => setSidebarOpen(false)}
                      className={clsx(
                        "capitalize block px-4 py-2 rounded-md",
                        link.href === "settings" &&
                          pathname.toLowerCase() === "/user"
                          ? "bg-[#d4d4d4]"
                          : pathname.toLowerCase() === `/${link.href}` &&
                              "bg-[#d4d4d4]"
                      )}
                      href={
                        link.href === "settings" ? "/user" : `/${link.href}`
                      }
                    >
                      {link.href}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            <div className="flex-1" onClick={() => setSidebarOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarProtected;
