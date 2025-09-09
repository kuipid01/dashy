/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Label,
  Tooltip
} from "recharts";

// const data = [
//   { month: "Jan", earnings: 0 },
//   { month: "Feb", earnings: 0 },
//   { month: "Mar", earnings: 44747 },
//   { month: "Apr", earnings: 73901 },
//   { month: "May", earnings: 0 },
//   { month: "Jun", earnings: 0 },
//   { month: "Jul", earnings: 12233 },
// ];

const getAverageEarnings = (data: { earnings: number }[]) => {
  const lastSix = data.slice(-6);
  const total = lastSix.reduce((sum, item) => sum + item.earnings, 0);
  return lastSix.length ? total / lastSix.length : 0;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    if (value > 0) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-200">
          <p className="text-sm font-semibold">₦{value.toLocaleString()}</p>
        </div>
      );
    }
  }
  return null;
};

interface EarningsChartProps {
  chartData: { month: string; earnings: number }[];
}

const EarningsChart: React.FC<EarningsChartProps> = ({ chartData }) => {
  const averageEarnings = getAverageEarnings(chartData);

  return (
    <div className=" p-6 bgblur rounded-lg ">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Earnings</h3>
        {/* <div className="text-sm flex items-center px-2 py-1 rounded-md cursor-pointer gap-3 text-gray-500 border border-gray-200">
          <span>2023 Nov</span>
          <span>-</span>
          <span>2023 Jan</span>
        </div> */}
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
              tickFormatter={(value) => `#${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={averageEarnings}
              stroke="#666"
              strokeDasharray="3 3"
            >
              <Label value="AVG" position="left" fill="#666" fontSize={12} />
            </ReferenceLine>
            <Bar dataKey="earnings" fill="#1a1a1a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningsChart;
