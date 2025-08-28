"use client";

import React from "react";
import TopCard from "./components/top-card";
import ActiveCustomersChart from "./components/customer-card";
import EarningsChart from "./components/earning";
import Link from "next/link";
import Image from "next/image";
import { useFetchStoreEarnings } from "@/app/(handlers)/orders/orders";
import { useFetchTopProducts } from "@/app/(handlers)/product/product";

const Page = () => {
  const { data: earnings } = useFetchStoreEarnings();
  const { data: topProducts } = useFetchTopProducts();
  console.log(topProducts);
  const chartData =
    earnings?.monthly_earnings?.map((month) => ({
      earnings: month.amount ?? 0,
      month: month.month
    })) ?? [];

  const earningsDirection =
    (earnings?.last_month_earnings ?? 0) > (earnings?.this_month_earnings ?? 0)
      ? "decreased"
      : "surged";

  return (
    <div className="pb-10 px-6">
      {/* TOP CARDS & EARNINGS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <TopCard
          amount={earnings?.this_month_earnings ?? 0}
          direction={earningsDirection}
          percent={earnings?.growth_rate ?? 0}
          subText="order"
          title="Earning"
          chartData={chartData}
        />

        <div className="xl:col-span-2  h-[400px]">
          <EarningsChart chartData={chartData} />
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="flex flex-col xl:flex-row mt-10 gap-6">
        {/* CUSTOMERS + TOP PRODUCTS */}
        <div className="w-full xl:w-1/3 flex flex-col gap-6">
          <ActiveCustomersChart />

          {topProducts && topProducts?.length > 0 && (
            <div className="p-4 bgblur rounded-xl shadow-md flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-lg font-semibold text-gray-900">
                  Top Products
                </p>
                <Link
                  href="#"
                  className="text-sm text-primary underline underline-offset-2"
                >
                  See More
                </Link>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {topProducts?.map((product, idx) => {
                  // console.log(product);
                  return (
                    <Image
                      key={idx}
                      src={"/placeholder.png"}
                      alt={`product-${idx}`}
                      width={100}
                      height={70}
                      className="rounded-md h-[70px] object-cover shadow hover:scale-105 transition-transform cursor-pointer"
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
