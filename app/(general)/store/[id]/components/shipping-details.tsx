import { Product } from "@/app/(handlers)/types/product";
import { cn } from "@/lib/utils";
import {
  CalendarHeart,
  ChevronDown,
  ChevronUp,
  PackageOpen,
  Percent
} from "lucide-react";
import React from "react";

const ShippingDetails = ({
  setShowShippingDetails,
  showShippingDetails,
  product
}: {
  setShowShippingDetails: React.Dispatch<React.SetStateAction<boolean>>;
  showShippingDetails: boolean;
  product: Product | undefined;
}) => {
  return (
    <div className="p-3 border mt-5 border-gray-300 dark:border-zinc-700 rounded-xl flex flex-col">
      <div className="flex justify-between items-center">
        <p className="font-bold text-lg dark:text-zinc-100">Shipping Details</p>
        <button
          onClick={() => setShowShippingDetails(!showShippingDetails)}
          className="size-8 grid cursor-pointer place-content-center shrink-0 rounded-full border border-gray-300 dark:border-zinc-700"
        >
          {showShippingDetails ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      <div
        className={cn(
          "grid transition-all duration-500 ease-in-out overflow-hidden grid-cols-2 gap-5",
          showShippingDetails ? "max-h-[600px] mt-5 p-2" : "max-h-[0px]"
        )}
      >
        {[
          {
            icon: <Percent />,
            label: "Discount",
            value:
              product?.discounted_price && product?.price
                ? `Disc ${Math.round(
                    ((product?.price - product?.discounted_price) /
                      product?.price) *
                      100
                  )}%`
                : "No Discount"
          },
          {
            icon: <PackageOpen />,
            label: "Package",
            value: "Regular Packaging"
          },
          {
            icon: <CalendarHeart />,
            label: "Delivery Time",
            value: "4–5 Working Days"
          },
          { icon: <div />, label: "Product Details", value: "" }
        ].map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="size-12 rounded-full bg-zinc-100 dark:bg-zinc-800 grid place-items-center">
              {item.icon}
            </div>
            <div className="flex flex-col gap-1">
              <small className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                {item.label}
              </small>
              {item.value && (
                <p className="font-bold text-lg dark:text-zinc-100">
                  {item.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingDetails;
