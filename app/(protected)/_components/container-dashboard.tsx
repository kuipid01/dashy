import { cn } from "@/lib/utils";
import React from "react";

const ContainerDashboard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        " w-full h-[320px] max-h-[650px] rounded-xl p-10 bg-[#e7e3d6] backdrop-blur-3xl shadow shadow-gray-300",
        className
      )}
    >
      {children}
    </div>
  );
};

export default ContainerDashboard;
