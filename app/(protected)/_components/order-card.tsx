import { Order } from "@/constants/types";
import {
  BookDown,
  Bus,
  ChevronRight,
  MapPin,
  MoveRight,
  Truck,
} from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className=" rounded-xl py-3 h-fit bgblur  overflow-hidden flex flex-col gap-3">
      <div className=" p-3 flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p className=" text-[8px] md:text-xs  2xl:text-[14px]  font-medium text-zinc-600">
              ORDER ID
            </p>

            <p className=" text-[14px]  md:text-[16px]  2xl:text-[18px]  text-zinc-900 font-medium">
              #{order.id}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex text-[8px] md:text-xs  2xl:text-[14px]  font-medium text-zinc-600 bg-gray-50 px-3 py-3 rounded items-center gap-1">
              <span className="e">ARRIVAL DATE</span>
              {/* <span className="">{order.arrivalDate}</span> */}
            </div>
            <div className="flex text-[8px] md:text-xs  2xl:text-[14px]  font-medium text-zinc-500 bg-gray-50 px-3 py-3 rounded items-center gap-1">
              <span className=" capitalize">{order.status}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5 justify-between">
          <div className="flex text-[8px] md:text-xs  2xl:text-[14px]  font-medium text-zinc-500 bg-gray-50 px-3 py-3 rounded items-center gap-1">
            <Bus size={14} className="text-zinc-500" />
            {/* {order.from} */}
          </div>

          <MoveRight className="text-zinc-500 w-[30px] md:w-[50px] 2xl:w-[50px]" />
          <div className="flex text-[8px] md:text-xs  2xl:text-[14px]  font-medium text-zinc-500 bg-gray-50 px-3 py-3 rounded items-center gap-1">
            <MapPin size={14} className="text-zinc-500" />
            {order.contact?.name}
          </div>
        </div>
        <div className=" p-3 w-full flex items-center gap-3 rounded-md bg-[#F7F7F8]">
          <Image
            alt={""}
            src="/assets/login.jpg"
            width={100}
            height={100}
            className="w-[100px] h-[100px] rounded-md object-cover"
          />
          <div className="flex flex-col gap-1">
            <p className=" text-[14px]  md:text-[16px]  2xl:text-[18px]  font-medium text-black">
              {order.orderItems[0].name}
            </p>
            <p className=" text-[14px]  md:text-[16px]  2xl:text-[18px]  text-black">
              {order.orderItems[0].price}
            </p>
          </div>
        </div>
      </div>

      <div className=" w-full p-3 flex justify-between items-center  border-t-2 border-gray-200">
        <p className="text-[14px]  md:text-[16px]  2xl:text-[18px]  font-medium text-black">
          {order.orderItems.length ?? 0} items
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
              <span className="">#ID{order.id}</span>
            </div>
            <div className="flex justify-between w-full items-center">
              <p className="text-black text-xl font-medium">
                ORDER ID: <span className="text-zinc-800">{order.id}</span>
              </p>
              <div className="flex items-center  gap-2">
                <button className="p-2 flex items-center gap-1 rounded-md bg-[#F7F7F8]/10 border border-zinc-600 text-[9px]  2xl:text-[10px]  font-medium text-black ">
                  {" "}
                  <BookDown size={14} className="text-zinc-800" />
                  INVOICE
                </button>
                <button className="p-2 flex items-center gap-1 rounded-md bg-black text-[9px]  2xl:text-[10px]  font-medium text-white ">
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
                Feb 16 2022
              </span>{" "}
              <hr className=" h-5 w-[1px]  mx-5 bg-zinc-200" />
              <span className=" text-[13px] mr-1 font-medium text-zinc-500">
                {" "}
                <Truck size={14} className=" inline-block" /> Estimated
                Delivery:{" "}
              </span>{" "}
              <span className=" text-[13px] font-medium text-zinc-500">
                Feb 16 2022
              </span>
            </div>

            <div className="flex flex-col gap-3  py-3 border-y border-gray-300 w-full">
              {order.orderItems?.map((order) => (
                <div
                  key={order.orderID}
                  className="  flex items-center justify-between"
                >
                  <div className=" flex gap-2 items-center">
                    <Image
                      src="/assets/login.jpg"
                      alt="order image"
                      width={70}
                      height={80}
                      className="object-cover h-[80px] rounded-md"
                    />
                    <div className="flex flex-col gap-2">
                      <p className="headerText">{order.name}</p>
                      <p className="light_mid capitalize">CATEGORY gOES HERE</p>
                    </div>
                  </div>

                  <div className="flex flex-col GAP-2">
                    <p className="headerText">{order.price}</p>
                    <p className="light_mid capitalize">QTY:1</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between w-full ">
              <div className="flex flex-col gap-3">
                <p className="headerText">Payment</p>
                <div className=" flex items-center gap-3">
                  <p className=" headerText text-slate-800">VISA **56</p>
                  <div className=" border text-[9px] text-blue-950 font-medium border-blue-900 p-1 rounded-md">
                    VISA
                  </div>
                </div>
              </div>

              <div className=" flex flex-col gap-3">
                <p className="headerText">Delivery</p>
                <div
                  className="flex flex-col gap-1
              "
                >
                  <p className=" text-zinc-600 text-xs font-medium m">
                    ADDRESS
                  </p>
                  <p className="light_mid">{order.contact?.name}</p>
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
                  <p className="light_mid font-bold">$10999</p>
                </div>
                <div className="flex items-center mb-1 justify-between text-zinc-500 text-[14px] font-medium gap-10">
                  <p className="  ">Discount:</p>
                  <p className="">$10999</p>
                </div>
                <div className="flex items-center mb-1 justify-between text-zinc-500 text-[14px] font-medium gap-10">
                  <p className="  ">Delivery:</p>
                  <p className="">$10.33</p>
                </div>
                <div className="flex items-center justify-between text-zinc-500 text-[14px] font-medium gap-10">
                  <p className="  ">Tax:</p>
                  <p className="">$1</p>
                </div>
                <div className="flex items-center justify-between py-2 border-t-1 mt-3 border-dashed gap-10">
                  <p className=" text-[16px] ">Total:</p>
                  <p className="light_mid font-bold">$10999</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
