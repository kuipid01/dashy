"use client";
import React from "react";
import TopCard from "./components/top-card";
import ActiveCustomersChart from "./components/customer-card";
import EarningsChart from "./components/earning";
import Link from "next/link";
import Image from "next/image";

const Page = () => {
  return (
    <div className=" pb-10">
      <div className="grid grid-cols-3 gap-10">
        <TopCard
          direction="surged"
          percent={20}
          subText="balance"
          amount={150410}
          title="Balance"
        />
        <TopCard
          amount={24590}
          direction="decreased"
          percent={2}
          subText="order"
          title="Earning"
        />
        <TopCard
          amount={2344}
          direction="decreased"
          percent={100}
          subText="customers"
          title="Customers"
        />
      </div>
      <div className="flex flex- mt-10 gap-10">
        <div className="w-[30%] flex-col flex gap-5 h-[700px]">
          <ActiveCustomersChart />
          <div className=" p-2 bg-white _p-6 rounded-lg shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold text-gray-900">Top Product</p>

              <Link href="" className=" underline underline-offset-2">
                See More
              </Link>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <Image
                src="/assets/retro.jpg"
                className=" rounded-md overflow-hidden h-[70px] object-cover shadow shadow-gray-200 cursor-pointer"
                width={100}
                height={70}
                alt="image"
              />
              <Image
                src="/assets/retro.jpg"
                className=" rounded-md overflow-hidden h-[70px] object-cover shadow shadow-gray-200 cursor-pointer"
                width={100}
                height={70}
                alt="image"
              />
              <Image
                src="/assets/retro.jpg"
                className=" rounded-md overflow-hidden h-[70px] object-cover shadow shadow-gray-200 cursor-pointer"
                width={100}
                height={70}
                alt="image"
              />
              <Image
                src="/assets/retro.jpg"
                className=" rounded-md overflow-hidden h-[70px] object-cover shadow shadow-gray-200 cursor-pointer"
                width={100}
                height={70}
                alt="image"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 h-[700px]">
          <EarningsChart />
        </div>
      </div>
    </div>
  );
};

export default Page;
