/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { BadgePercent } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Area,
  Tooltip,
  DotProps
} from "recharts";
import ContainerDashboard from "@/app/(protected)/_components/container-dashboard";
import { ArrowDivNew } from "@/app/(protected)/_components/small-comps";

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

interface TotalOrdersCardProps {
  orders: any[];
  lastMonthOrders: number;
  formattedChartData: { month: string; value: number }[];
}

const compareOrders = (current: number, previous: number) => {
  if (current > previous) {
    return "Your orders have surged 🚀 Keep it up!";
  } else if (current < previous) {
    return "Your orders reduced 📉 Try adding new products or promotions.";
  } else {
    return "Your orders stayed the same ⚖️ Consistency is good!";
  }
};

const TotalOrdersCard: React.FC<TotalOrdersCardProps> = ({
  orders,
  lastMonthOrders,
  formattedChartData
}) => {
  return (
    <div className="lg:col-span-2 col-span-1">
      <ContainerDashboard>
        <div className="w-full bg-primary p-6 h-full flex rounded-lg flex-col transition-all duration-300 hover:shadow-lg">
          <div className="flex mb-2 justify-between items-center">
            <h1 className="headerText text-xl sm:text-2xl">Total Orders</h1>
            <BadgePercent className="w-6 h-6 text-black transition-all duration-300 hover:scale-110 hover:rotate-12" />
          </div>
          <div className="flex items-center gap-1 animate-in slide-in-from-bottom-2 duration-500 delay-200">
            <p className="headerText-l text-3xl sm:text-4xl transition-all duration-300 hover:scale-105">
              {orders?.length ?? 0}
            </p>
            <ArrowDivNew
              prevValue={lastMonthOrders}
              newValue={orders?.length ?? 0}
            />
          </div>
          <p className="light_mid mt-1 mb-3 text-sm sm:text-base">
            {compareOrders(orders?.length ?? 0, lastMonthOrders)}
          </p>
          <div className="animate-in slide-in-from-bottom-2 z-50 duration-500 delay-300">
            <CardContent className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={formattedChartData}>
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
                    formatter={(value: number) => `₦${value.toLocaleString()}`}
                    labelFormatter={(label: string) => `Month: ${label}`}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </div>
        </div>
      </ContainerDashboard>
    </div>
  );
};

export default TotalOrdersCard;
