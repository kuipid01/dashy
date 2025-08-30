/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  useFetchUser,
  useFetchUserStore
} from "@/app/(handlers)/auth-handlers/auth";
import { useFetchStoreOrders } from "@/app/(handlers)/orders/orders";
import { useFetchUserProducts } from "@/app/(handlers)/product/product";
import { endOfMonth, startOfMonth } from "date-fns";
import React from "react";

export const useDashboardData = () => {
  const { user, isLoading: fetchingUser } = useFetchUser();
  const { store, isLoading: fetchingStore } = useFetchUserStore();
  const { data: orders, isLoading: gettingOrders } = useFetchStoreOrders(
    store?.id
  );
  const { data: products, isLoading: gettingProducts } = useFetchUserProducts();

  const isLoading =
    gettingOrders || gettingProducts || fetchingUser || fetchingStore;

  // Memoize the data processing to prevent re-computation on every render
  const dashboardData = React.useMemo(() => {
    if (!orders) {
      return {
        orders: [],
        products: [],
        lastMonthOrders: 0,
        thisMonthRevenue: 0,
        lastMonthRevenue: 0,
        formattedChartData: [],
        totalRevenue: 0,
        lastMonthSales: [],
        thisMonthSales: [],
        allOrderItems: []
      };
    }

    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setMonth(today.getMonth() - 1);
    const startOfThisMonth = startOfMonth(today);
    const endOfThisMonth = endOfMonth(today);

    // Calculate last month's data
    const lastMonthOrders =
      orders.filter(
        (order) =>
          new Date(order.placed_at) >= monthAgo &&
          new Date(order.placed_at) <= today
      ).length ?? 0;

    const lastMonthRevenue =
      orders
        .filter(
          (order) =>
            new Date(order.placed_at) >= monthAgo &&
            new Date(order.placed_at) <= today
        )
        .reduce((acc, order) => acc + order.net_total, 0) ?? 0;

    const lastMonthSales =
      orders
        .filter(
          (order) =>
            new Date(order.placed_at) >= monthAgo &&
            new Date(order.placed_at) <= today
        )
        .flatMap((order) => order.orderItems) ?? [];

    // Calculate this month's data
    const thisMonthRevenue =
      orders
        .filter(
          (order) =>
            new Date(order.placed_at) >= startOfThisMonth &&
            new Date(order.placed_at) <= endOfThisMonth
        )
        .reduce((acc, order) => acc + order.net_total, 0) ?? 0;

    const thisMonthSales =
      orders
        .filter(
          (order) =>
            new Date(order.placed_at) >= startOfThisMonth &&
            new Date(order.placed_at) <= endOfThisMonth
        )
        .flatMap((order) => order.orderItems) ?? [];

    const allOrderItems = orders.flatMap((order) => order.orderItems) ?? [];
    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.net_total,
      0
    );

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

    const formattedChartData = Array.from({ length: 12 }, (_, i) => {
      const value =
        orders
          .filter((order) => new Date(order.placed_at).getMonth() === i)
          .reduce((sum, order) => sum + (order.total || 0), 0) ?? 0;
      return { month: monthNames[i], value };
    });

    return {
      orders,
      products,
      lastMonthOrders,
      thisMonthRevenue,
      lastMonthRevenue,
      formattedChartData,
      totalRevenue,
      lastMonthSales,
      thisMonthSales,
      allOrderItems
    };
  }, [orders, products]);

  return {
    dashboardData,
    isLoading
  };
};
