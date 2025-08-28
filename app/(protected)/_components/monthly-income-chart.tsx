/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart3,
  ChevronDown,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export interface MonthlyIncomeData {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface MonthlyIncomeChartProps {
  data: MonthlyIncomeData[];
  selectedMetric?: "revenue" | "expenses" | "profit";
  onMetricChange?: (metric: "revenue" | "expenses" | "profit") => void;
  onExport?: () => void;
  onSortChange?: (sortBy: string) => void;
}

const COLORS = {
  revenue: "#10B981", // Green
  expenses: "#F59E0B", // Orange
  profit: "#8B5CF6", // Purple
  inactive: "#E5E7EB" // Light gray
};

const SAMPLE_DATA: MonthlyIncomeData[] = [
  { month: "Jan", revenue: 45, expenses: 20, profit: 25 },
  { month: "Feb", revenue: 65, expenses: 30, profit: 35 },
  { month: "Mar", revenue: 48, expenses: 25, profit: 23 },
  { month: "Apr", revenue: 85, expenses: 35, profit: 50 },
  { month: "May", revenue: 52, expenses: 28, profit: 24 },
  { month: "Jun", revenue: 68, expenses: 32, profit: 36 }
];

export default function MonthlyIncomeChart({
  data = SAMPLE_DATA,
  selectedMetric = "profit",
  onMetricChange,
  onExport,
  onSortChange
}: MonthlyIncomeChartProps) {
  const handleMetricChange = (metric: "revenue" | "expenses" | "profit") => {
    onMetricChange?.(metric);
  };

  const handleExport = () => {
    onExport?.();
  };

  const handleSortChange = (sortBy: string) => {
    onSortChange?.(sortBy);
  };

  const getBarColor = (month: string, metric: string) => {
    // Highlight the selected metric for the current month (April in this case)
    if (month === "Apr" && metric === selectedMetric) {
      return COLORS[metric as keyof typeof COLORS];
    }
    // Inactive bars for other months/metrics
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
              {entry.name}: ${entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
              <DropdownMenuItem onClick={() => handleSortChange("expenses")}>
                <TrendingDown size={14} className="mr-2" />
                Expenses
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("profit")}>
                <DollarSign size={14} className="mr-2" />
                Profit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Export Button */}
          <Button
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
            style={{ backgroundColor: COLORS.expenses }}
          />
          <span className="text-sm font-medium text-gray-700">Expenses</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: COLORS.profit }}
          />
          <span className="text-sm font-medium text-gray-700">Profit</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
              domain={[0, 80]}
              ticks={[0, 20, 40, 60, 80]}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Revenue Bars */}
            <Bar
              dataKey="revenue"
              radius={[50, 50, 50, 50]}
              onClick={() => handleMetricChange("revenue")}
              cursor="pointer"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`revenue-${index}`}
                  fill={getBarColor(entry.month, "revenue")}
                />
              ))}
            </Bar>

            {/* Expenses Bars */}
            <Bar
              dataKey="expenses"
              radius={[50, 50, 50, 50]}
              onClick={() => handleMetricChange("expenses")}
              cursor="pointer"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`expenses-${index}`}
                  fill={getBarColor(entry.month, "expenses")}
                />
              ))}
            </Bar>

            {/* Profit Bars */}
            <Bar
              dataKey="profit"
              radius={[50, 50, 50, 50]}
              onClick={() => handleMetricChange("profit")}
              cursor="pointer"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`profit-${index}`}
                  fill={getBarColor(entry.month, "profit")}
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
