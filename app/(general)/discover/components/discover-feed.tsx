/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Heart,
  Share2,
  ShoppingCart,
  MessageCircle,
  ChevronUp,
  ChevronDown,
  RefreshCw
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getDiscoveryContent } from "@/app/(handlers)/content/api";
import { useMarkContentAsViewed } from "@/app/(handlers)/content/content";
import { ContentItem } from "@/app/(protected)/contents/types/content";
import ProductOverlay from "../comps/product-overlay";
import StoreOverlay from "../comps/store-overlay";

interface DiscoverFeedProps {
  onSearch: () => void;
  onProductSelect?: (product: any) => void;
}

export default function DiscoverFeed({
  onSearch,
  onProductSelect
}: DiscoverFeedProps) {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [activeID, setActiveID] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [isVideoPaused, setIsVideoPaused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const { data } = useQuery<ContentItem[]>({
    queryKey: ["discovery-contents"],
    queryFn: getDiscoveryContent
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

  const handleSwipe = (direction: "up" | "down") => {
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

  const handlePanEnd = (event: any, info: PanInfo) => {
    const threshold = 50;
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    if (Math.abs(velocity) > 500 || Math.abs(offset) > threshold) {
      if (velocity < 0 || offset < -threshold) {
        handleSwipe("down");
      } else if (velocity > 0 || offset > threshold) {
        handleSwipe("up");
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleLike = (itemId: string) => {
    setLikedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleLongPress = () => {
    setIsVideoPaused(!isVideoPaused);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") handleSwipe("down");
      if (e.key === "ArrowUp") handleSwipe("up");
      if (e.key === "r" || e.key === "R") handleRefresh();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [contents.length, isAnimating]);

  // Preload next items
  useEffect(() => {
    if (!contents.length) return;

    const preloadAhead = 3;
    for (let i = 1; i <= preloadAhead; i++) {
      const nextItem = contents[currentIndex + i];
      if (!nextItem) break;

      if (nextItem.type === "image") {
        const img = new window.Image();
        img.src = nextItem.url;
      } else if (nextItem.type === "video") {
        const video = document.createElement("video");
        video.src = nextItem.url;
        video.preload = "auto";
      }
    }
  }, [currentIndex, contents]);

  const currentProduct = contents[currentIndex];
  const isLiked = currentProduct ? likedItems.has(currentProduct.id) : false;

  if (!currentProduct) return null;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/80 to-transparent"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Discover</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-white hover:bg-white/10"
            >
              <RefreshCw
                className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Feed */}
      <motion.div
        ref={containerRef}
        className="relative h-screen w-full flex items-center justify-center"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.1}
        onPanEnd={handlePanEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ y: 300, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -300, opacity: 0, scale: 0.9 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }}
            className="relative w-full max-w-md h-[85vh]"
          >
            <Card className="relative w-full h-full discover-card-gradient border-0 overflow-hidden">
              <div className="relative h-full">
                {/* Media Area (80% height) */}
                <div className="relative h-4/5">
                  {currentProduct.type === "image" ? (
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
                      ref={(el) => {
                        if (el) videoRefs.current[currentProduct.id] = el;
                      }}
                      src={currentProduct.url}
                      controls={false}
                      autoPlay={currentIndex === 0 && !isVideoPaused}
                      muted
                      loop
                      playsInline
                      preload={currentIndex === 0 ? "auto" : "metadata"}
                      className="object-cover w-full h-full"
                    />
                  )}

                  {/* Gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Floating action buttons */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(currentProduct.id)}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          isLiked ? "fill-red-500 text-red-500" : "text-white"
                        }`}
                      />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      <Share2 className="w-6 h-6 text-white" />
                    </motion.button>
                  </div>
                </div>

                {/* Overlay Info Area (20% height) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-4">
                  {currentProduct?.product ? (
                    <ProductOverlay product={currentProduct.product} />
                  ) : (
                    <StoreOverlay store={currentProduct?.store} />
                  )}

                  {/* Additional action buttons */}
                  <div className="flex gap-3 pt-2">
                    <Button
                      onClick={() =>
                        onProductSelect?.(
                          currentProduct?.product || currentProduct
                        )
                      }
                      className="flex-1 bg-white text-black hover:bg-gray-100 font-semibold py-3 transition-all duration-200 hover:scale-105"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      View & Buy
                    </Button>
                    <Button
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 py-3 transition-all duration-200 hover:scale-105 bg-transparent"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />I want something
                      like this
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSwipe("up")}
              disabled={currentIndex === 0 || isAnimating}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-all duration-200 rounded-full"
            >
              <ChevronUp className="w-6 h-6" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleSwipe("down")}
              disabled={currentIndex === contents.length - 1 || isAnimating}
              className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white disabled:opacity-30 transition-all duration-200 rounded-full"
            >
              <ChevronDown className="w-6 h-6" />
            </Button>
          </motion.div>
        </div>

        {/* Progress Indicator */}
        <div className="fixed left-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
          {contents.map((_, index) => (
            <motion.div
              key={index}
              className={`w-1 h-8 rounded-full swipe-indicator ${
                index === currentIndex ? "bg-white active" : "bg-white/30"
              }`}
              animate={{
                scale: index === currentIndex ? 1.2 : 1,
                opacity: index === currentIndex ? 1 : 0.5
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Bottom instructions */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 text-center z-40"
      >
        <p className="text-sm text-gray-400">
          Swipe up/down or use ↑↓ arrow keys to navigate
        </p>
      </motion.div>

      {/* Heart burst animation for likes */}
      <AnimatePresence>
        {isLiked && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none heart-burst"
          >
            <Heart className="w-16 h-16 text-red-500 fill-red-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
