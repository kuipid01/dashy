"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
export const NewBtnDark = ({
  text,
  className,
  onClick
}: {
  text?: string;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <motion.button
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5, delay: 0.4 }}
      onClick={onClick}
      className={cn(
        "py-2 px-3 hover:bg-black/90 max-h-[50px] justify-center duration-300 transition-all hover:scale-[1.05] cursor-pointer font-medium text-sm bg-black text-white rounded-md flex items-center gap-1",
        className
      )}
    >
      {text && (
        <span className={cn("text-base lg font-medium text-white")}>
          {text}
        </span>
      )}
    </motion.button>
  );
};

export const LightBtn = ({
  text,
  className,
  onClick,
  underline = true
}: {
  text?: string;
  className?: string;
  onClick?: () => void;
  underline?: boolean;
}) => {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={cn(
        "py-2 px-3  duration-300  max-h-[50px] transition-all justify-center  hover:scale-[1.05] cursor-pointer font-medium text-sm  text-black rounded-md flex items-center  gap-1",
        className,
        underline && "underline underline-offset-4",
        underline && "!underline-none"
      )}
    >
      {text && (
        <span className={cn("text-base lg font-medium text-black")}>
          {text}
        </span>
      )}
    </motion.button>
  );
};
