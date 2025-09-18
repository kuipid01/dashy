"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import ProductCard from "@/app/(protected)/_components/product-card";
import { useFetchStoreProducts } from "@/app/(handlers)/general/general";
import { useParams } from "next/navigation";
import Skeleton from "@/app/(general)/_compoenents/skeleton";
import ProductLoadingSkeleton from "@/app/(general)/_compoenents/product-loading-skeleton";

export const ProductGrid = ({
  filters,
  id
}: {
  filters: {
    searchTerm: string;
    ratings: number | null;
    priceRange: [number, number] | null;
    category: string;
  };
  id: string;
}) => {
  const params = useParams();
  const storeName = params.id;

  const { data: fetchedProducts, isLoading } = useFetchStoreProducts(
    id as string,
    filters
  );

  console.log(filters, "filters it here");

  return (
    <div className="grid grid-cols-1 bgblur py-8 px-4 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading ? (
        <>
          <ProductLoadingSkeleton />
          <ProductLoadingSkeleton />
          <ProductLoadingSkeleton />
          <ProductLoadingSkeleton />
          <ProductLoadingSkeleton />
          <ProductLoadingSkeleton />
          <ProductLoadingSkeleton />
          <ProductLoadingSkeleton />
          <ProductLoadingSkeleton />
        </>
      ) : (
        fetchedProducts?.map((product) => (
          <ProductCard
            storeName={(storeName as string) ?? undefined}
            isAdmin={false}
            key={product.id}
            product={product}
          />
        ))
      )}
    </div>
  );
};
