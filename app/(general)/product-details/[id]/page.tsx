"use client";
import { Pill } from "@/app/components/pill";
import Back from "@/app/components/reusables/back";
import { cn } from "@/lib/utils";
import { CalendarHeart, ChevronDown, ChevronUp, Heart, PackageOpen, Percent } from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import YouMightLike from "../../_compoenents/you-might-like";

const Page = () => {
  const router = useRouter();
  const params = useSearchParams();
  const size = params.get("size");

  // Function to update URL without reloading the page
  const updateSizeParam = (newSize: string) => {
    const currentParams = new URLSearchParams(Array.from(params.entries())); // Preserve existing params
    currentParams.set("size", newSize); // Update the 'size' param

    router.replace(`?${currentParams.toString()}`, { scroll: false }); // Replace URL without reload
  };

  const [showDescription, setShowDescription] = useState(false);
  const [showShippingDetails, setShowShippingDetails] = useState(false);
  return (
    <div className="min-h-screen w-[90%] mx-auto px-5 lg:px-10 py-[calc(10vh+50px)]">
      <div className="flex gap-1 items-center">
        <Back />
        <h1 className="text-zinc-600 font-medium">Product Details</h1>
      </div>

      <div className="flex my-10 flex-col w-full lg:flex-row gap-10">
        {/* Product Image Section */}
        <div className="h-[650px] w-full lg:w-[45%] px-5 rounded-2xl relative overflow-hidden">
          <div className="grid absolute top-5 left-1/2 -translate-x-1/2 z-10 grid-cols-4 gap-2 rounded-2xl w-[80%] mx-auto">
            <div className="h-[5px] bg-gray-300 rounded"></div>
            <div className="h-[5px] bg-white rounded"></div>
            <div className="h-[5px] bg-gray-300 rounded"></div>
            <div className="h-[5px] bg-gray-300 rounded"></div>
          </div>
          <Image
            src={"/assets/login.jpg"}
            alt="Product Image"
            fill
            className="object-cover"
            priority
          />
          <div className="inset-0 bg-black opacity-50 absolute"></div>
          <div className="absolute w-[80%] z-10 bottom-2 left-1/2 -translate-1/2 space-x-5 grid-cols-3 grid">
            <div className="relative h-[150px] border-3 border-gray-300 rounded-xl overflow-hidden">
              <Image
                src={"/assets/login.jpg"}
                alt="Product Thumbnail"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="relative h-[150px] border-3 border-gray-300 rounded-xl overflow-hidden">
              <Image
                src={"/assets/login.jpg"}
                alt="Product Thumbnail"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="relative h-[150px] border-3 border-gray-300 rounded-xl overflow-hidden">
              <Image
                src={"/assets/login.jpg"}
                alt="Product Thumbnail"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="w-full lg:w-[45%] flex flex-col gap-3">
          <Pill text="MEN" />
          <h1 className="font-bold text-4xl mt-5">Men Hoodie</h1>
          <p className="font-bold text-lg">$24.99</p>

          <p className="text-xs text-zinc-500">Select size</p>
          <div className="grid grid-cols-4 gap-2">
            {["S", "M", "L", "XL"].map((s) => (
              <button
                key={s}
                onClick={() => updateSizeParam(s)}
                className={cn(
                  "bg-gray-100 px-10 py-3 rounded-[30px] cursor-pointer font-medium",
                  { "bg-black text-white": size === s }
                )}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button className=" w-full bg-black text-white px-10 py-3 rounded-[30px] cursor-pointer font-medium">
              Add to Cart
            </button>
            <button className=" size-10 grid place-content-center shrink-0   rounded-full border border-gray-300">
              <Heart className=" text-zinc-500 w-5 h-5" />
            </button>
          </div>

          <div className="p-3 border border-gray-300 rounded-xl flex flex-col">
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Description</p>
              <button
                onClick={() => setShowDescription(!showDescription)}
                className=" size-8 grid cursor-pointer place-content-center shrink-0   rounded-full border border-gray-300"
              >
                {showDescription ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            <p
              className={cn(
                "text-sm transition-all duration-500 ease-in-out text-zinc-500 overflow-hidden",
                showDescription ? "max-h-[600px] mt-5 " : "max-h-[0px]"
              )}
            >
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum
              nulla, omnis, tempore minima illum delectus obcaecati adipisci
              fugit, veritatis natus soluta quod debitis. Atque natus quibusdam
              esse quis, distinctio exercitationem voluptates...
            </p>
          </div>

          <div className="p-3 border mt-5 border-gray-300 rounded-xl flex flex-col">
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Shipping Details</p>
              <button
                onClick={() => setShowShippingDetails(!showShippingDetails)}
                className=" size-8 grid cursor-pointer place-content-center shrink-0   rounded-full border border-gray-300"
              >
                {showShippingDetails ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            <div
              className={cn(
                "grid _ transition-all duration-500 ease-in-out  overflow-hidden  grid-cols-2 gap-5",
                showShippingDetails ? "max-h-[600px] mt-5 p-2" : "max-h-[0px]"
              )}
            >
              <div className="flex items-center gap-2">
                <div className="size-12 rounded-full bg-zinc-100 grid place-items-center">
                <Percent />
                </div>
                <div className="flex flex-col gap-1">
                  <small className="text-zinc-500 text-sm font-medium">
                    Discount
                  </small>
                  <p className="font-bold text-lg">Disc 50%</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="size-12 rounded-full bg-zinc-100 grid place-items-center">
                <PackageOpen />
                </div>
                <div className="flex flex-col gap-1">
                  <small className="text-zinc-500 text-sm font-medium">
                    Package
                  </small>
                  <p className="font-bold text-lg">Regular Packaging%</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="size-12 rounded-full bg-zinc-100 grid place-items-center">
                <CalendarHeart />
                </div>
                <div className="flex flex-col gap-1">
                  <small className="text-zinc-500 text-sm font-medium">
                    Delievery Time
                  </small>
                  <p className="font-bold text-lg">4-5 Working Days</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <div className="size-12 rounded-full bg-zinc-100 grid place-items-center"></div>
                <div className="flex flex-col gap-1">
                  <small className="text-zinc-500 text-sm font-medium">
                    Product Details
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>




      <YouMightLike />
    </div>
  );
};

export default Page;
