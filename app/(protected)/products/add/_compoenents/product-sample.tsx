import { Product } from "@/app/(handlers)/types/product";
import ProductCard from "@/app/(protected)/_components/product-card";
import React from "react";

const ProductSample = ({ product }: { product: Product }) => {
  return <ProductCard product={product} />;
};

export default ProductSample;
