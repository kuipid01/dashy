"use client";
import { Input } from "@/components/ui/input";
import { Filter, LayoutDashboard, Loader } from "lucide-react";
import React, { useState } from "react";
import ProductCard from "../_components/product-card";
import { mockProducts } from "@/constants/mock_data";

const Page = () => {
  const [itemsToShown] = useState(12);
  const [page, setPage] = useState(1);
  return (
    <div className=" flex flex-col gap-5 p-5  bg-white rounded-xl min-h-screen h-full w-full">
      <div className="flex justify-between items-center">
        <Input
          type="search"
          className=" w-[200px] lg:w-[300px] bg-[var(--input)]"
          placeholder="Search products"
        />
        <div className="flex gap-2">
          <div className=" rounded-md size-[40px] bg-[var(--input)] grid place-items-center">
            <Filter className=" text-zinc-500 w-5 h-5" />
          </div>
          <div className=" rounded-md size-[40px] bg-[var(--input)] grid place-items-center">
            <LayoutDashboard className=" text-zinc-500 w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ">
        {mockProducts
          .slice(0, page * itemsToShown)
          .map((product) => (
            <ProductCard key={product.name} product={product} />
          ))}
      </div>
      <div className="flex justify-center  w-full">
        <button
          onClick={() => setPage(page + 1)}
          className=" flex items-center cursor-pointer text-zinc-700 text-sm w-fit px-4 font-medium gap-1 rounded-md size-[40px] bg-[var(--input)] hover:bg-[var(--input)]"
        >
          <Loader className=" text-zinc-500 w-4 h-4" />
          SHOW MORE
        </button>
      </div>
    </div>
  );
};

export default Page;
