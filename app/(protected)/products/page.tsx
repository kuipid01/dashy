"use client";
import { Input } from "@/components/ui/input";
import { Filter, LayoutDashboard, Loader, Plus, Search } from "lucide-react";
import React, { useState } from "react";
import ProductCard from "../_components/product-card";
import { Button } from "@/app/components/button";
import { useRouter } from "next/navigation";
import { useFetchUserProducts } from "@/app/(handlers)/product/product";
import Skeleton from "@/app/(general)/_compoenents/skeleton";
import { Product } from "@/app/(handlers)/types/product";

const Page = () => {
  const { data, isLoading } = useFetchUserProducts();
  const router = useRouter();
  const [itemsToShow] = useState(12);
  const [page, setPage] = useState(1);

  const pagedData = data?.slice(0, page * itemsToShow);
  const hasMore = data && data.length > (pagedData?.length ?? 0);
  console.log(pagedData, data);
  return (
    <div className="flex flex-col gap-6 p-5 bg-white rounded-xl min-h-screen h-full w-full">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between lg:items-center">
        <div className="relative w-full md:w-[200px] lg:w-[300px]">
          <Search className="absolute top-2.5 left-2.5 text-zinc-400 w-4 h-4" />
          <Input
            type="search"
            className="pl-8 bg-[var(--input)]"
            placeholder="Search products"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Button
            onClick={() => router.push("/products/add")}
            text="Add Product"
            icon={<Plus size={16} />}
            className="!bg-black text-white px-4 py-2 rounded-[10px] flex items-center gap-1"
          />
          <div className="rounded-md size-[40px] bg-[var(--input)] grid place-items-center">
            <Filter className="text-zinc-500 w-5 h-5" />
          </div>
          <div className="rounded-md size-[40px] bg-[var(--input)] grid place-items-center">
            <LayoutDashboard className="text-zinc-500 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl bg-[var(--input)] p-4 animate-pulse flex flex-col gap-4"
            >
              <Skeleton className="h-6 w-32" /> {/* small skeleton */}
              <Skeleton className="h-48 w-full rounded-xl" />{" "}
              {/* image placeholder */}
              <Skeleton className="h-4 w-[70%]" /> {/* text line */}
            </div>
          ))}

        {!isLoading && pagedData?.length === 0 && (
          <p className="col-span-full text-center text-zinc-400">
            No products found. Add your first product!
          </p>
        )}

        {pagedData?.map((product: Product) => {
          const fixedProduct = {
            ...product,
            videos:
              product.videos == null
                ? undefined
                : Array.isArray(product.videos)
                ? product.videos
                : [product.videos].filter(Boolean),
          };
          return (
            <ProductCard
              key={product.name}
              isAdmin={true}
              product={fixedProduct}
            />
          );
        })}
      </div>

      {/* Show More */}
      {!isLoading && hasMore && (
        <div className="flex justify-center w-full mt-6">
          <button
            onClick={() => setPage(page + 1)}
            className="flex items-center gap-2 text-sm px-4 py-2 bg-[var(--input)] rounded-md text-zinc-700 hover:bg-zinc-100 transition"
          >
            <Loader className="w-4 h-4 animate-spin-slow text-zinc-500" />
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;
