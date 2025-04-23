import React from "react";
import { products } from "../data/product";
import ProductCard from "@/app/(protected)/_components/product-card";

export const ProductGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard isAdmin={false} key={product.id} product={product} />
      ))}
    </div>
  );
};
