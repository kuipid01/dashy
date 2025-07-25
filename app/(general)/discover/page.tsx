/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronUp, ChevronDown, Share2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDiscoveryContent } from "@/app/(handlers)/content/api";
import { useMarkContentAsViewed } from "@/app/(handlers)/content/content";
import { ContentItem } from "@/app/(protected)/contents/types/content";
import ProductOverlay from "./comps/product-overlay";
import StoreOverlay from "./comps/store-overlay";

export default function ProductDiscovery() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [activeID, setActiveID] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const { data } = useQuery<ContentItem[]>({
    queryKey: ["discovery-contents"],
    queryFn: getDiscoveryContent,
  });

  const { data: contentMarked, isLoading } = useMarkContentAsViewed(
    activeID ?? ""
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setContents([...data]);
      setActiveID(data[0].id);
      setCurrentIndex(0);
    }
  }, [data]);

  const handleScroll = (direction: "up" | "down") => {
    if (isAnimating) return;

    setIsAnimating(true);

    setCurrentIndex((prevIndex) => {
      if (direction === "down" && prevIndex < contents.length - 1) {
        return prevIndex + 1;
      }
      if (direction === "up" && prevIndex > 0) {
        return prevIndex - 1;
      }
      return prevIndex;
    });

    setTimeout(() => setIsAnimating(false), 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") handleScroll("down");
      if (e.key === "ArrowUp") handleScroll("up");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [contents.length, isAnimating]);
  useEffect(() => {
    if (!contents.length) return;

    const preloadAhead = 3; // Number of items to preload ahead

    for (let i = 1; i <= preloadAhead; i++) {
      const nextItem = contents[currentIndex + i];
      if (!nextItem) break;

      //@ts-expect-error
      if (nextItem.type === "photo") {
        const img = new window.Image();
        img.src = nextItem.url;

        img.src = nextItem.url;
      } else if (nextItem.type === "video") {
        // Create video element in memory and set preload
        const video = document.createElement("video");
        video.src = nextItem.url;
        video.preload = "auto";
        // Not appended to DOM, just cached by browser
      }
    }
  }, [currentIndex, contents]);

  const currentProduct = contents[currentIndex];

  if (!currentProduct) return null;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Discover</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Product Display */}
      <div
        ref={containerRef}
        className="relative h-screen w-full flex items-center justify-center"
      >
        <Card
          className={`relative w-full max-w-md h-[85vh] bg-gradient-to-br from-gray-900 to-gray-800 
          border-0 overflow-hidden transition-all duration-300 ease-out
          ${isAnimating ? "scale-95 opacity-50" : "scale-100 opacity-100"}
        `}
        >
          <div className="relative h-full">
            {
              //@ts-expect-error
              currentProduct.type === "photo" ? (
                <Image
                  src={currentProduct.url || "/placeholder.svg"}
                  alt={currentProduct.title}
                  fill
                  className="object-cover"
                  priority={currentIndex === 0}
                  loading={currentIndex === 0 ? "eager" : "lazy"}
                />
              ) : (
                <video
                  src={currentProduct.url}
                  controls
                  autoPlay={currentIndex === 0}
                  muted
                  preload={currentIndex === 0 ? "auto" : "metadata"}
                  className="object-cover w-full h-full"
                />
              )
            }

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

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
            disabled={currentIndex === contents.length - 1 || isAnimating}
            className="bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-all duration-200"
          >
            <ChevronDown className="w-6 h-6" />
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {contents.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-8 rounded-full transition-all duration-300 ${
                index === currentIndex ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-center">
        <p className="text-sm text-gray-400">
          Use ↑↓ arrow keys or buttons to navigate
        </p>
      </div>
    </div>
  );
}
