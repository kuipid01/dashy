import { Order } from "@/constants/types";
import { Bus, MapPin, MoveRight } from "lucide-react";
import Image from "next/image";

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className=" rounded-xl py-3 h-fit bg-white  overflow-hidden flex flex-col gap-3">
      <div className=" p-3 flex flex-col gap-3">
        <div className="flex justify-between">
          <div className="flex flex-col">
            <p className=" text-[8px] md:text-xs  lg:text-[14px]  font-medium text-zinc-600">
              ORDER ID
            </p>

            <p className=" text-[14px]  md:text-[16px]  lg:text-[18px]  text-zinc-900 font-medium">
              #{order.orderId}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex text-[8px] md:text-xs  lg:text-[14px]  font-medium text-zinc-600 bg-gray-50 px-3 py-3 rounded items-center gap-1">
              <span className="e">ARRIVAL DATE</span>
              <span className="">{order.arrivalDate}</span>
            </div>
            <div className="flex text-[8px] md:text-xs  lg:text-[14px]  font-medium text-zinc-500 bg-gray-50 px-3 py-3 rounded items-center gap-1">
              <span className=" capitalize">{order.status}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5 justify-between">
          <div className="flex text-[8px] md:text-xs  lg:text-[14px]  font-medium text-zinc-500 bg-gray-50 px-3 py-3 rounded items-center gap-1">
            <Bus size={14} className="text-zinc-500" />
            {order.from}
          </div>

          <MoveRight className="text-zinc-500 w-[30px] md:w-[50px] lg:w-[50px]" />
          <div className="flex text-[8px] md:text-xs  lg:text-[14px]  font-medium text-zinc-500 bg-gray-50 px-3 py-3 rounded items-center gap-1">
            <MapPin size={14} className="text-zinc-500" />
            {order.to}
          </div>
        </div>
        <div className=" p-3 w-full flex items-center gap-3 rounded-md bg-[#F7F7F8]">
          <Image
            alt={order.orderId}
            src="/assets/login.jpg"
            width={100}
            height={100}
            className="w-[100px] h-[100px] rounded-md object-cover"
          />
          <div className="flex flex-col gap-1">
            <p className=" text-[14px]  md:text-[16px]  lg:text-[18px]  font-medium text-black">
              {order.items[0].name}
            </p>
            <p className=" text-[14px]  md:text-[16px]  lg:text-[18px]  text-black">{order.items[0].price}</p>
          </div>
        </div>
      </div>

      <div className=" w-full p-3 flex justify-between items-center  border-t-2 border-gray-200">
        <p className="text-[14px]  md:text-[16px]  lg:text-[18px]  font-medium text-black">
          {order.items.length} items
        </p>

        <button className=" px-5 py-2 rounded-md bg-[#F7F7F8] text-[14px]  md:text-[16px]  lg:text-[18px]  font-medium text-black ">
          {" "}
          DETAILS
        </button>
      </div>
    </div>
  );
}
