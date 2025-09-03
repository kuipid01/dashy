/* eslint-disable @typescript-eslint/no-unused-vars */
import { Product } from "@/app/(handlers)/types/product";
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import Link from "next/link";

const ProductOverlay = ({ product }: { product: Partial<Product> }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (product) {
      addItem(product as Product, 1);
    }
  };

  return (
    <div>
      {/* Product Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
        {/* Rating */}
        {/* <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {product.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-300">
                  ({product.reviews.toLocaleString()} reviews)
                </span>
              </div> */}

        {/* Product Name */}
        <h2 className="text-2xl font-bold leading-tight">{product.name}</h2>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed">
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-white">
            ${product.discountedPrice || product.discounted_price}
          </span>
          {product.price && (
            <span className="text-lg text-gray-400 line-through">
              ${product.price}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-white text-black hover:bg-gray-100 font-semibold py-3 transition-all duration-200 hover:scale-105"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
          <Link href={`/product-details/${product.id}`}>
            <Button
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 py-3 transition-all duration-200 hover:scale-105 bg-transparent"
            >
              <Eye className="w-5 h-5 mr-2" />
              Details
            </Button>
          </Link>
          {/* <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 py-3 transition-all duration-200 hover:scale-105"
                >
                  <Heart className="w-5 h-5" />
                </Button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductOverlay;
