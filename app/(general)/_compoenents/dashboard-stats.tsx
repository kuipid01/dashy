/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { DashboardPill } from "@/app/(general)/_compoenents/pill-round";
import {
  AirVent,
  ChartNoAxesCombined,
  UserRoundPlus,
  Weight
} from "lucide-react";
import ContainerDashboard from "@/app/(protected)/_components/container-dashboard";

interface DashboardStatsProps {
  totalOrders: number;
  lastMonthOrders: number;
  totalRevenue: number;
  lastMonthRevenue: number;
  thisMonthRevenue: number;
  allOrderItems: any[];
  lastMonthSales: any[];
  thisMonthSales: any[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalOrders,
  lastMonthOrders,
  totalRevenue,
  lastMonthRevenue,
  thisMonthRevenue,
  allOrderItems,
  lastMonthSales,
  thisMonthSales
}) => {
  return (
    <div className="w-full lg:w-[calc(65%-20px)]">
      <ContainerDashboard className="h-fit">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DashboardPill
            amount={totalOrders}
            prevValue={lastMonthOrders}
            newValue={totalOrders}
            title="Total Orders"
            icon1={<AirVent />}
          />
          <DashboardPill
            amount={totalRevenue}
            title="Net Income"
            icon1={<ChartNoAxesCombined />}
            prevValue={lastMonthRevenue}
            newValue={thisMonthRevenue}
          />
          <DashboardPill
            amount={35678} // This is a hardcoded value in the original, consider making it a prop
            title="New Visitors"
            icon1={<UserRoundPlus />}
            prevValue={lastMonthOrders}
            newValue={totalOrders}
          />
          <DashboardPill
            amount={allOrderItems.length}
            title="Totals Sales"
            icon1={<Weight />}
            prevValue={lastMonthSales.length}
            newValue={thisMonthSales.length}
          />
        </div>
      </ContainerDashboard>
    </div>
  );
};

export default DashboardStats;
