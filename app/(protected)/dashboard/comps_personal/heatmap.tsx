/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useMemo, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/constants/types";
import { Product } from "@/app/(handlers)/types/product";
import {
  format,
  startOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  startOfWeek,
  endOfWeek
} from "date-fns";

interface HeatmapProps {
  orders: Order[];
  products: Product[];
  title?: string;
  type: "orders" | "products";
}

interface HeatmapData {
  date: string;
  value: number;
  day: string;
  fullDate: string;
  isCurrentMonth: boolean;
  isToday: boolean;
}

const Heatmap: React.FC<HeatmapProps> = ({ orders, products, title, type }) => {
  const [activeDay, setActiveDay] = useState<null | HeatmapData>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const numMonths = 12;
  const today = new Date();
  const currentMonth = startOfMonth(today);
  const startDate = startOfWeek(addMonths(currentMonth, -numMonths + 1));
  const endDate = endOfWeek(today);

  const heatmapData = useMemo(() => {
    const daysInPeriod = eachDayOfInterval({ start: startDate, end: endDate });
    const dataMap = new Map<string, number>();

    if (type === "orders") {
      orders.forEach((order) => {
        if (!order.placed_at) return;
        const dateKey = format(new Date(order.placed_at), "yyyy-MM-dd");
        dataMap.set(dateKey, (dataMap.get(dateKey) || 0) + 1);
      });
    } else {
      products.forEach((product) => {
        if (!product.createdAt) return;
        const dateKey = format(new Date(product.createdAt), "yyyy-MM-dd");
        dataMap.set(dateKey, (dataMap.get(dateKey) || 0) + 1);
      });
    }

    return daysInPeriod.map((day) => {
      const dateKey = format(day, "yyyy-MM-dd");
      return {
        date: dateKey,
        value: dataMap.get(dateKey) || 0,
        day: format(day, "d"),
        fullDate: format(day, "dd MMM, yyyy"),
        isCurrentMonth: isSameMonth(day, today),
        isToday: isToday(day)
      };
    });
  }, [orders, products, type, startDate, endDate, today]);

  const getColorIntensity = (value: number) => {
    if (value === 0) return "bg-gray-100 dark:bg-gray-800";
    if (value <= 2) return "bg-green-200 dark:bg-green-700";
    if (value <= 5) return "bg-green-400 dark:bg-green-600";
    if (value <= 10) return "bg-green-600 dark:bg-green-500";
    return "bg-green-800 dark:bg-green-400";
  };

  // Group data into weeks (columns)
  const weeks: HeatmapData[][] = [];
  let currentWeek: HeatmapData[] = [];

  heatmapData.forEach((day, idx) => {
    currentWeek.push(day);
    if ((idx + 1) % 7 === 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  if (currentWeek.length) weeks.push(currentWeek);

  return (
    <Card className="w-full max-w-[90vw]  mx-auto shadow-lg dark:shadow-none border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {title || "Activity Heatmap"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center justify-center sm:justify-start text-xs text-gray-600 dark:text-gray-300 font-medium">
            <span>Less</span>
            <div className="flex items-center gap-1.5 mx-3">
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-100 dark:bg-gray-800 rounded-sm shadow-sm"></div>
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-200 dark:bg-green-700 rounded-sm shadow-sm"></div>
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-400 dark:bg-green-600 rounded-sm shadow-sm"></div>
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-600 dark:bg-green-500 rounded-sm shadow-sm"></div>
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-800 dark:bg-green-400 rounded-sm shadow-sm"></div>
            </div>
            <span>More</span>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto overflow-y-hidden w-full">
            {/* Month Labels */}
            <div className="flex w-fit gap-1.5 sm:gap-2 min-w-full">
              {weeks.map((week, weekIdx) => {
                const firstDay = week[0];
                const currentMonth = format(new Date(firstDay.date), "MMM");
                const showLabel =
                  weekIdx === 0 ||
                  format(new Date(weeks[weekIdx - 1][0].date), "MMM") !==
                    currentMonth;

                return (
                  <div key={weekIdx} className="w-4 flex justify-center">
                    {showLabel && (
                      <span className="text-xs text-gray-500">
                        {currentMonth}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Heatmap Squares */}
            <div className="flex w-fit gap-2">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-1">
                  {week.map((day, dayIdx) => {
                    const ref = useRef<HTMLDivElement>(null);

                    const handleEnter = () => {
                      if (ref.current) {
                        const rect = ref.current.getBoundingClientRect();
                        setCoords({
                          x: rect.left + rect.width / 2,
                          y: rect.top
                        });
                        setActiveDay(day);
                      }
                    };

                    return (
                      <div
                        ref={ref}
                        key={dayIdx}
                        onMouseEnter={handleEnter}
                        onMouseLeave={() => setActiveDay(null)}
                        className={`w-4 h-4 rounded-sm cursor-pointer ${getColorIntensity(
                          day.value
                        )} ${day.isToday ? "ring-2 ring-blue-400" : ""}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>

      {/* Tooltip via Portal */}
      {activeDay &&
        coords &&
        createPortal(
          <div
            className="fixed z-50 px-2 py-1 sm:px-3 sm:py-2 rounded-md bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 text-xs sm:text-sm"
            style={{
              left: coords.x,
              top: coords.y - 12,
              transform: "translate(-50%, -100%)"
            }}
          >
            <span className="font-semibold text-gray-800 dark:text-gray-100 text-nowrap">
              {activeDay.value} {type}
            </span>
            <p className="text-gray-600 dark:text-gray-300 text-nowrap">
              {activeDay.fullDate}
            </p>
          </div>,
          document.body
        )}
    </Card>
  );
};

export default Heatmap;
