"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Skeleton from "@/app/(general)/_compoenents/skeleton";

const HeatmapSkeleton: React.FC = () => {
  return (
    <Card className="w-full overflow-hidden">
      <CardContent>
        <div className="space-y-4">
          {/* Legend skeleton */}
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <span>Less</span>
            <div className="flex items-center gap-1 ml-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="w-4 h-4 rounded-sm" />
              ))}
            </div>
            <span className="ml-2">More</span>
          </div>

          {/* Month labels skeleton */}
          <div className="flex w-fit gap-2 _ml-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="w-6 h-3 rounded" />
            ))}
          </div>

          {/* Heatmap grid skeleton (weeks as columns, days as rows) */}
          <div className="flex w-fit gap-2">
            {Array.from({ length: 60 }).map((_, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {Array.from({ length: 7 }).map((_, dayIdx) => (
                  <Skeleton
                    key={`${weekIdx}-${dayIdx}`}
                    className="w-4 h-4 rounded-sm"
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeatmapSkeleton;
