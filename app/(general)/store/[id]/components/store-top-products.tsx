"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { useFetchStoreProducts } from "@/app/(handlers)/general/general";
import { useParams } from "next/navigation";
import ProductCard from "@/app/(protected)/_components/product-card";
import ProductLoadingSkeleton from "@/app/(general)/_compoenents/product-loading-skeleton";

export default function StoreTopProducts({ storeId }: { storeId: string }) {
  const params = useParams();
  const { data, isLoading } = useFetchStoreProducts(storeId);

  const topProducts = useMemo(() => {
    if (!data) return [] as any[];
    return [...data]
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
      .slice(0, 4);
  }, [data]);

  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <ProductLoadingSkeleton key={i} />
            ))
          : topProducts.map((p: any) => (
              <ProductCard
                key={p.id}
                product={p}
                isAdmin={false}
                storeName={params.id as string}
              />
            ))}
      </div>
    </section>
  );
}
