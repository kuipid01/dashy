"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader, Plus, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/app/components/button";
import ProductCard from "../_components/product-card";
import Skeleton from "@/app/(general)/_compoenents/skeleton";
import { useFetchUserProducts } from "@/app/(handlers)/product/product";
import { useFetchUserStore } from "@/app/(handlers)/auth-handlers/auth";
import { Product } from "@/app/(handlers)/types/product";

const ITEMS_PER_PAGE = 12;

const Page = () => {
  const router = useRouter();
  const { data: products, isLoading } = useFetchUserProducts();
  const { store } = useFetchUserStore();
  console.log(store, "store");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const pagedProducts = Array.isArray(products)
    ? products.slice(0, page * ITEMS_PER_PAGE)
    : [];

  const hasMore = Array.isArray(products)
    ? products.length > pagedProducts.length
    : false;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = pagedProducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-5 bgblur rounded-xl min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-3 justify-between lg:items-center">
        <div className="relative w-full md:w-[200px] lg:w-[300px]">
          <Search className="absolute top-2.5 left-2.5 text-zinc-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search products"
            value={searchTerm}
            onChange={handleSearch}
            className="pl-8 bg-[var(--input)]"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Button
            onClick={() => router.push("/products/add")}
            text="Add Product"
            icon={<Plus size={16} />}
            className="!bg-black !hover:bg-black/50 cursor-pointer hover:backdrop-blur-3xl text-white px-4 py-2 rounded-[10px] flex items-center gap-1"
          />
          {/* <div className="rounded-md size-[40px] bg-[var(--input)] grid place-items-center">
            <Filter className="text-zinc-500 w-5 h-5" />
          </div> */}
          {/* <div className="rounded-md size-[40px] bg-[var(--input)] grid place-items-center">
            <LayoutDashboard className="text-zinc-500 w-5 h-5" />
          </div> */}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="rounded-xl bg-[var(--input)] p-4 animate-pulse flex flex-col gap-4"
            >
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-[70%]" />
            </div>
          ))}

        {!isLoading && filteredProducts.length === 0 && (
          <p className="col-span-full text-center text-zinc-400">
            No products found. Try adding or searching again.
          </p>
        )}

        {filteredProducts.map((product: Product) => {
          const videos =
            product.videos == null
              ? undefined
              : Array.isArray(product.videos)
              ? product.videos
              : [product.videos].filter(Boolean);

          return (
            <ProductCard
              storeName={store.store.name.toLowerCase()}
              key={`${product.id}-${product.name}`}
              product={{ ...product, videos }}
              isAdmin={product.store_id === store?.store?.id}
            />
          );
        })}
      </div>

      {/* Show More */}
      {!isLoading && hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setPage((prev) => prev + 1)}
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
