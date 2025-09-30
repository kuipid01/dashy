/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useMemo, useCallback } from "react";
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
  Tooltip,
  LineChart,
  Line,
  DotProps,
  Area,
  ResponsiveContainer
} from "recharts";
import ContainerDashboard from "../_components/container-dashboard";
import { ArrowDivNew } from "../_components/small-comps";

import { addDays, endOfMonth, format, startOfMonth, subMonths } from "date-fns";

import { ProductModal } from "../_components/modals/product-modal";
import { useFetchUserProducts } from "@/app/(handlers)/product/product";
import { OnboardingFlow } from "./comps_personal/onboarding-flow";
import {
  useFetchUser,
  useFetchUserStore
} from "@/app/(handlers)/auth-handlers/auth";
import {
  useFetchStoreOrders,
  useUpdateOrder,
  useUpdateOrderStatus
} from "@/app/(handlers)/orders/orders";
import SalesCard from "./comps_personal/sales-card";
import { CardContent } from "@/components/ui/card";
import SalesCardSkeleton from "./comps_personal/sales-card-skeleton";
import TotalOrdersSkeleton from "./comps_personal/order-card-skeleton";
import HeatmapDashboard from "./comps_personal/heatmap-dashboard";
// import {
//   generateSampleOrders,
//   generateSampleProducts
// } from "./comps_personal/heatmap-utils";
import {
  ButtonLikePill,
  DashboardPill,
  DashboardPillSkeleton,
  ProductPillDahboard,
  ProductPillDahboardSkeleton,
  ViewMoreBtnPillProps
} from "@/app/(general)/_compoenents/pill-round";
import TopSellingProducts, {
  TopSellingProduct
} from "../_components/top-selling-products";
import LatestOrders from "../_components/latest-orders";
import MonthlyIncomeChart from "../_components/monthly-income-chart";
import { Order, Product } from "@/constants/types";
import Dashboardloader from "./comps_personal/dashboard-loader";
import { imageToRenderImage } from "@/app/utils/get-image";

interface CustomDotProps extends DotProps {
  index?: number;
}

// Constants
const MONTH_NAMES = [
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

// Custom Components
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

// Utility Functions
const isDateInRange = (date: Date, start: Date, end: Date): boolean => {
  return date >= start && date <= end;
};

const getLastMonthRange = () => {
  const today = new Date();
  const lastMonth = subMonths(today, 1);
  const start = startOfMonth(lastMonth);
  const end = endOfMonth(lastMonth);
  return { start, end };
};

const getCurrentMonthRange = () => {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now)
  };
};

const filterOrdersByDateRange = (orders: Order[], start: Date, end: Date) => {
  return orders.filter((order) => {
    const placedAt = new Date(order.placed_at);
    return isDateInRange(placedAt, start, end);
  });
};

// Custom Hooks
const useOrderAnalytics = (orders: Order[] | undefined) => {
  return useMemo(() => {
    if (!orders?.length) {
      return {
        lastMonthOrders: 0,
        lastMonthRevenue: 0,
        thisMonthRevenue: 0,
        thisMonthOrders: 0,
        thisMonthSales: [],
        lastMonthSales: [],
        allOrderItems: [],
        totalRevenue: 0,
        formattedData: [],
        comparisonText: "No orders yet",
        latestSales: []
      };
    }

    const lastMonth = getLastMonthRange();
    const thisMonth = getCurrentMonthRange();

    const lastMonthOrdersData = filterOrdersByDateRange(
      orders,
      lastMonth.start,
      lastMonth.end
    );
    const thisMonthOrdersData = filterOrdersByDateRange(
      orders,
      thisMonth.start,
      thisMonth.end
    );
    const latestOrders = [...orders]
      .sort(
        (a, b) =>
          new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime()
      )
      .flatMap((order) => order.orderItems)
      .slice(0, 3);
    // console.log(latestOrders, "lasted sales");
    const lastMonthOrders = lastMonthOrdersData.length;
    const lastMonthRevenue = lastMonthOrdersData.reduce(
      (acc, order) => acc + order.net_total,
      0
    );
    const thisMonthRevenue = thisMonthOrdersData.reduce(
      (acc, order) => acc + order.net_total,
      0
    );
    const thisMonthOrders = thisMonthOrdersData.length;
    const allOrderItems = orders.flatMap((order) => order?.orderItems ?? []);
    const thisMonthSales = thisMonthOrdersData.flatMap(
      (order) => order?.orderItems ?? []
    );
    const lastMonthSales = lastMonthOrdersData.flatMap(
      (order) => order?.orderItems ?? []
    );

    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.net_total,
      0
    );

    const formattedData = Array.from({ length: 12 }, (_, i) => {
      const value = orders
        .filter((order) => new Date(order.placed_at).getMonth() === i)
        .reduce((sum, order) => sum + (order.total || 0), 0);

      return { month: MONTH_NAMES[i], value };
    });

    const getComparisonText = () => {
      const currentOrderCount = orders.length;
      if (currentOrderCount > lastMonthOrders) {
        return "Your orders have surged 🚀 Keep it up!";
      } else if (currentOrderCount < lastMonthOrders) {
        return "Your orders reduced 📉 Try adding new products or promotions.";
      } else {
        return "Your orders stayed the same ⚖️ Consistency is good!";
      }
    };

    return {
      lastMonthOrders,
      lastMonthRevenue,
      thisMonthRevenue,
      thisMonthSales,
      lastMonthSales,
      allOrderItems,
      totalRevenue,
      formattedData,
      thisMonthOrders,
      comparisonText: getComparisonText(),
      latestOrders
    };
  }, [orders]);
};

// Main Component
const Page = () => {
  // State
  const [showModal, setShowModal] = useState(true);

  // Data fetching hooks
  const { user, isLoading: userLoading } = useFetchUser();
  const { store, isLoading: storeLoading } = useFetchUserStore();
  const { data: products } = useFetchUserProducts();
  const { data: orders, isLoading: ordersLoading } = useFetchStoreOrders(
    store?.store?.id ?? undefined
  );
  const updateOrder = useUpdateOrder();

  // Analytics
  const analytics = useOrderAnalytics(orders);
  // console.log(analytics);
  // Callbacks
  const handleMetricChange = useCallback((metric: string) => {
    console.log("Metric changed to:", metric);
  }, []);

  const handleExport = useCallback(() => {
    console.log("Exporting data...");
  }, []);

  const handleSortChange = useCallback((sortBy: string) => {
    console.log("Sorting by:", sortBy);
  }, []);

  const handleViewOrder = useCallback((order: any) => {
    console.log("View order:", order);
  }, []);

  const handleUpdateStatus = useCallback(
    (orderId: number, newStatus: string) => {
      updateOrder.mutateAsync({
        id: orderId,
        data: {
          status: newStatus as
            | "pending"
            | "processing"
            | "shipped"
            | "delivered"
            | "cancelled"
            | undefined
        }
      });
    },
    [updateOrder]
  );

  const handleEditOrder = useCallback((order: any) => {
    console.log("Edit order:", order);
  }, []);
  // Flatten order items
  const allOrderItems =
    orders?.flatMap((order) => order?.orderItems ?? []) ?? [];

  // Use a map to count total quantity sold per product
  const salesMap = new Map<
    number,
    { productId: number; quantity: number; product: Product }
  >();

  allOrderItems.forEach((item) => {
    const id = item.Product.ID;
    const existing = salesMap.get(id);

    if (existing) {
      existing.quantity += item.Quantity ?? 0;
    } else {
      salesMap.set(id, {
        productId: id,
        quantity: item.quantity ?? 0,
        product: item.Product
      });
    }
  });

  // Convert to array and sort by quantity sold
  const bestSellers = Array.from(salesMap.values()).sort(
    (a, b) => b.quantity - a.quantity
  );
  console.log("FORMATTED DATE ", analytics.formattedData);
  // Loading states
  const isLoading = userLoading || storeLoading || ordersLoading;

  // Early returns
  if (!user?.hasCompletedOnboarding && !userLoading) {
    return <OnboardingFlow />;
  }

  if (isLoading) {
    return <Dashboardloader />;
  }
  return (
    <>
      <div className="flex bg-primary flex-col gap-5 p-4 sm:p-6">
        {/* Header Actions */}
        <div className="justify-end flex gap-5">
          <ButtonLikePill icon={<Flower />} text="Plan Upgrade" />
          <ButtonLikePill
            disabled={true}
            icon={<Download />}
            text="Export Report"
          />
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5">
          {ordersLoading || !orders ? (
            <SalesCardSkeleton />
          ) : (
            <SalesCard orders={orders} />
          )}

          {ordersLoading ? (
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
                      prevValue={analytics.lastMonthOrders}
                      newValue={analytics.thisMonthOrders ?? 0}
                    />
                  </div>

                  <p className="light_mid mt-1 mb-3 text-sm sm:text-base">
                    {analytics.comparisonText}
                  </p>

                  <div className="animate-in slide-in-from-bottom-2 z-50 duration-500 delay-300">
                    <CardContent className="h-[100px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.formattedData}>
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
                              `₦${value.toFixed(2).toLocaleString()}`
                            }
                            labelFormatter={(label: string) =>
                              `Month: ${
                                analytics.formattedData[Number(label)].month
                              }`
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

        {/* Dashboard Pills and Sales History */}
        <div className="flex lg:flex-row w-full gap-10 flex-col">
          <div className="w-full lg:w-[calc(65%-20px)]">
            <ContainerDashboard className="h-fit">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  // Render skeletons while data is loading
                  <>
                    <DashboardPillSkeleton />
                    <DashboardPillSkeleton />
                    <DashboardPillSkeleton />
                    <DashboardPillSkeleton />
                  </>
                ) : (
                  <>
                    <DashboardPill
                      amount={orders?.length ?? 0}
                      prevValue={analytics.lastMonthOrders}
                      newValue={orders?.length ?? 0}
                      title="Total Orders"
                      icon1={<AirVent />}
                    />
                    <DashboardPill
                      amount={analytics.totalRevenue}
                      title="Net Income"
                      icon1={<ChartNoAxesCombined />}
                      prevValue={analytics.lastMonthRevenue}
                      newValue={analytics.thisMonthRevenue}
                    />

                    <DashboardPill
                      amount={analytics.allOrderItems.length}
                      title="Total Sales"
                      icon1={<Weight />}
                      prevValue={analytics.lastMonthSales.length}
                      newValue={analytics.thisMonthSales.length}
                    />
                  </>
                )}
              </div>
            </ContainerDashboard>
          </div>

          <div className="w-full lg:w-[calc(35%-20px)]">
            <ContainerDashboard className="h-fit">
              <div className="flex justify-between mb-5 items-center">
                <div className="flex gap-5 items-center">
                  <div className="bg-[#ffffffcd] backdrop-blur-3xl size-10 grid place-items-center rounded-full transition shadow shadow-primary">
                    <Sparkles />
                  </div>
                  <span className="font-bold text-lg">Sales History</span>
                </div>
                <ViewMoreBtnPillProps />
              </div>

              <div className="grid grid-cols-1 overflow-y-auto gap-3">
                {isLoading ? (
                  <>
                    <ProductPillDahboardSkeleton />
                    <ProductPillDahboardSkeleton />
                    <ProductPillDahboardSkeleton />
                  </>
                ) : (
                  analytics?.latestOrders?.map((product, i) => (
                    <ProductPillDahboard
                      key={i}
                      location="Nigeria"
                      name={product.Product.Name}
                      price={product.TotalPrice}
                      productImage={
                        imageToRenderImage(product.Product.Image) ?? ""
                      }
                      time={product.CreatedAt}
                    />
                  ))
                )}
              </div>
            </ContainerDashboard>
          </div>
        </div>

        {/* Top Selling Products */}
        <TopSellingProducts
          isLoading={isLoading}
          products={bestSellers.slice(0, 10)}
        />

        {/* Monthly Income Chart */}
        <div className="mb-8">
          <MonthlyIncomeChart
            orders={orders ?? []}
            selectedMetric="income"
            onMetricChange={handleMetricChange}
            onExport={handleExport}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Latest Orders */}
        <div className="mb-8">
          <LatestOrders
            orders={orders?.slice(0, 10) || []}
            onViewOrder={handleViewOrder}
            onUpdateStatus={handleUpdateStatus}
            isLoading={isLoading}
          />
        </div>

        {/* Heatmap Dashboard */}
        {orders && products && (
          <div className="animate-in rounded-xl p-5 bg-[#e7e3d6] backdrop-blur-3xl shadow shadow-gray-300 slide-in-from-bottom-2 duration-500 delay-900">
            <HeatmapDashboard
              orders={orders}
              products={products}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>

      {/* Product Modal */}
      {/* {products?.length === 0 && user?.hasCompletedOnboarding && (
        <ProductModal setShowModal={setShowModal} showModal={showModal} />
      )} */}
    </>
  );
};

export default Page;
