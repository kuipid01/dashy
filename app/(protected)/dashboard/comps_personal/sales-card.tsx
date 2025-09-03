/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import ContainerDashboard from "../../_components/container-dashboard";
import { Order } from "@/constants/types";
import { Pill } from "../../_components/small-comps";

type SalesCardProps = {
  orders: Order[];
};

// --- Helpers ---
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// --- Component ---
export default function SalesCard({ orders }: SalesCardProps) {
  const today = new Date();
  const [range, setRange] = useState<"7d" | "1m" | "3m" | "6m" | "9m">("7d");

  // calculate total sales between 2 dates
  const calculateSales = (start: Date, end: Date) => {
    return (
      orders
        ?.filter((order) => {
          const placedAt = new Date(order.placed_at);
          return placedAt >= start && placedAt <= end;
        })
        .reduce((acc, order) => acc + (order.total || 0), 0) ?? 0
    );
  };

  const { sales, prevSales } = useMemo(() => {
    let startDate: Date;
    let prevStart: Date;
    let prevEnd: Date;

    switch (range) {
      case "7d":
        startDate = addDays(today, -7);
        prevStart = addDays(today, -14);
        prevEnd = addDays(today, -7);
        break;
      case "1m":
        startDate = addMonths(today, -1);
        prevStart = addMonths(today, -2);
        prevEnd = addMonths(today, -1);
        break;
      case "3m":
        startDate = addMonths(today, -3);
        prevStart = addMonths(today, -6);
        prevEnd = addMonths(today, -3);
        break;
      case "6m":
        startDate = addMonths(today, -6);
        prevStart = addMonths(today, -12);
        prevEnd = addMonths(today, -6);
        break;
      case "9m":
        startDate = addMonths(today, -9);
        prevStart = addMonths(today, -18);
        prevEnd = addMonths(today, -9);
        break;
      default:
        startDate = today;
        prevStart = today;
        prevEnd = today;
    }

    const sales = calculateSales(startDate, today);
    const prevSales = calculateSales(prevStart, prevEnd);

    return { sales, prevSales };
  }, [range, today]);

  const onlineSales = orders
    .filter((order) => order.sales_means === "ONLINE")
    .reduce((acc, order) => acc + (order.total || 0), 0);
  const storeSales = orders
    .filter((order) => order.sales_means === "STORE")
    .reduce((acc, order) => acc + (order.total || 0), 0);

  const compare = () => {
    if (sales > prevSales) {
      return "Your sales surged 🚀 Keep it up!";
    } else if (sales < prevSales) {
      return "Your sales reduced 📉 Try adding new products or promotions.";
    } else {
      return "Your sales stayed the same ⚖️ Consistency is good!";
    }
  };

  return (
    <div className="lg:col-span-3 col-span-1">
      <ContainerDashboard>
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 rounded-lg transition-all duration-300 hover:shadow-xl bg-primary text-gray-800">
          {/* Header */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-700">
                Total Sales
              </h1>
              <Select
                value={range}
                onValueChange={(val: typeof range) => setRange(val)}
              >
                <SelectTrigger className="w-full sm:w-[150px] border-gray-300 text-sm font-medium transition-all duration-200 hover:scale-105 hover:border-blue-500 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Select Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="1m">Last 1 Month</SelectItem>
                  <SelectItem value="3m">Last 3 Months</SelectItem>
                  <SelectItem value="6m">Last 6 Months</SelectItem>
                  <SelectItem value="9m">Last 9 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sales Display */}
            <div className="flex flex-col mt-3 sm:mt-4 gap-1 sm:gap-2">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold">
                ₦{sales.toLocaleString()}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-500">
                {compare()}
              </p>
            </div>
          </div>

          {/* Pills */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5 mt-5">
            <div className="animate-in slide-in-from-left-2 duration-500 delay-600">
              <Pill
                upperText="Online"
                valueDirection={onlineSales ?? 0}
                value={onlineSales ?? 0}
              />
            </div>
            <div className="animate-in slide-in-from-left-2 duration-500 delay-700">
              <Pill
                upperText="In Store"
                valueDirection={storeSales ?? 0}
                value={storeSales ?? 0}
              />
            </div>
            <div className="animate-in slide-in-from-left-2 duration-500 delay-800">
              <Pill
                upperText="Total"
                valueDirection={onlineSales + storeSales || 0}
                value={onlineSales + storeSales || 0}
              />
            </div>
          </div>
        </div>
      </ContainerDashboard>
    </div>
  );
}
