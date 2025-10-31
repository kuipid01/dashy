"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const CTABanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.17, 0.67, 0.83, 0.67] }}
      className="w-full max-w-[1317px] mx-auto px-4 sm:px-6 lg:px-8 mt-16 sm:mt-32 md:mt-48 lg:mt-[264px]"
    >
      {/* Main CTA Banner */}
      <div className="relative overflow-hidden rounded-[25px] sm:rounded-[35px] lg:rounded-[45px] bg-radial-[at_0%_100%] from-[#D38261] to-[#F05D23] shadow-2xl">
        {/* Grainy texture overlay */}
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 100\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.1\'%3E%3C/rect%3E%3C/svg%3E')] 
      bg-repeat bg-cover 
      pointer-events-none 
      opacity-20"
        ></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between py-8 sm:py-12 md:py-16 lg:py-[140px] px-4 sm:px-6 md:px-8 lg:px-[57px]">
          {/* Left Section - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.17, 0.67, 0.83, 0.67]
            }}
            className="flex-1 max-w-2xl text-center md:text-left mb-6 md:mb-0"
          >
            {/* Main Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[48px] text-white leading-tight mb-4">
              Your next customer is waiting.
            </h2>

            {/* Sub-text */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-[24px] text-white/90 leading-relaxed mb-6 md:mb-8 max-w-lg mx-auto md:mx-0">
              Kuipid connects your products, posts, and customers in one flow.
            </p>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 w-full sm:w-auto"
            >
              Try Kuipid Free
            </motion.button>
          </motion.div>

          {/* Right Section - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: 0.4,
              ease: [0.17, 0.67, 0.83, 0.67]
            }}
            className="hidden md:block flex-shrink-0 absolute right-0 top-1/2 -translate-y-1/2"
          >
            <Image
              src="/assets/footer-man.svg"
              alt="Enthusiastic man calling out"
              width={566}
              height={419}
              className="w-[300px] lg:w-[400px] xl:w-[566px] h-auto object-contain"
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CTABanner;
