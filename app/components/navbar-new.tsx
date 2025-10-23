"use client";
import Image from "next/image";
import Link from "next/link";
import { LightBtn, NewBtnDark } from "./new-btn-dark";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export const NavbarNew = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const links = [
    {
      name: "About",
      href: "/about"
    },
    {
      name: "Features",
      href: "/Features"
    },
    {
      name: "Pricing",
      href: "/pricing"
    }
  ];
  const router = useRouter();

  return (
    <div className="max-w-[1121px] fixed lg:relative _bg-primary/50 z-100 backdrop-blur-2xl lg:backdrop-blur-none top-0 left-0 right-0 py-4 sm:py-[25px] lg:pt-[45px] mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
      <Image
        src="/assets/logo.svg"
        alt="logo"
        width={120}
        height={30}
        className="w-[100px] sm:w-[120px] h-[25px] sm:h-[30px]"
      />

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center gap-10">
        <div className="flex items-center gap-4">
          {links.map((li) => (
            <Link
              className="text-base font-medium text-black hover:text-gray-600 transition-colors"
              key={li.href}
              href={li.href.toLowerCase()}
            >
              {li.name}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <LightBtn text="Login" onClick={() => router.push("/login")} />
          <NewBtnDark
            text="Get Started"
            onClick={() => router.push("/signup")}
            className="!bg-black text-white"
          />
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:hidden z-50">
          <div className="px-4 py-6 space-y-4">
            {links.map((li) => (
              <Link
                className="block text-base font-medium text-black hover:text-gray-600 transition-colors py-2"
                key={li.href}
                href={li.href.toLowerCase()}
                onClick={() => setIsMenuOpen(false)}
              >
                {li.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
              <LightBtn
                text="Login"
                onClick={() => {
                  router.push("/login");
                  setIsMenuOpen(false);
                }}
                className="w-full justify-center"
              />
              <NewBtnDark
                text="Get Started"
                onClick={() => {
                  router.push("/signup");
                  setIsMenuOpen(false);
                }}
                className="w-full justify-center !bg-black text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
