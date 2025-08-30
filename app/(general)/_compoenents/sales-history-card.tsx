import React from "react";
import { Sparkles } from "lucide-react";
import {
  ProductPillDahboard,
  ViewMoreBtnPillProps
} from "@/app/(general)/_compoenents/pill-round";
import ContainerDashboard from "@/app/(protected)/_components/container-dashboard";

const SalesHistoryCard = () => {
  return (
    <div className="w-full lg:w-[calc(35%-20px)]">
      <ContainerDashboard className="h-fit">
        <div className="flex justify-between mb-5 items-center">
          <div className="flex gap-5 items-center">
            <div className="bg-[#ffffffcd] backdrop-blur-3xl size-10 grid place-items-center rounded-full transition shadow shadow-primary">
              <Sparkles />
            </div>
            <span className="font-bold text-lg">Sales History</span>
          </div>
          <ViewMoreBtnPillProps />
        </div>
        <div className="grid grid-cols-1 overflow-y-auto gap-3">
          {[1, 2, 3].map((index) => (
            <ProductPillDahboard
              key={index}
              location="Nigeria"
              name="Shirt"
              price={1000}
              productImage=""
              time={new Date()}
            />
          ))}
        </div>
      </ContainerDashboard>
    </div>
  );
};

export default SalesHistoryCard;
