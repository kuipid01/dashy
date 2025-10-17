"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import StoreInfo from "./store/store-info";
import { useParams } from "next/navigation";
import { useFetchSingleStore } from "@/app/(handlers)/auth-handlers/auth";

interface RightSectionProps {
  isOpen: boolean;
  toggle: () => void;
}

export const RightSection: React.FC<RightSectionProps> = ({
  isOpen,
  toggle
}) => {
  const params = useParams();
  const { store, isLoading } = useFetchSingleStore(
    (params.id as string) ?? undefined
  );

  const userStore = store?.store;
  const [dynamicWidth, setDynamicWidth] = useState(isOpen ? 320 : 80);
  const isResizing = useRef(false);

  const handleMouseDown = () => {
    isResizing.current = true;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = window.innerWidth - e.clientX;
    setDynamicWidth(Math.max(80, Math.min(newWidth, 600)));
  };

  const handleMouseUp = () => {
    isResizing.current = false;
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    setDynamicWidth(isOpen ? 320 : 80);
  }, [isOpen]);

  return (
    <aside
      className="fixed hidden md:flex top-0 right-0 h-full bg-primary shadow-lg transition-all duration-300 ease-in-out overflow-hidden z-10"
      style={{ width: dynamicWidth }}
    >
      <SideResizer onMouseDown={handleMouseDown} />

      <div className="h-full flex flex-col">
        <button
          onClick={toggle}
          className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors duration-200"
        >
          {isOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>

        <div className={`mt-16 px-6 ${!isOpen ? "opacity-0" : ""}`}>
          <StoreInfo data={userStore} isLoading={isLoading} />
        </div>
      </div>
    </aside>
  );
};

const SideResizer = ({
  onMouseDown
}: {
  onMouseDown: React.MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div
      onMouseDown={onMouseDown}
      className="absolute top-0 left-0 h-full w-[4px] bg-black cursor-grab"
    ></div>
  );
};
