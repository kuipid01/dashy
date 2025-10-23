"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  X,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus
} from "lucide-react";
import { Product } from "@/app/(handlers)/types/product";

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart
}: ProductDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const images = product.image || [];
  const videos = product.videos || [];

  const handleImageChange = (direction: "prev" | "next") => {
    const totalMedia = images.length + videos.length;
    if (direction === "next") {
      setCurrentImageIndex((prev) => (prev + 1) % totalMedia);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + totalMedia) % totalMedia);
    }
  };

  const handleQuantityChange = (change: number) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  const currentMedia =
    currentImageIndex < images.length
      ? images[currentImageIndex]
      : videos[currentImageIndex - images.length];

  const isVideo = currentImageIndex >= images.length;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Product Details
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="overflow-y-auto max-h-[calc(85vh-60px)]">
            {/* Media Carousel */}
            <div className="relative h-64 bg-gray-100">
              {isVideo ? (
                <video
                  src={currentMedia}
                  controls
                  autoPlay
                  muted
                  loop
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={
                    typeof currentMedia === "string"
                      ? currentMedia
                      : URL.createObjectURL(currentMedia as Blob)
                  }
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}

              {/* Navigation arrows */}
              {images.length + videos.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleImageChange("prev")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleImageChange("next")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}

              {/* Media indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {[...images, ...videos].map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 space-y-4">
              {/* Product name and price */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">
                    ₦{product.discountedPrice || product.discounted_price}
                  </span>
                  {product.price && (
                    <span className="text-lg text-gray-500 line-through">
                      ₦{product.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Rating and social proof */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">4.8</span>
                </div>
                <span className="text-sm text-gray-500">
                  2.3k bought this week
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity selector */}
              <div className="flex items-center gap-4">
                <span className="font-semibold text-gray-900">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    className="w-8 h-8"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-8 text-center font-semibold">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    className="w-8 h-8"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 discover-button-gradient text-white font-semibold py-3"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" className="px-6 py-3 font-semibold">
                  Buy Now
                </Button>
              </div>

              {/* Secondary actions */}
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex-1 ${
                    isLiked ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 mr-2 ${isLiked ? "fill-current" : ""}`}
                  />
                  {isLiked ? "Saved" : "Save"}
                </Button>
                <Button variant="ghost" className="flex-1 text-gray-600">
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>
                <Button variant="ghost" className="flex-1 text-gray-600">
                  See Similar
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
