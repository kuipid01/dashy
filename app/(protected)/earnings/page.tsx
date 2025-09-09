/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import TopCard from "./components/top-card";
import ActiveCustomersChart from "./components/customer-card";
import EarningsChart from "./components/earning";
import Link from "next/link";
import Image from "next/image";
import {
  useFetchStoreEarnings,
  useFetchStoreOrders
} from "@/app/(handlers)/orders/orders";
import { useFetchTopProducts } from "@/app/(handlers)/product/product";
import { useEarnings } from "@/app/(handlers)/earnings";
import TopSellingProducts from "../_components/top-selling-products";
import {
  useFetchUser,
  useFetchUserStore
} from "@/app/(handlers)/auth-handlers/auth";
import { Product } from "@/constants/types";
import TopSellingProductsV2 from "../_components/top-selling-products-v2";

const Page = () => {
  const salesMap = new Map<
    number,
    { productId: number; quantity: number; product: Product }
  >();
  const { user, isLoading: userLoading } = useFetchUser();
  const { store, isLoading: storeLoading } = useFetchUserStore();
  const { data: orders, isLoading: ordersLoading } = useFetchStoreOrders(
    store?.store?.id ?? undefined
  );
  const { data: earnings } = useFetchStoreEarnings();
  const { data: topProducts, isLoading: fetchingTopProducts } =
    useFetchTopProducts();
  // Convert to array and sort by quantity sold
  console.log(topProducts, "TOPPRODUCTS");
  // Loading states
  const isLoading = userLoading || storeLoading || ordersLoading;
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TopCard
          amount={earnings?.this_month_earnings ?? 0}
          direction={earningsDirection}
          percent={earnings?.growth_rate ?? 0}
          subText="order"
          title="Earning"
          chartData={chartData}
        />

        <div className="lg:col-span-2  h-[400px]">
          <EarningsChart chartData={chartData} />
        </div>
      </div>

      {/* BOTTOM SECTION */}

      {/* CUSTOMERS + TOP PRODUCTS */}
      <div className="w-full mt-10  _xl:w-1/2 flex flex-col lg:flex-row gap-6">
        {/* <ActiveCustomersChart /> */}

        {/* Top Selling Products */}
        <TopSellingProductsV2
          products={topProducts ?? []}
          isLoading={fetchingTopProducts}
        />
      </div>
    </div>
  );
};

export default Page;
