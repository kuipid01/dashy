/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  Star,
  MapPin,
  Phone,
  Clock,
  MessageSquare,
  Mail,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Store } from "@/types/store";
import Skeleton from "@/app/(general)/_compoenents/skeleton";
import { useStoreActivationFromStore } from "@/lib/hooks/use-store-activation";

const StoreInfo = ({
  data,
  isLoading
}: {
  data?: Store;
  isLoading: boolean;
}) => {
  const storeActivation = useStoreActivationFromStore(data);

  // const storeRating = 4.8;
  if (!data || isLoading)
    return (
      <div className=" flex flex-col gap-5">
        <Skeleton className="w-full h-[50px] " />
        <Skeleton className="w-full h-[50px]" />
        <Skeleton className="w-full h-[50px]" />
        <Skeleton className="w-full h-[50px]" />
      </div>
    );
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl uppercase font-bold text-gray-900">
          {data?.name}
        </h2>

        {/* <div className="flex items-center justify-center mt-2">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={18}
              className={
                index < Math.floor(storeRating)
                  ? "text-amber-400"
                  : "text-gray-300"
              }
              fill={index < Math.floor(storeRating) ? "#FFC107" : "#D1D5DB"}
            />
          ))}
          <span className="ml-2 text-sm font-medium text-gray-700">
            {storeRating}/5
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-500">Based on 248 reviews</p> */}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 text-gray-700">
          <MapPin size={18} className="text-black flex-shrink-0" />
          <div>
            <p className="font-medium">Location</p>
            <p className="text-sm text-gray-500">{data.address}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <Phone size={18} className="text-black flex-shrink-0" />
          <div>
            <p className="font-medium">Contact</p>
            <p className="text-sm text-gray-500">{data.phone_number}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <Mail size={18} className="text-black flex-shrink-0" />
          <div>
            <p className="font-medium">Email</p>
            <p className="text-sm text-gray-500">{data.email}</p>
          </div>
        </div>

        {/* <div className="flex items-start gap-3 text-gray-700">
          <Clock size={18} className="text-black flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Business Hours</p>
            <div className="text-sm text-gray-500 mt-1 space-y-1">
              <p>Monday - Friday: 9am - 8pm</p>
              <p>Saturday: 10am - 6pm</p>
              <p>Sunday: 12pm - 5pm</p>
            </div>
          </div>
        </div> */}
      </div>
      {/* 
      <div className="space-y-4">
        <div className="flex items-start gap-3 text-gray-700">
          <Shield size={18} className="text-black flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Store Policies</p>
            <div className="text-sm text-gray-500 mt-1 space-y-2">
              <p>Free shipping on orders over $50</p>
              <p>30-day returns on all items</p>
              <p>1-year warranty on electronics</p>
            </div>
          </div>
        </div>
      </div> */}

      <div className="pt-4 border-t border-gray-200">
        <button className="w-full bg-black hover:bg-black/50 cursor-pointer text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
          <MessageSquare size={18} />
          <span>Contact Store</span>
        </button>
      </div>
    </div>
  );
};

export default StoreInfo;
