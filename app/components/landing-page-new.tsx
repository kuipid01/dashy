"use client";
import React from "react";
import { LightBtn, NewBtnDark } from "./new-btn-dark";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedText from "./animated-text";
const LandingPageNew = () => {
  const router = useRouter();
  return (
    <div className="mt-20 h-[60vh] relative lg:h-auto sm:mt-[140px] justify-center items-center flex-col flex px-4 sm:px-6 lg:px-8">
      <motion.h1 className=" hidden lg:block text-center mb-6 sm:mb-[38px] max-w-[1000px] text-2xl sm:text-4xl md:text-5xl bitter font-bold leading-tight">
        <AnimatedText
          text="Launch Your Online Business in Seconds."
          className=""
        />

        <AnimatedText
          text="Automate Sales, Socials, and Branding."
          className=""
          delay={0.5}
        />
      </motion.h1>
      <motion.h1 className=" lg:hidden  text-center mb-6 sm:mb-[38px] max-w-[1000px] text-2xl ">
        <AnimatedText
          text="Launch Your Online Business in Seconds.Automate Sales, Socials, and Branding."
          className=""
        />
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center mb-6 sm:mb-[38px] ubuntu text-black/70 max-w-[786px] text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-relaxed"
      >
        We help your products reach new audiences through automated web and
        social posting, engaging motion designs, and smart brand storytelling.
      </motion.p>
      <div className="flex flex-col justify-center sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none">
        <LightBtn
          text="Login"
          underline={false}
          onClick={() => router.push("/login")}
          className="w-full sm:w-auto text-lg sm:text-xl md:text-2xl lg:text-3xl border border-black rounded-md !underline-none font-bold px-6 sm:px-8 md:px-12 lg:px-20 py-3 sm:py-4"
        />

        <NewBtnDark
          text="Get Started"
          onClick={() => router.push("/signup")}
          className="w-full sm:w-auto !bg-black px-6 sm:px-8 md:px-12 lg:px-20 text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white py-3 sm:py-4"
        />
      </div>
    </div>
  );
};

export default LandingPageNew;
