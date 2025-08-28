/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
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
}

export const ButtonLikePill: React.FC<ButtonLikePillProps> = ({
  icon,
  text,
  onClick
}) => {
  return (
    <div
      className="flex items-center gap-2 bg-[#fffffff0] hover:bg-[#ffffffae] cursor-pointer  backdrop-blur-3xl shadow shadow-gray-300 text-gray-800 font-medium rounded-[40px] px-4 py-2 transition"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{ cursor: onClick ? "pointer" : undefined }}
    >
      {icon}
      <span className=" font-medium text-[14px]">{text}</span>
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
  value: number;
  icon1?: React.ReactNode;
  icon2?: React.ReactNode;
};

export const DashboardPill = ({
  title,
  amount,
  value,
  icon1
}: DashboardPillProps) => {
  const isNegative = value < 0;

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
        <span className="font-bold text-2xl text-gray-900">#{amount}</span>

        <div className="flex items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-2 py-1 shadow-sm">
          {/* Value number */}
          <span className="text-[10px] font-medium text-gray-600">
            {value}%
          </span>

          {/* Up/Down indicator */}
          <div
            className={cn(
              "text-white rounded-full flex justify-center items-center size-5",
              isNegative ? "bg-red-600" : "bg-green-600"
            )}
          >
            {isNegative ? (
              <ArrowDown className="w-3 h-3" />
            ) : (
              <ArrowUp className="w-3 h-3" />
            )}
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
  return (
    <div className=" rounded-[30px] w-full col-1  py-3 px-3 bg-primary flex items-center justify-between">
      <div className=" flex items-center gap-4 ">
        <Image
          alt="product-imaga"
          src={"/assets/man.jpg"}
          width={60}
          height={60}
          className=" size-[60px] overflow-hidden rounded-full object-cover"
        />
        <div className="flex flex-col gap-3">
          <p className=" font-bold text-lg max-w-[200px] overflow-ellipsis">
            {name}
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
            {time instanceof Date
              ? time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })
              : time}
          </span>
        </div>
      </div>
    </div>
  );
};
