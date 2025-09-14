"use client";

import React, { useState } from "react";
import { LeftSection } from "./components/left";
import { RightSection } from "./components/right";
import Back from "@/app/components/reusables/back";
import { useFetchSingleStore } from "@/app/(handlers)/auth-handlers/auth";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

import { Button as Btnshad } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useParams } from "next/navigation";

const Page = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const params = useParams();
  const { store } = useFetchSingleStore((params.id as string) ?? undefined);
  const { items } = useCartStore();
  const userStore = store?.store;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const storeItems = Object.values(items).filter(
    (item) => item.storeId === userStore?.id
  );
  console.log(storeItems, "items");
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-primary">
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "md:pr-[320px]" : "md:pr-[80px]"
        }`}
      >
        <div className=" px-4 md:px-6 lg:px-8 pt-5 justify-between  flex items-center gap-2">
          <Back />

          <div className="flex items-center gap-2">
            <p className="uppercase font-bold text-lg">{userStore?.name}</p>

            <Link href={`/cart?store=${userStore?.id}`}>
              <Btnshad
                variant="outline"
                size="sm"
                className={cn("relative hover:bg-primary")}
              >
                <ShoppingCart className="w-4 h-4" />

                <Badge className="absolute  text-black bg-white border border-black -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {storeItems.reduce((acc, item) => acc + item.quantity, 0)}
                </Badge>
              </Btnshad>
            </Link>
          </div>
        </div>

        <LeftSection userStore={userStore} />
      </div>
      <RightSection isOpen={sidebarOpen} toggle={toggleSidebar} />
    </div>
  );
};

export default Page;
