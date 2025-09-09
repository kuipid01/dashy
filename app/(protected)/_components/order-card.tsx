/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from "@/constants/types";
import {
  BookDown,
  Bus,
  ChevronRight,
  MapPin,
  MoveRight,
  Truck,
  MoreVertical,
  Calendar,
  CheckCircle,
  Clock,
  Package,
  XCircle
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useUpdateOrder } from "@/app/(handlers)/orders";
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
  const { mutateAsync: updateOrder, isPending: updatingOrder } =
    useUpdateOrder();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [estimatedArrivalDate, setEstimatedArrivalDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(order.status);

  // Quick date options
  const quickDateOptions = [
    { label: "In 3 days", days: 3 },
    { label: "In 5 days", days: 5 },
    { label: "In 1 week", days: 7 },
    { label: "In 2 weeks", days: 14 },
    { label: "In 1 month", days: 30 }
  ];

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      value: "processing",
      label: "Processing",
      icon: Package,
      color: "text-blue-600"
    },
    {
      value: "shipped",
      label: "Shipped",
      icon: Truck,
      color: "text-purple-600"
    },
    {
      value: "delivered",
      label: "Delivered",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      value: "cancelled",
      label: "Cancelled",
      icon: XCircle,
      color: "text-red-600"
    }
  ];

  const handleQuickDateSelect = (days: number) => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    setEstimatedArrivalDate(futureDate.toISOString().split("T")[0]);
  };

  const handleUpdateOrder = async () => {
    try {
      // TODO: Implement API call to update order
      console.log("Updating order:", {
        orderId: order.id,
        estimatedArrivalDate,
        status: selectedStatus
      });

      // Simulate API call
      await updateOrder({
        id: order.id,
        data: {
          arrival_date: estimatedArrivalDate
            ? new Date(estimatedArrivalDate)
            : undefined,
          status:
            selectedStatus === "draft"
              ? "pending"
              : (selectedStatus as
                  | "pending"
                  | "processing"
                  | "shipped"
                  | "delivered"
                  | "cancelled"
                  | undefined)
        }
      });
      setIsUpdateDialogOpen(false);
      // TODO: Show success notification
    } catch (error) {
      console.error("Error updating order:", error);
      // TODO: Show error notification
    } finally {
    }
  };
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
          {/* /TODO:UPDATE BACKEND TO REFLECT ARRIVAL DATE */}
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
            src={
              order?.orderItems
                ? order?.orderItems[0]?.Product.Image
                : "/assets/login.jpg"
            }
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
        <Dialog>
          <DialogTrigger asChild>
            <button className=" cursor-pointer px-5 py-2 rounded-md bg-[#F7F7F8] text-[14px]  md:text-[16px]  2xl:text-[18px]  font-medium text-black ">
              {" "}
              DETAILS
            </button>
          </DialogTrigger>
          <DialogClose className="hidden" />
          <DialogContent className="w-[500px] flex flex-col gap-3 p-5 h-fit  items-start rounded-xl">
            <div className="hidden">
              <DialogTitle></DialogTitle>
            </div>

            <div
              className="flex text-xs font-medium text-zinc-500 items-center gap-1
    "
            >
              Home <ChevronRight size={12} /> Orders <ChevronRight size={12} />{" "}
              <span className="">#ID{order?.id}</span>
            </div>
            <div className="flex justify-between w-full items-center">
              <p className="text-black text-xl font-medium">
                ORDER ID: <span className="text-zinc-800">{order?.id}</span>
              </p>
              <div className="flex items-center  gap-2">
                <button
                  onClick={() => setInvoiceOpen(true)}
                  className="p-2 flex items-center cursor-pointer gap-1 rounded-md bg-[#F7F7F8]/10 border border-zinc-600 text-[9px]  2xl:text-[10px]  font-medium text-black "
                >
                  {" "}
                  <BookDown size={14} className="text-zinc-800" />
                  INVOICE
                </button>
                <button
                  onClick={() => setIsOrderTrackingOpen(true)}
                  className="p-2 flex items-center cursor-pointer gap-1 rounded-md bg-black text-[9px]  2xl:text-[10px]  font-medium text-white "
                >
                  {" "}
                  <Truck size={14} className="text-zinc-300" />
                  TRACK
                </button>
              </div>
            </div>

            <div className="flex  items-center">
              <span className="  mr-1 text-[13px] font-medium text-zinc-500">
                Order date:{" "}
              </span>{" "}
              <span className=" text-[13px] font-medium text-zinc-700">
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
              </span>{" "}
              <hr className=" h-5 w-[1px]  mx-5 bg-zinc-200" />
              <span className=" text-[13px] mr-1 font-medium text-zinc-500">
                {" "}
                <Truck size={14} className=" inline-block" /> Estimated
                Delivery:{" "}
              </span>{" "}
              <span className=" text-[13px] font-medium text-zinc-500">
                {order?.arrival_date
                  ? new Date(order.arrival_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })
                  : "TBD"}
              </span>
            </div>

            <div className="flex flex-col gap-3  py-3 border-y border-gray-300 w-full">
              {order?.orderItems?.map((orderItem) => (
                <div
                  key={orderItem?.orderID || orderItem?.productID}
                  className="  flex items-center justify-between"
                >
                  <div className=" flex gap-2 items-center">
                    <Image
                      src={
                        (orderItem?.Product?.Image as string) ||
                        (orderItem?.Product?.image?.[0] as string) ||
                        "/assets/login.jpg"
                      }
                      alt={
                        orderItem?.Product?.Name ||
                        orderItem?.Product?.name ||
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

            <div className="flex justify-between w-full ">
              <div className="flex flex-col gap-3">
                <p className="headerText">Payment</p>
                <div className=" flex items-center gap-3">
                  <p className=" headerText text-slate-800">
                    {order?.payment?.status === "completed"
                      ? "Paid"
                      : "Pending"}
                  </p>
                  <div className=" border text-[9px] text-blue-950 font-medium border-blue-900 p-1 rounded-md">
                    {order?.payment?.status === "completed"
                      ? "PAID"
                      : "PENDING"}
                  </div>
                </div>
              </div>

              <div className=" flex flex-col gap-3">
                <p className="headerText">Delivery</p>
                <div
                  className="flex flex-col gap-1
              "
                >
                  <p className=" text-zinc-600 text-xs font-medium">ADDRESS</p>
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
            <div className="flex justify-between  py-3 border-t border-gray-300  w-full ">
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
                  <p className=" text-[16px] ">SubTotal:</p>
                  <p className="light_mid font-bold">₦{order?.total || 0}</p>
                </div>
                {/* <div className="flex items-center mb-1 justify-between text-zinc-500 text-[14px] font-medium gap-10">
                  <p className="  ">Commission:</p>
                  <p className="">₦{order?.commision || 0}</p>
                </div> */}
                <div className="flex items-center mb-1 justify-between text-zinc-500 text-[14px] font-medium gap-10">
                  <p className="  ">Delivery:</p>
                  <p className="">₦{order?.deliveryOption?.price || 0}</p>
                </div>
                <div className="flex items-center justify-between text-zinc-500 text-[14px] font-medium gap-10">
                  <p className="  ">Tax:</p>
                  <p className="">₦0</p>
                </div>
                <div className="flex items-center justify-between py-2 border-t-1 mt-3 border-dashed gap-10">
                  <p className=" text-[16px] ">Total:</p>
                  <p className="light_mid font-bold">₦{order?.total || 0}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Update Order Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="w-[500px] max-w-[90vw] flex flex-col gap-4 p-6">
          <DialogTitle className="text-xl font-semibold">
            Update Order #{order?.id}
          </DialogTitle>

          <div className="space-y-4">
            {/* Estimated Arrival Date Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Estimated Arrival Date
              </Label>

              {/* Quick Date Options */}
              <div className="grid grid-cols-2 gap-2">
                {quickDateOptions.map((option) => (
                  <Button
                    key={option.days}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickDateSelect(option.days)}
                    className="text-xs"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              {/* Custom Date Input */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">
                  Or select a custom date:
                </Label>
                <Input
                  type="date"
                  value={estimatedArrivalDate}
                  onChange={(e) => setEstimatedArrivalDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full"
                />
              </div>
            </div>

            {/* Order Status Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Order Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full text-black">
                  <SelectValue
                    className="text-black"
                    placeholder="Select status"
                  />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => {
                    const IconComponent = status.icon;
                    return (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent
                            className={`h-4 w-4 ${status.color}`}
                          />
                          <span>{status.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setIsUpdateDialogOpen(false)}
              disabled={updatingOrder}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateOrder}
              disabled={
                updatingOrder ||
                (!estimatedArrivalDate && selectedStatus === order.status)
              }
              className="bg-black text-white hover:bg-gray-800"
            >
              {updatingOrder ? "Updating..." : "Update Order"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
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
