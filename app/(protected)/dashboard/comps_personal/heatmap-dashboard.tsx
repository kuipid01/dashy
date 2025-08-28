"use client";
import React from "react";
import {} from "@/components/ui/badge";
import {} from "lucide-react";
import Heatmap from "./heatmap";
import HeatmapSkeleton from "./heatmap-skeleton";
import { Order } from "@/constants/types";
import { Product } from "@/app/(handlers)/types/product";

interface HeatmapDashboardProps {
  orders: Order[];
  products: Product[];
  isLoading?: boolean;
}

const HeatmapDashboard: React.FC<HeatmapDashboardProps> = ({
  orders,
  products,
  isLoading = false
}) => {
  return (
    <div className="">
      {/* Header */}

      {/* Heatmaps */}
      <div className="grid grid-cols-1">
        {isLoading ? (
          <>
            <HeatmapSkeleton />
          </>
        ) : (
          <>
            <Heatmap
              orders={orders}
              products={products}
              type="orders"
              title="Orders per Day"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default HeatmapDashboard;
