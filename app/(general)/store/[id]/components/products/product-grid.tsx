"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import ProductCard from "@/app/(protected)/_components/product-card";
import { useFetchStoreProducts } from "@/app/(handlers)/general/general";
import { useParams } from "next/navigation";
import Skeleton from "@/app/(general)/_compoenents/skeleton";

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
        ? [1, 2, 3, 4, 5, 6].map((ske) => (
          < div className=" flex-col flex gap-3" key={ske}>
           <Skeleton  className="w-[350px] h-[250px]" />
           <Skeleton  className="w-[350px h-[50px]" />
          </div>
           
          ))
        : fetchedProducts?.map((product) => (
            <ProductCard isAdmin={false} key={product.id} product={product} />
          ))}
    </div>
  );
};
