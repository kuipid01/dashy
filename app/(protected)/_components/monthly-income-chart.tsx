/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart3,
  ChevronDown,
  Download,
  TrendingUp,
  DollarSign
} from "lucide-react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Cell
// } from "recharts";

// Instead of direct Recharts imports:
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Order } from "@/constants/types";
import { format } from "date-fns";

/**
 * Aggregates order data into a monthly income format for the chart.
 * @param {Array<Order>} orders - The array of order objects.
 * @returns {Array<MonthlyIncomeData>}
 */
export const processOrdersToMonthlyData = (orders: Order[]) => {
  console.log(orders);
  const monthlyDataMap = new Map();

  orders.forEach((order) => {
    // Safely get the date from the order.
    const orderDate =
      order.placedAt || order.placed_at || new Date().toISOString();
    const month = format(new Date(orderDate), "MMM");

    // Calculate values for the current order
    const revenue = order.total || 0;
    const netTotal = order.commision || 0;
    // For simplicity, profit is assumed to be equal to revenue since there are no expenses
    const income = revenue - netTotal;

    if (monthlyDataMap.has(month)) {
      const existingData = monthlyDataMap.get(month);
      existingData.revenue += revenue;
      existingData.income += income;
    } else {
      monthlyDataMap.set(month, {
        month,
        revenue,
        income
      });
    }
  });

  // Convert the map values back to an array
  const monthlyData = Array.from(monthlyDataMap.values()).sort((a, b) => {
    const monthsOrder = [
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
    return monthsOrder.indexOf(a.month) - monthsOrder.indexOf(b.month);
  });

  return monthlyData;
};

export interface MonthlyIncomeData {
  month: string;
  revenue: number;
  income: number;
}

const COLORS = {
  revenue: "#10B981", // Green
  income: "#8B5CF6", // Purple
  inactive: "#E5E7EB" // Light gray
};

export interface MonthlyIncomeChartProps {
  orders: Order[];
  selectedMetric?: "revenue" | "income"; // Removed 'expenses'
  onMetricChange?: (metric: "revenue" | "income") => void;
  onExport?: () => void;
  onSortChange?: (sortBy: string) => void;
}

const getBarColor = (month: string, metric: string, selectedMetric: string) => {
  if (month === format(new Date(), "MMM") && metric === selectedMetric) {
    return COLORS[metric as keyof typeof COLORS];
  }
  return COLORS.inactive;
};

const formatYAxis = (value: number) => {
  return value.toString();
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: ₦{entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function MonthlyIncomeChart({
  orders,
  selectedMetric = "income",
  onMetricChange,
  onExport,
  onSortChange
}: MonthlyIncomeChartProps) {
  const chartData = processOrdersToMonthlyData(orders);

  const handleMetricChange = (metric: "revenue" | "income") => {
    onMetricChange?.(metric);
  };

  const handleExport = () => {
    onExport?.();
  };

  const handleSortChange = (sortBy: string) => {
    onSortChange?.(sortBy);
  };

  return (
    <div className="bgblur p-6 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full bg-[#ffffffcd] hover:bg-[#e6e3df] backdrop-blur-3xl grid place-items-center text-gray-600">
            <BarChart3 size={20} className="text-black" />
          </div>
          <h2 className="text-xl font-bold text-black">Monthly Income</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort By Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Sort By
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSortChange("revenue")}>
                <TrendingUp size={14} className="mr-2" />
                Revenue
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("profit")}>
                <DollarSign size={14} className="mr-2" />
                Profit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Button */}
          <Button
            customDisabled={true}
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: COLORS.revenue }}
          />
          <span className="text-sm font-medium text-gray-700">Revenue</span>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: COLORS.income }}
          />
          <span className="text-sm font-medium text-gray-700">Income</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
              tickFormatter={formatYAxis}
              domain={[0, "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Revenue Bars */}
            <Bar
              dataKey="revenue"
              radius={[50, 50, 50, 50]}
              onClick={() => handleMetricChange("revenue")}
              cursor="pointer"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`revenue-${index}`}
                  fill={getBarColor(entry.month, "revenue", selectedMetric)}
                />
              ))}
            </Bar>

            {/* Profit Bars */}
            <Bar
              dataKey="income"
              radius={[50, 50, 50, 50]}
              onClick={() => handleMetricChange("income")}
              cursor="pointer"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`income-${index}`}
                  fill={getBarColor(entry.month, "income", selectedMetric)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Selected Metric Indicator */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
          <div
            className="size-2 rounded-full"
            style={{ backgroundColor: COLORS[selectedMetric] }}
          />
          <span className="text-sm font-medium text-gray-700 capitalize">
            {selectedMetric} selected
          </span>
        </div>
      </div>
    </div>
  );
}
