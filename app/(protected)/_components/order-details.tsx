"use client";
import React from "react";

import { Order } from "@/constants/types";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { BookDown, ChevronRight, Truck } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import InvoiceGenerator from "./invoice-generator";
import OrderTracking from "./order-tracking";

interface OrderDetailsProps {
  order: Order;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  children?: React.ReactNode;
}

export default function OrderDetails({
  order,
  isOpen,
  setIsOpen,
  children
}: OrderDetailsProps) {
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = React.useState(false);
  const [isInvoiceOpen, setInvoiceOpen] = React.useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children ? <DialogTrigger asChild>{children}</DialogTrigger> : null}
      <DialogClose className="hidden" />
      <DialogContent className="w-[500px] flex flex-col gap-3 p-5 h-fit items-start rounded-xl">
        <div className="hidden">
          <DialogTitle></DialogTitle>
        </div>

        <div className="flex text-xs font-medium text-zinc-500 items-center gap-1">
          Home <ChevronRight size={12} /> Orders <ChevronRight size={12} />{" "}
          <span className="">#ID{order?.id}</span>
        </div>
        <div className="flex justify-between w-full items-center">
          <p className="text-black text-xl font-medium">
            ORDER ID: <span className="text-zinc-800">{order?.id}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setInvoiceOpen(true)}
              className="p-2 flex items-center cursor-pointer gap-1 rounded-md bg-[#F7F7F8]/10 border border-zinc-600 text-[9px] 2xl:text[10px] font-medium text-black"
            >
              <BookDown size={14} className="text-zinc-800" /> INVOICE
            </button>
            <button
              onClick={() => setIsOrderTrackingOpen(true)}
              className="p-2 flex items-center cursor-pointer gap-1 rounded-md bg-black text-[9px] 2xl:text[10px] font-medium text-white"
            >
              <Truck size={14} className="text-zinc-300" /> TRACK
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <span className="mr-1 text-[13px] font-medium text-zinc-500">
            Order date:{" "}
          </span>
          <span className="text-[13px] font-medium text-zinc-700">
            {order?.placedAt
              ? new Date(order.placedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })
              : order?.placed_at
              ? new Date(order.placed_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })
              : "N/A"}
          </span>
          <hr className="h-5 w-[1px] mx-5 bg-zinc-200" />
          <span className="text-[13px] mr-1 font-medium text-zinc-500">
            <Truck size={14} className="inline-block" /> Estimated Delivery:
          </span>
          <span className="text-[13px] font-medium text-zinc-500">
            {order?.arrival_date
              ? new Date(order.arrival_date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric"
                })
              : "TBD"}
          </span>
        </div>

        <div className="flex flex-col gap-3 py-3 border-y border-gray-300 w-full">
          {order?.orderItems?.map((orderItem) => (
            <div
              key={orderItem?.orderID || orderItem?.productID}
              className="flex items-center justify-between"
            >
              <div className="flex gap-2 items-center">
                <Image
                  src={
                    (orderItem?.Product?.Image as string) ||
                    (orderItem?.Product?.image?.[0] as string) ||
                    "/assets/login.jpg"
                  }
                  alt={
                    orderItem?.Product?.Name ||
                    orderItem?.Product?.name ||
                    orderItem?.name ||
                    "order image"
                  }
                  width={70}
                  height={80}
                  className="object-cover h-[80px] rounded-md"
                />
                <div className="flex flex-col gap-2">
                  <p className="headerText">
                    {orderItem?.Product?.Name ||
                      orderItem?.Product?.name ||
                      orderItem?.name}
                  </p>
                  <p className="light_mid capitalize">
                    {orderItem?.Product?.Category ||
                      orderItem?.Product?.category ||
                      "Category"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="headerText">
                  ₦{orderItem?.TotalPrice || orderItem?.price || 0}
                </p>
                <p className="light_mid capitalize">
                  QTY: {orderItem?.Quantity || orderItem?.quantity || 1}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-3">
            <p className="headerText">Payment</p>
            <div className="flex items-center gap-3">
              <p className="headerText text-slate-800">
                {order?.payment?.status === "completed" ? "Paid" : "Pending"}
              </p>
              <div className="border text-[9px] text-blue-950 font-medium border-blue-900 p-1 rounded-md">
                {order?.payment?.status === "completed" ? "PAID" : "PENDING"}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="headerText">Delivery</p>
            <div className="flex flex-col gap-1">
              <p className="text-zinc-600 text-xs font-medium">ADDRESS</p>
              <p className="light_mid">
                {order?.address?.Street || order?.address?.street || "N/A"},{" "}
                {order?.address?.City || order?.address?.city || "N/A"},{" "}
                {order?.address?.State || order?.address?.state || "N/A"}
              </p>
              <p className="light_mid text-xs">
                {order?.contact?.FirstName || order?.contact?.name || "N/A"}{" "}
                {order?.contact?.LastName || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between py-3 border-t border-gray-300 w-full">
          <div className="flex flex-col gap-3">
            <p className="headerText">Need Help?</p>
            <div className="flex flex-col gap-3 text-xs font-medium text-gray-500">
              <p>Order Issues</p>
              <p>Delivery Info</p>
              <p>Returns</p>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="headerText mb-3">Order Summary</p>
            <div className="flex items-center mb-1 justify-between gap-10">
              <p className="text-[16px]">SubTotal:</p>
              <p className="light_mid font-bold">₦{order?.total || 0}</p>
            </div>
            <div className="flex items-center mb-1 justify-between text-zinc-500 text-[14px] font-medium gap-10">
              <p className="">Delivery:</p>
              <p className="">₦{order?.deliveryOption?.price || 0}</p>
            </div>
            <div className="flex items-center justify-between text-zinc-500 text-[14px] font-medium gap-10">
              <p className="">Tax:</p>
              <p className="">₦0</p>
            </div>
            <div className="flex items-center justify-between py-2 border-t-1 mt-3 border-dashed gap-10">
              <p className="text-[16px]">Total:</p>
              <p className="light_mid font-bold">₦{order?.total || 0}</p>
            </div>
          </div>
        </div>

        <OrderTracking
          order={order}
          isOpen={isOrderTrackingOpen}
          setIsOpen={setIsOrderTrackingOpen}
        >
          <button>hi</button>
        </OrderTracking>
        <InvoiceGenerator
          isOpen={isInvoiceOpen}
          order={order}
          setIsOpen={setInvoiceOpen}
        />
      </DialogContent>
    </Dialog>
  );
}
