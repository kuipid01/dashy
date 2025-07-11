"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Heart,
  ShoppingCart,
  Star,
  ChevronUp,
  ChevronDown,
  Eye,
  Share2,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Wireless Noise-Canceling Headphones",
    price: 299.99,
    originalPrice: 399.99,
    description: "Premium sound quality with active noise cancellation",
    image: "/assets/man.jpg",
    category: "Electronics",
    rating: 4.8,
    reviews: 1247,
    discount: 25,
  },
  {
    id: 2,
    name: "Minimalist Leather Backpack",
    price: 159.99,
    originalPrice: null,
    description: "Handcrafted genuine leather with modern design",
    image: "/assets/man.jpg",
    category: "Fashion",
    rating: 4.9,
    reviews: 892,
    discount: null,
  },
  {
    id: 3,
    name: "Smart Fitness Watch",
    price: 249.99,
    originalPrice: 329.99,
    description: "Track your health with advanced sensors",
    image: "/assets/man.jpg",
    category: "Electronics",
    rating: 4.7,
    reviews: 2156,
    discount: 24,
  },
  {
    id: 4,
    name: "Organic Cotton T-Shirt",
    price: 39.99,
    originalPrice: null,
    description: "Sustainable fashion with premium comfort",
    image: "/assets/man.jpg",
    category: "Fashion",
    rating: 4.6,
    reviews: 543,
    discount: null,
  },
  {
    id: 5,
    name: "Ceramic Coffee Mug Set",
    price: 49.99,
    originalPrice: 69.99,
    description: "Handmade ceramic mugs for the perfect brew",
    image: "/assets/man.jpg",
    category: "Home",
    rating: 4.8,
    reviews: 324,
    discount: 29,
  },
];

const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Home",
  "Beauty",
  "Sports",
];

export default function ProductDiscovery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const currentProduct = filteredProducts[currentIndex];

  const handleScroll = (direction: "up" | "down") => {
    if (isAnimating) return;

    setIsAnimating(true);

    if (direction === "down" && currentIndex < filteredProducts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === "up" && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") handleScroll("down");
      if (e.key === "ArrowUp") handleScroll("up");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, filteredProducts.length, isAnimating]);

  if (!currentProduct) return null;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Discover</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
          <TabsList className="bg-white/10 border-0">
            {categories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-white data-[state=active]:text-black text-white/70"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Main Product Display */}
      <div
        ref={containerRef}
        className="relative h-screen w-full flex items-center justify-center"
      >
        {/* Product Card */}
        <Card
          className={`
          relative w-full max-w-md h-[85vh] bg-gradient-to-br from-gray-900 to-gray-800 
          border-0 overflow-hidden transition-all duration-300 ease-out
          ${isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"}
        `}
        >
          {/* Product Image */}
          <div className="relative h-full">
            <Image
              src={currentProduct.image || "/placeholder.svg"}
              alt={currentProduct.name}
              fill
              className="object-cover"
              priority
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            {/* Discount Badge */}
            {currentProduct.discount && (
              <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white">
                -{currentProduct.discount}%
              </Badge>
            )}

            {/* Product Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {currentProduct.rating}
                  </span>
                </div>
                <span className="text-sm text-gray-300">
                  ({currentProduct.reviews.toLocaleString()} reviews)
                </span>
              </div>

              {/* Product Name */}
              <h2 className="text-2xl font-bold leading-tight">
                {currentProduct.name}
              </h2>

              {/* Description */}
              <p className="text-gray-300 text-sm leading-relaxed">
                {currentProduct.description}
              </p>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-white">
                  ${currentProduct.price}
                </span>
                {currentProduct.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ${currentProduct.originalPrice}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button className="flex-1 bg-white text-black hover:bg-gray-100 font-semibold py-3 transition-all duration-200 hover:scale-105">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 py-3 transition-all duration-200 hover:scale-105 bg-transparent"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  Details
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10 py-3 transition-all duration-200 hover:scale-105"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Navigation Controls */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleScroll("up")}
            disabled={currentIndex === 0 || isAnimating}
            className="bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-all duration-200"
          >
            <ChevronUp className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleScroll("down")}
            disabled={
              currentIndex === filteredProducts.length - 1 || isAnimating
            }
            className="bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-all duration-200"
          >
            <ChevronDown className="w-6 h-6" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {filteredProducts.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-8 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Instructions */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-gray-400">
          Use ↑↓ arrow keys or buttons to navigate
        </p>
      </div>
    </div>
  );
}
