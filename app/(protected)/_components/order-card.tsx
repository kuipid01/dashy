/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from "@/constants/types";
import {
  Bus,
  MapPin,
  MoveRight,
  Truck,
  MoreVertical,
  Calendar,
  Package
} from "lucide-react";
import Image from "next/image";
//
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Button } from "@/components/ui/button";
//
import OrderDetails from "./order-details";
import UpdateOrderDialog from "./update-order-dialog";
import OrderTracking from "./order-tracking";
import InvoiceGenerator from "./invoice-generator";

export default function OrderCard({
  order,
  store
}: {
  order: Order;
  store: any;
}) {
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isInvoiceOpen, setInvoiceOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const imageToRender = order?.orderItems[0]?.Product.Image.includes(",")
    ? order?.orderItems[0]?.Product.Image.split(",")
    : order?.orderItems[0]?.Product.Image;
  console.log(imageToRender[0], "image to redner");
  //
  return (
    <div className=" rounded-xl py-3 h-fit bgblur  overflow-hidden flex flex-col gap-3">
      <div className=" p-3 flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p className=" text-[8px] md:text-xs  2xl:text-[14px]  font-medium text-zinc-600">
              ORDER ID
            </p>

            <p className=" text-[14px]  md:text-[16px]  2xl:text-[18px]  text-zinc-900 font-medium">
              #{order?.id}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex text-[8px] md:text-xs  2xl:text-[12px]  font-medium text-zinc-600 bg-gray-50 px-3 py-3 rounded items-center gap-1">
              <span className="e">EXP ARRIVAL </span>
              <span className="">
                {order?.arrival_date
                  ? typeof order.arrival_date === "string"
                    ? new Date(order.arrival_date).toLocaleDateString()
                    : order.arrival_date instanceof Date
                    ? order.arrival_date.toLocaleDateString()
                    : ""
                  : ""}
              </span>
            </div>
            <div className="flex text-[8px] md:text-xs  2xl:text-[12px]  font-medium text-zinc-500 bg-gray-50 px-3 py-3 rounded items-center gap-1">
              <span className=" capitalize">{order?.status}</span>
            </div>

            {/* More Options Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Update Arrival Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
                  <Package className="mr-2 h-4 w-4" />
                  Update Status
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className=" cursor-pointer"
                  onClick={() => setIsOrderTrackingOpen(true)}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  Track Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-5 justify-between">
          <div className="flex _text-[12px] _md:text-xs  _2xl:text-[14px]  font-medium text-zinc-500 bg-gray-50 px-3 py-3 rounded items-center gap-1">
            <Bus size={24} className="text-zinc-500" />
            <span className=" text-sm"> {store?.state}</span>
          </div>

          <MoveRight className="text-zinc-500 w-[30px] md:w-[50px] 2xl:w-[50px]" />
          <div className="flex  font-medium text-zinc-500 bg-gray-50 px-3 py-3 rounded items-center gap-1">
            <MapPin size={24} className="text-zinc-500" />
            <div className=" text-sm">
              <span className=" font-bold  mr-2">
                {order?.address?.Country ?? ""}
              </span>
              <span>{order?.address?.State ?? ""}, </span>
              <span>{order?.address?.City ?? ""}</span>
            </div>
          </div>
        </div>
        <div className=" p-3 w-full flex items-center gap-3 rounded-md bg-[#F7F7F8]">
          <Image
            alt={""}
            src={imageToRender[0] ?? "/assets/login.jpg"}
            width={100}
            height={100}
            className="w-[100px] h-[100px] rounded-md object-cover"
          />
          <div className="flex flex-col gap-1">
            <p className=" text-[14px] capitalize  md:text-[16px]  2xl:text-[18px]  font-medium text-black">
              {order?.orderItems && order?.orderItems[0]?.Product.Name}
            </p>
            <p className=" text-[14px]  font-bold md:text-[16px]  2xl:text-[18px]  text-black">
              ₦{order?.orderItems && order?.orderItems[0]?.TotalPrice}
            </p>
          </div>
        </div>
      </div>

      <div className=" w-full p-3 flex justify-between items-center  border-t-2 border-gray-200">
        <p className="text-[14px]  md:text-[16px]  2xl:text-[18px]  font-medium text-black">
          {order?.orderItems?.length ?? 0} items
        </p>

        <OrderDetails
          order={order}
          isOpen={isDetailsOpen}
          setIsOpen={setIsDetailsOpen}
        >
          <button className=" cursor-pointer px-5 py-2 rounded-md bg-[#F7F7F8] text-[14px]  md:text-[16px]  2xl:text-[18px]  font-medium text-black ">
            DETAILS
          </button>
        </OrderDetails>
      </div>

      {/* Update Order Dialog */}
      <UpdateOrderDialog
        order={order}
        isOpen={isUpdateDialogOpen}
        onOpenChange={setIsUpdateDialogOpen}
      />
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
    </div>
  );
}
