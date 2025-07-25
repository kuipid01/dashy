"use client";

import type React from "react";

import { useState, useEffect, useCallback, useRef } from "react"; // Import useRef
import { X, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ContentItem } from "@/app/(protected)/contents/types/content";
import { Store } from "@/types/store";

interface ContentLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: ContentItem[];
  initialIndex: number;
  store?: Store;
}

export default function ContentLightbox({
  isOpen,
  onClose,
  items,
  initialIndex,
  store,
}: ContentLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🐛 FIX 1: Add useRef for video element
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentItem = items[currentIndex];

  // Reset index and playback state when lightbox opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsLoading(true);
      setIsPlaying(false); // 🐛 FIX 2: Ensure video is paused when lightbox opens/initial load
    }
  }, [isOpen, initialIndex]);

  // 🐛 FIX 3: Control video playback using useRef
  useEffect(() => {
    if (currentItem?.type === "video" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch((error) => {
          // Handle cases where play() might fail (e.g., browser autoplay policy)
          console.warn("Video auto-play prevented:", error);
          setIsPlaying(false); // Revert state if play fails
        });
      } else {
        videoRef.current.pause();
      }
    }
    // 🐛 FIX 4: Add currentItem.type and currentIndex to dependencies
    // This ensures playback state is managed when switching items
  }, [isPlaying, currentItem?.type, currentIndex]);
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
    setIsLoading(true);
    setIsPlaying(false); // 🐛 FIX 5: Pause video when navigating
  }, [items.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsLoading(true);
    setIsPlaying(false); // 🐛 FIX 5: Pause video when navigating
  }, [items.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case " ":
          e.preventDefault();
          if (currentItem?.type === "video") {
            // 🐛 IMPROVEMENT: Add optional chaining
            setIsPlaying((prev) => !prev); // Use functional update for state
          }
          break;
      }
    };

    // 🐛 IMPROVEMENT: Add useCallback dependencies for handleKeyDown
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, goToPrevious, goToNext, onClose, currentItem?.type]); // Dependencies for keyboard navigation

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleMediaLoad = () => {
    setIsLoading(false);
  };

  console.log(isPlaying, "video playing");
  if (!isOpen) return null;

  // 🐛 IMPROVEMENT: Handle currentItem potentially being undefined
  if (!currentItem) {
    return null; // Or render a loading state/error
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={handleBackdropClick}
    >
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 rounded-full w-10 h-10"
        onClick={onClose}
      >
        <X className="w-5 h-5" />
      </Button>

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 rounded-full w-12 h-12 hidden md:flex"
            onClick={goToPrevious}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border border-white/20 rounded-full w-12 h-12 hidden md:flex"
            onClick={goToNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {/* Main Content Container */}
      <div className="relative w-full max-w-4xl mx-4 animate-in zoom-in-95 duration-300">
        {/* Media Container */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Loading Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          )}

          {/* Media Content */}
          <div className="relative aspect-video bg-black rounded-t-2xl overflow-hidden">
            {currentItem.type === "video" ? (
              <video
                key={currentItem.id}
                ref={videoRef} // 🐛 FIX 1: Attach the ref here
                className="w-full h-full object-cover"
                controls
                autoPlay={false} // 🐛 FIX 6: Let useEffect control autoplay
                onLoadedData={handleMediaLoad}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                <source src={currentItem.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                key={currentItem.id}
                src={currentItem.url || "/placeholder.svg"}
                alt={currentItem.title}
                fill
                className="object-cover"
                onLoad={handleMediaLoad}
              />
            )}

            {/* Video Play/Pause Overlay */}
            {currentItem.type === "video" && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/20">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm rounded-full w-16 h-16"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Content Info */}
          <div className="p-6 bg-white">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl capitalize font-bold text-gray-900 mb-2 line-clamp-2">
                  {currentItem.title}
                </h2>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="capitalize">{currentItem.type}</span>
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <Image
                  src={store?.cover_image || "/assets/use1.jpg"}
                  alt={store?.name ?? ""}
                  width={40}
                  height={40}
                  className="rounded-full h-[40px] w-[40px] overflow-hidden object-cover ring-2 ring-gray-200"
                />
                <div className="text-right">
                  <p className="font-medium capitalize text-gray-900 text-sm">
                    {store?.name}
                  </p>
                  <p className="text-xs text-gray-500">Creator</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {items.length > 1 && (
            <div className="flex md:hidden justify-between items-center p-4 bg-gray-50 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevious}
                className="flex items-center gap-2 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <span className="text-sm text-gray-600 font-medium">
                {currentIndex + 1} of {items.length}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                className="flex items-center gap-2 bg-transparent"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Progress Indicators */}
        {items.length > 1 && (
          <div className="flex justify-center mt-4 gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? "bg-white scale-125"
                    : "bg-white/40 hover:bg-white/60"
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsLoading(true);
                  setIsPlaying(false); // 🐛 FIX 5: Pause video when changing slide via indicators
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
