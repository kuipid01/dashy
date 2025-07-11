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
}: {
  filters: {
    searchTerm: string;
    ratings: null;
    priceRange: null;
    category: string;
  };
}) => {
  const { id } = useParams();

  const { data: fetchedProducts, isLoading } = useFetchStoreProducts(id as string);

  console.log(fetchedProducts);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {isLoading
        ? <ProductLoadingSkeleton number={6} />
        : fetchedProducts?.map((product) => (
          <ProductCard isAdmin={false} key={product.id} product={product} />
        ))}
    </div>
  );
};
