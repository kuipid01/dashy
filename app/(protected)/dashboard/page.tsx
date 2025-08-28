/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";
import {
  AirVent,
  BadgePercent,
  CableCar,
  ChartNoAxesCombined,
  Download,
  Flower,
  Sparkles,
  UserRoundPlus,
  Weight
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  DotProps,
  Area,
  Tooltip
} from "recharts";
import ContainerDashboard from "../_components/container-dashboard";
import {
  ArrowDiv,
  ArrowDivNew,
  GraphGoesHere,
  Pill
} from "../_components/small-comps";

import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ProductModal } from "../_components/modals/product-modal";
import { useFetchUserProducts } from "@/app/(handlers)/product/product";
import { OnboardingFlow } from "./comps_personal/onboarding-flow";
import { useFetchUser } from "@/app/(handlers)/auth-handlers/auth";
import {
  useFetchStoreOrders,
  useUpdateOrderStatus
} from "@/app/(handlers)/orders/orders";
import SalesCard from "./comps_personal/sales-card";
import { CardContent } from "@/components/ui/card";
import SalesCardSkeleton from "./comps_personal/sales-card-skeleton";
import TotalOrdersSkeleton from "./comps_personal/order-card-skeleton";
import HeatmapDashboard from "./comps_personal/heatmap-dashboard";
import {
  generateSampleOrders,
  generateSampleProducts
} from "./comps_personal/heatmap-utils";
import {
  ButtonLikePill,
  DashboardPill,
  ProductPillDahboard,
  ViewMoreBtnPillProps
} from "@/app/(general)/_compoenents/pill-round";
import TopSellingProducts from "../_components/top-selling-products";
import LatestOrders from "../_components/latest-orders";
import MonthlyIncomeChart from "../_components/monthly-income-chart";

const products = [
  {
    id: "31265",
    name: "Galaxy X9 Ultra Camera",
    date: "19/02/2024",
    category: "Electronics",
    stock: "In Stock" as const,
    totalSales: 7892,
    image: "/assets/camera.jpg"
  },
  {
    id: "312655",
    name: "Galaxy X9 Ultra Camera",
    date: "19/02/2024",
    category: "Electronics",
    stock: "In Stock" as const,
    totalSales: 7892,
    image: "/assets/camera.jpg"
  }
  // ... more products
];

const Page = () => {
  const { data } = useFetchUserProducts();
  const { data: orders, isLoading: gettingOrders } = useFetchStoreOrders();
  const updateOrderStatus = useUpdateOrderStatus();
  interface CustomDotProps extends DotProps {
    index?: number;
  }

  const CustomDot = ({ cx, cy, index }: CustomDotProps) => {
    if (index === 5 && cx !== undefined && cy !== undefined) {
      return (
        <circle
          cx={cx}
          cy={cy}
          r={5}
          fill="black"
          stroke="black"
          strokeWidth={1}
        />
      );
    }
    return null;
  };
  const { user, isLoading } = useFetchUser();

  const [showModal, setShowModal] = useState(true);
  console.log(orders);
  const lastMonthOrders =
    orders?.filter((order) => {
      const placedAt = new Date(order.placed_at);
      const today = new Date();

      // Clone today and subtract one month
      const monthAgo = new Date(today);
      monthAgo.setMonth(today.getMonth() - 1);

      return placedAt >= monthAgo && placedAt <= today;
    }).length ?? 0;
  const compare = () => {
    if ((orders?.length ?? 0) > (lastMonthOrders ?? 0)) {
      return "Your orders have surged 🚀 Keep it up!";
    } else if ((orders?.length ?? 0) < (lastMonthOrders ?? 0)) {
      return "Your orders reduced 📉 Try adding new products or promotions.";
    } else {
      return "Your orders stayed the same ⚖️ Consistency is good!";
    }
  };

  type MonthlyData = {
    month: number; // 0 = Jan, 1 = Feb, etc.
    value: number; // total sales for the month
  };

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  const formattedData = Array.from({ length: 12 }, (_, i) => {
    const month = i;
    const value =
      orders
        ?.filter((order) => {
          const placedAt = new Date(order.placed_at);
          return placedAt.getMonth() === month;
        })
        .reduce((sum, order) => sum + (order.total || 0), 0) ?? 0;

    return { month: monthNames[month], value };
  });

  return (
    <>
      {!user?.hasCompletedOnboarding && !isLoading && <OnboardingFlow />}
      <div className="flex bg-primary flex-col gap-5 p-4 sm:p-6">
        <div className=" justify-end flex gap-5">
          <ButtonLikePill icon={<Flower />} text="Plan Upgrade" />
          <ButtonLikePill icon={<Download />} text="Export Report" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5">
          {gettingOrders || !orders ? (
            <SalesCardSkeleton />
          ) : (
            <SalesCard orders={orders} />
          )}
          {gettingOrders ? (
            <TotalOrdersSkeleton />
          ) : (
            <div className="lg:col-span-2 col-span-1">
              <ContainerDashboard>
                <div className="w-full bg-primary p-6 h-full flex rounded-lg flex-col transition-all duration-300 hover:shadow-lg">
                  <div className="flex mb-2 justify-between items-center">
                    <h1 className="headerText text-xl sm:text-2xl">
                      Total Orders
                    </h1>
                    <BadgePercent className="w-6 h-6 text-black transition-all duration-300 hover:scale-110 hover:rotate-12" />
                  </div>
                  <div className="flex items-center gap-1 animate-in slide-in-from-bottom-2 duration-500 delay-200">
                    <p className="headerText-l text-3xl sm:text-4xl transition-all duration-300 hover:scale-105">
                      {orders?.length ?? 0}
                    </p>
                    <ArrowDivNew
                      prevValue={lastMonthOrders ?? 0}
                      newValue={orders?.length ?? 0}
                    />
                  </div>
                  <p className="light_mid mt-1 mb-3 text-sm sm:text-base">
                    {compare()}
                  </p>
                  <div className="animate-in slide-in-from-bottom-2 z-50 duration-500 delay-300">
                    <CardContent className="h-[100px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={formattedData}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#000"
                            strokeWidth={2}
                            dot={<CustomDot />}
                            isAnimationActive={true}
                          />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="none"
                            fill="rgba(0,0,0,0.05)"
                            fillOpacity={1}
                          />
                          <Tooltip
                            formatter={(value: number) =>
                              `₦${value.toLocaleString()}`
                            }
                            labelFormatter={(label: string) =>
                              `Month: ${label}`
                            }
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </div>
                </div>
              </ContainerDashboard>
            </div>
          )}
        </div>
        <div className=" flex md:flex-row w-full gap-10 flex-col">
          <div className=" w-[calc(65%-20px)]">
            <ContainerDashboard className="_h-fit">
              <div className=" grid grid-cols-2 gap-6">
                <DashboardPill
                  amount={35678}
                  title="Total Orders"
                  value={2.3}
                  icon1={<AirVent />}
                />
                <DashboardPill
                  amount={35678}
                  title="Total Revenue"
                  value={-10.3}
                  icon1={<ChartNoAxesCombined />}
                />
                <DashboardPill
                  amount={35678}
                  title="New Visitors"
                  value={2.3}
                  icon1={<UserRoundPlus />}
                />
                <DashboardPill
                  amount={35678}
                  title="Totals Sales"
                  value={2.3}
                  icon1={<Weight />}
                />
              </div>
            </ContainerDashboard>
          </div>
          <div className=" w-[calc(35%-20px)] ">
            <ContainerDashboard className="">
              <div className=" flex justify-between mb-5  items-center">
                <div className=" flex gap-5 items-center">
                  <div className="  bg-[#ffffffcd]  backdrop-blur-3xl size-10 grid place-items-center rounded-full   transition  shadow shadow-primary ">
                    <Sparkles />{" "}
                  </div>

                  <span className=" font-bold text-lg">Sales History</span>
                </div>

                <ViewMoreBtnPillProps />
              </div>
              <div
                className=" grid grid-cols-1 overflow-y-auto  gap-3
              "
              >
                {[1, 2, 3].map((index) => (
                  <ProductPillDahboard
                    key={index}
                    location="Nigeria"
                    name="Shirt"
                    price={1000}
                    productImage=""
                    time={new Date()}
                  />
                ))}
              </div>
            </ContainerDashboard>
          </div>
        </div>
        <TopSellingProducts products={products} />

        {/* Monthly Income Chart Section */}
        <div className="mb-8">
          <MonthlyIncomeChart
            data={[
              { month: "Jan", revenue: 30, expenses: 15, profit: 15 },
              { month: "Feb", revenue: 60, expenses: 25, profit: 35 },
              { month: "Mar", revenue: 40, expenses: 20, profit: 20 },
              { month: "Apr", revenue: 80, expenses: 30, profit: 50 },
              { month: "May", revenue: 55, expenses: 25, profit: 30 }
            ]}
            selectedMetric="profit"
            onMetricChange={(metric) =>
              console.log("Metric changed to:", metric)
            }
            onExport={() => console.log("Exporting data...")}
            onSortChange={(sortBy) => console.log("Sorting by:", sortBy)}
          />
        </div>

        {/* Latest Orders Section */}
        <div className="mb-8">
          <LatestOrders
            orders={orders || []}
            onViewOrder={(order) => console.log("View order:", order)}
            onUpdateStatus={(orderId, newStatus) => {
              updateOrderStatus.mutate({ orderId, status: newStatus });
            }}
            onEditOrder={(order) => console.log("Edit order:", order)}
          />
        </div>
        {/* Heatmap Dashboard Section */}
        <div className="animate-in  rounded-xl p-5 bg-[#e7e3d6] backdrop-blur-3xl shadow shadow-gray-300 slide-in-from-bottom-2 duration-500 delay-900">
          <HeatmapDashboard
            orders={orders || generateSampleOrders()}
            products={data || generateSampleProducts()}
            isLoading={gettingOrders || isLoading}
          />
        </div>
      </div>
      {data?.length === 0 && user?.hasCompletedOnboarding && (
        <ProductModal setShowModal={setShowModal} showModal={showModal} />
      )}
    </>
  );
};

export default Page;
