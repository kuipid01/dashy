import { cn } from "@/lib/utils";
import React from "react";

interface BtnProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
const Newbtn = ({ children, className, onClick }: BtnProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        " py-2 px-3 hover:bg-black/90 duration-300 transition-all hover:scale-[1.05] cursor-pointer font-medium text-sm bg-black text-white rounded-md flex items-center gap-1",
        className
      )}
    >
      {children}
    </button>
  );
};

export default Newbtn;
