import ProductCard from "@/app/(protected)/_components/product-card";
import { mockProducts } from "@/constants/mock_data";
import React from "react";

const YouMightLike = () => {
  return (
    <div className=" flex flex-col items-center w-full justify-center gap-10 mt-20">
      <h1 className=" text-5xl f text-center"> You might also like</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {mockProducts.slice(0, 4).map((product) => (
          <ProductCard key={product.name} product={product} />
        ))}
      </div>
    </div>
  );
};

export default YouMightLike;
