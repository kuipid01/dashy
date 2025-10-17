"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { useFetchStoreProducts } from "@/app/(handlers)/general/general";
import ProductCard from "@/app/(protected)/_components/product-card";
import ProductLoadingSkeleton from "@/app/(general)/_compoenents/product-loading-skeleton";
import { useParams } from "next/navigation";

export default function StoreProductsByCategory({
  storeId
}: {
  storeId: string;
}) {
  const params = useParams();
  const { data, isLoading } = useFetchStoreProducts(storeId);

  const byCategory = useMemo(() => {
    const map: Record<string, any[]> = {};
    (data ?? []).forEach((p: any) => {
      const key = p.category || "Others";
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    return map;
  }, [data]);

  const categories = useMemo(() => Object.keys(byCategory), [byCategory]);

  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Browse by Category
      </h2>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductLoadingSkeleton key={i} />
          ))}
        </div>
      ) : (
        categories.map((cat) => (
          <div key={cat} className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">{cat}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {byCategory[cat].slice(0, 6).map((p: any) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  isAdmin={false}
                  storeName={params.id as string}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </section>
  );
}
