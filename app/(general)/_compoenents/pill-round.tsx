/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { getPercentageChange } from "@/app/(protected)/_components/small-comps";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format, isValid, parseISO } from "date-fns";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Clock,
  MapPin
} from "lucide-react";
import Image from "next/image";
import React, { ReactNode, MouseEventHandler } from "react";

interface ButtonLikePillProps {
  icon: ReactNode;
  text?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
}

export const ButtonLikePill: React.FC<ButtonLikePillProps> = ({
  icon,
  text,
  onClick,
  disabled
}) => {
  return (
    <div
      className="flex relative items-center gap-2 _bg-[#fffffff0]  hover:bg-[#ffffffae] cursor-pointer  backdrop-blur-3xl shadow shadow-gray-300 text-gray-800 font-medium rounded-[40px] px-4 py-2 transition"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        cursor: onClick ? "pointer" : undefined,
        background: disabled ? "#9f9999f0" : "#fffffff0"
      }}
    >
      {icon}
      <span className=" font-medium text-[14px]">{text}</span>
      {disabled && (
        <div className=" absolute bg-red-500 text-white px-2 py-1 text-[10px] font-medium rounded-md -top-5 right-0">
          UPCOMING
        </div>
      )}
    </div>
  );
};
interface ViewMoreBtnPillProps {
  text?: string;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const ViewMoreBtnPillProps: React.FC<ViewMoreBtnPillProps> = ({
  onClick
}) => {
  return (
    <div
      className="px-2 py-2 flex items-center gap-2 bg-[#ffffffcd] hover:bg-[#ffffffae] backdrop-blur-3xl shadow shadow-gray-300 text-gray-800 font-medium rounded-full transition cursor-pointer "
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      <span className=" text-gray-800 font-medium  ml-2  text-[17px]">
        View More
      </span>

      <div className=" bg-gray-600/10 text-gray-600  rounded-full size-[40px] grid place-items-center">
        <ArrowRight size={16} color=" black" />
      </div>
    </div>
  );
};

type DashboardPillProps = {
  title: string;
  amount: string | number;

  icon1?: React.ReactNode;
  icon2?: React.ReactNode;
  newValue: number;
  prevValue: number;
};

export const DashboardPillSkeleton = () => {
  return (
    <Card className="rounded-2xl !bg-primary flex flex-col p-4 backdrop-blur-3xl animate-pulse">
      {/* Header Skeleton */}
      <CardHeader className="flex px-0 items-center justify-between">
        <div className="size-14 rounded-full bg-gray-200"></div>
        <div className="h-6 w-24 bg-gray-200 rounded-md"></div>
        <div className="size-14 rounded-full bg-gray-200"></div>
      </CardHeader>

      {/* Footer Skeleton */}
      <CardFooter className="flex p-0 items-center gap-4 mt-3">
        <div className="h-8 w-28 bg-gray-200 rounded-md"></div>
        <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-gray-200 px-2 py-1 shadow-sm h-6 w-20">
          <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-10 bg-gray-300 rounded-sm"></div>
        </div>
      </CardFooter>
    </Card>
  );
};

export const DashboardPill = ({
  title,
  amount,

  icon1,
  newValue,
  prevValue
}: DashboardPillProps) => {
  const percentageChange = getPercentageChange(newValue, prevValue);
  const isNegative = percentageChange < 0;
  const isFromZero = percentageChange === Infinity;
  // Conditional rendering based on the type of change
  const content = () => {
    if (isFromZero) {
      return (
        <span className="flex items-center gap-1">
          <ArrowUpRight className="w-4 h-4" />
          Up from zero
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1">
        {isNegative ? (
          <ArrowDownRight className="w-4 h-4" />
        ) : (
          <ArrowUpRight className="w-4 h-4" />
        )}
        {percentageChange.toFixed(2)}%
      </span>
    );
  };
  return (
    <Card className="rounded-2xl !bg-primary flex flex-col p-4 backdrop-blur-3xl   ">
      {/* Header */}
      <CardHeader className="flex px-0 items-center justify-between">
        <div className="size-14 rounded-full bg-[#ffffffcd] hover:bg-[#e6e3df] backdrop-blur-3xl grid place-items-center text-gray-600">
          {icon1}
        </div>
        <span className="font-semibold text-lg text-black">{title}</span>
        <div className="size-14 rounded-full bg-[#ffffffcd] hover:bg-[#e6e3df] backdrop-blur-3xl grid place-items-center text-gray-600">
          <ArrowUpRight />
        </div>
      </CardHeader>

      {/* Footer */}
      <CardFooter className="flex p-0 items-center gap-4 mt-3">
        <span className="font-bold text-2xl text-gray-900">₦{amount}</span>

        <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-2 py-1 shadow-sm">
          {/* Value number */}
          {!isFromZero && (
            <span className="text-[10px] font-medium text-gray-600">
              {percentageChange.toFixed(2)}%
            </span>
          )}

          {/* Up/Down indicator */}
          <div className="flex items-center gap-1">
            <div
              style={{
                background: isNegative ? "#cc5069" : "#b9f8cf",
                color: isNegative ? "white" : "black"
              }}
              className="flex items-center font-medium rounded-md text-[12px] px-2 py-1 text-xs"
            >
              {content()}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

type ProductPillDahboardType = {
  productImage: string;
  name: string;
  price: number;
  time: Date;
  location: string;
};

export const ProductPillDahboard = ({
  location,
  name,
  price,
  productImage,
  time
}: ProductPillDahboardType) => {
  // Use parseISO to safely convert the date string to a Date object
  const parsedTime = typeof time === "string" ? parseISO(time) : time;

  // Check if the parsed date is valid before formatting
  const formattedTime =
    parsedTime && isValid(parsedTime) ? format(parsedTime, "hh:mm a") : "N/A";
  return (
    <div className=" rounded-[30px] w-full col-1  py-3 px-3 bg-primary flex items-center justify-between">
      <div className=" flex items-center gap-4 ">
        <Image
          alt="product-imaga"
          src={productImage ?? "/assets/man.jpg"}
          width={60}
          height={60}
          className=" size-[60px] overflow-hidden rounded-full object-cover"
        />
        <div className="flex flex-col gap-3">
          <p className=" font-bold text-[16px] max-w-[200px] overflow-ellipsis">
            {name.slice(0, 30) + "...."}
          </p>

          <div className=" flex items-center gap-3">
            <div className=" bg-white grid place-items-center rounded-full size-[20px]">
              <MapPin size={14} className="text-black" />
            </div>
            <span className=" font-medium text-sm text-gray-600">
              {" "}
              {location}{" "}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <p className=" font-bold text-xl overflow-ellipsis">₦{price}</p>

        <div className=" flex items-center gap-3">
          <div className=" bg-white grid place-items-center rounded-full size-[20px]">
            <Clock size={14} className="text-black" />
          </div>
          <span className=" font-medium text-sm text-gray-600">
            {" "}
            {formattedTime}
          </span>
        </div>
      </div>
    </div>
  );
};

export const ProductPillDahboardSkeleton = () => {
  return (
    <div className="rounded-[30px] w-full py-3 px-3 bg-primary flex items-center justify-between animate-pulse">
      {/* Left side content skeleton */}
      <div className="flex items-center gap-4">
        <div className="size-[60px] overflow-hidden rounded-full bg-gray-200"></div>
        <div className="flex flex-col gap-3">
          <div className="h-5 w-40 bg-gray-200 rounded-md"></div>
          <div className="flex items-center gap-3">
            <div className="bg-gray-200 rounded-full size-[20px]"></div>
            <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>

      {/* Right side content skeleton */}
      <div className="flex flex-col items-end gap-3">
        <div className="h-6 w-20 bg-gray-200 rounded-md"></div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-200 rounded-full size-[20px]"></div>
          <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};
