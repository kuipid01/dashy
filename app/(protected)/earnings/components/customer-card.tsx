import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "6AM", customers: 105 },
  { time: "7AM", customers: 25 },
  { time: "8AM", customers: 78 },
  { time: "9AM", customers: 70 },
  { time: "NOW", customers: 65 },
];

const ActiveCustomersChart: React.FC = () => {
  return (
    <div className="bgblur p-6 rounded-lg shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Active Customer</h3>
        <div className="flex items-center">
          <select className="text-sm text-gray-500 border-black border rounded h-[30px] px-1 cursor-pointer bg-transparent focus:ring-0">
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last Week</option>
          </select>
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
              domain={[50, 100]}
              ticks={[50, 75, 100]}
            />
            <Line
              type="monotone"
              dataKey="customers"
              stroke="#000"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ActiveCustomersChart;
