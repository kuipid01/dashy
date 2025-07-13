/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  // Heart,
  ShoppingCart,
  // Star,
  ChevronUp,
  ChevronDown,
  Eye,
  Share2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDiscoveryContent } from "@/app/(handlers)/content/api";
import { useMarkContentAsViewed } from "@/app/(handlers)/content/content";
import { ContentItem } from "@/app/(protected)/contents/types/content";
import ProducOverlay from "./comps/product-overlay";
import ProductOverlay from "./comps/product-overlay";
import StoreOverlay from "./comps/store-overlay";

// const categories = [
//   "All",
//   "Electronics",
//   "Fashion",
//   "Home",
//   "Beauty",
//   "Sports",
// ];

export default function ProductDiscovery() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [activeID, setActiveID] = useState<string | null>(null);
  const { data } = useQuery({
    queryKey: ["discovery-contents"],
    queryFn: getDiscoveryContent,
  });
  const { data: contentMarked, isLoading } = useMarkContentAsViewed(
    activeID ?? ""
  );
  console.log(data);

  useEffect(() => {
    if (!data) return;
    setActiveID(data[0].id);
  }, [data]);

  useEffect(() => {
    if (!data) return;
    setContents([...data]);
  }, [data]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAnimating, setIsAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProducts =
    selectedCategory === "All"
      ? contents
      : contents.filter((product) => product);

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

  // const handleCategoryChange = (category: string) => {
  //   setSelectedCategory(category);
  //   setCurrentIndex(0);
  // };

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
        {/* <Tabs value={selectedCategory} onValueChange={handleCategoryChange}>
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
        </Tabs> */}
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
              src={currentProduct.url || "/placeholder.svg"}
              alt={currentProduct.title}
              fill
              className="object-cover"
              priority
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

            {/* Discount Badge */}
            {/* {currentProduct.discount && (
              <Badge className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white">
                -{currentProduct.discount}%
              </Badge>
            )} */}

            {currentProduct?.product ? (
              <ProductOverlay product={currentProduct.product} />
            ) : (
              <StoreOverlay store={currentProduct?.store} />
            )}
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
