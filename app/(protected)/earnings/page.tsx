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
import { usePayoutOrders } from "@/app/(handlers)/earnings/queries";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
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
  const [granularity, setGranularity] = React.useState<
    "week" | "month" | "six_months"
  >("six_months");
  const [paidOutOnly, setPaidOutOnly] = React.useState<boolean>(false);

  const { data: earnings } = useEarnings({
    granularity,
    payout_status: paidOutOnly ? "completed" : undefined
  });

  const [payoutStatus, setPayoutStatus] = React.useState<
    "completed" | "pending" | "all"
  >("all");
  const {
    data: payoutOrders,
    isFetching: loadingPayoutOrders,
    refetch: refetchPayoutOrders
  } = usePayoutOrders({
    status: payoutStatus === "all" ? undefined : payoutStatus,
    page: 1,
    limit: 20
  });

  const { data: topProducts, isLoading: fetchingTopProducts } =
    useFetchTopProducts();
  // Convert to array and sort by quantity sold

  // Loading states
  const isLoading = userLoading || storeLoading || ordersLoading;
  const chartData =
    earnings?.monthly_earnings?.map((m) => ({
      earnings: m.amount ?? 0,
      month: m.month
    })) ?? [];
  const earningsDirection =
    (earnings?.last_month_earnings ?? 0) > (earnings?.this_month_earnings ?? 0)
      ? "decreased"
      : "surged";
  const dataPie = [
    { name: "Completed", value: payoutOrders?.completedCount ?? 0 },
    { name: "Pending", value: payoutOrders?.pendingCount ?? 0 }
  ];
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
          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Timeframe</label>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={granularity}
                onChange={(e) =>
                  setGranularity(e.target.value as typeof granularity)
                }
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="six_months">Last 6 Months</option>
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={paidOutOnly}
                onChange={(e) => setPaidOutOnly(e.target.checked)}
              />
              Paid out only
            </label>
          </div>
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

      {/* Payout Status Section */}
      <div className="w-full mt-10  grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="bgblur rounded-xl border p-4 h-[360px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Payout status</h3>
            <button
              onClick={() => refetchPayoutOrders()}
              className="text-xs border rounded px-2 py-1"
              disabled={loadingPayoutOrders}
            >
              {loadingPayoutOrders ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPie}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={false}
                >
                  <Cell fill="#16a34a" /> {/* Green for Completed */}
                  <Cell fill="#f59e0b" /> {/* Yellow for Pending */}
                </Pie>

                {/* Tooltip to show value on hover */}
                <Tooltip
                  formatter={(value, name) => [`${value}`, name]}
                  contentStyle={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    border: "1px solid #ddd"
                  }}
                />

                {/* Optional Legend below the chart */}
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 bgblur rounded-xl border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold">Orders by payout status</h3>
            <div className="flex items-center gap-3">
              <select
                className="border rounded px-2 py-1 text-sm"
                value={payoutStatus}
                onChange={(e) =>
                  setPayoutStatus(e.target.value as typeof payoutStatus)
                }
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
              <button
                onClick={() => refetchPayoutOrders()}
                className="text-xs border rounded px-2 py-1"
                disabled={loadingPayoutOrders}
              >
                {loadingPayoutOrders ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm max-h-[200px] overflow-y-auto">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-3">Order ID</th>
                  <th className="py-2 pr-3">Delivery Confirmed At</th>
                  <th className="py-2 pr-3">Payout Status</th>
                </tr>
              </thead>
              <tbody className="max-h-[200px] overflow-y-auto">
                {(payoutOrders?.orders ?? []).map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-2 pr-3">#{o.id}</td>
                    <td className="py-2 pr-3">
                      {o.delivery_approved_at
                        ? new Date(o.delivery_approved_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="py-2 pr-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs ${
                          o.platform_to_store_payment_status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {o.platform_to_store_payment_status !== ""
                          ? o.platform_to_store_payment_status
                          : "pending"}
                      </span>
                    </td>
                  </tr>
                ))}
                {(!payoutOrders?.orders ||
                  payoutOrders.orders.length === 0) && (
                  <tr>
                    <td
                      className="py-6 text-center text-muted-foreground"
                      colSpan={3}
                    >
                      No orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
