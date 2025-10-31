"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import Image from "next/image";

const FooterNew = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log("Subscribed:", email);
    setEmail("");
  };

  return (
    <footer className="flex justify-center items-center text-white min-h-[400px] sm:min-h-[500px] lg:min-h-[551px] relative">
      {/* Diagonal separator line */}
      <Image
        src="/assets/landing-page/footer-rect.svg"
        alt="Footer"
        width={1540}
        height={551}
        className="w-full absolute left-0 right-0 top-0 z-0 h-full object-cover"
      />

      <div className="py-8 mt-20 lg:mt-0 sm:py-12 md:py-16 lg:py-[84px] w-full px-4 sm:px-6 md:px-8 lg:px-[171px] relative z-10 mx-auto">
        <div className="w-full flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-0">
          {/* Left Section - Company Info & Newsletter */}
          <div className="w-full lg:w-auto">
            {/* Logo and Company Name */}
            <Image
              src="/assets/logo-light.png"
              alt="logo"
              width={120}
              height={30}
              className="w-[100px] sm:w-[120px] h-[25px] sm:h-[30px]"
            />

            {/* Tagline */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md mt-4 sm:mt-6 lg:mt-[24px] font-medium">
              Helping businesses automate sales, social posting, and brand
              storytelling — so you can focus on what matters most.
            </p>

            {/* Email Subscription */}
            <form
              onSubmit={handleSubscribe}
              className="space-y-3 mt-6 sm:mt-8 lg:mt-[74px]"
            >
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="flex-1 px-4 py-3 rounded-lg sm:rounded-l-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg sm:rounded-r-lg hover:bg-orange-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>

          {/* Middle Section - Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full lg:w-auto">
            {/* Resources */}
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                Resources
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    href="/blog"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  >
                    Guides
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                Company
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right Section - Social Media */}
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                Follow Us
              </h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <Link
                    href="https://x.com/Kuipid"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  >
                    X (Twitter)
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://instagram.com/Kuipid"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://twitter.com/Kuipid"
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base"
                  >
                    Twitter
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright and Attribution */}
        <div className="border-t border-gray-800 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-gray-400 text-xs sm:text-sm">
            © 2025 Kuipid. All rights reserved.
          </p>
          <p className="text-gray-400 text-xs sm:text-sm flex items-center">
            Built with{" "}
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mx-1" /> for
            creators and businesses.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterNew;
