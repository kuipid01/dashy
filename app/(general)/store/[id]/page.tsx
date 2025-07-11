"use client";

import React, { useState } from "react";
import { LeftSection } from "./components/left";
import { RightSection } from "./components/right";
import Back from "@/app/components/reusables/back";
import { useFetchUserStore } from "@/app/(handlers)/auth-handlers/auth";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
const {store} = useFetchUserStore()

  const userStore = store?.store
  console.log(userStore);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "md:pr-[320px]" : "md:pr-[80px]"
        }`}
      >
        <div className=" px-4 md:px-6 lg:px-8 pt-5 justify-between  flex items-center gap-2">
          <Back />

          <p className="uppercase font-bold">{userStore?.name}</p>
        </div>
        <LeftSection />
      </div>
      <RightSection isOpen={sidebarOpen} toggle={toggleSidebar} />
    </div>
  );
};

export default Page;
