/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import Image from "next/image";
import ContentLightbox from "./content-lightbox";
import Back from "@/app/components/reusables/back";
import { useFetchStoreContent } from "@/app/(handlers)/content/content";
import { useParams } from "next/navigation";
import { ContentItem } from "@/app/(protected)/contents/types/content";
import { useFetchStoreById } from "@/app/(handlers)/store/store";

// const mediaItems = [
//   {
//     id: 1,
//     type: "video" as const,
//     src: "/placeholder.svg?height=720&width=1280",
//     thumbnail: "/placeholder.svg?height=300&width=200",
//     title: "Amazing Pasta Recipe - Step by Step Guide",
//     duration: "2:34",
//     user: {
//       name: "Chef Maria",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//   },
//   {
//     id: 2,
//     type: "image" as const,
//     src: "/placeholder.svg?height=800&width=1200",
//     thumbnail: "/placeholder.svg?height=300&width=200",
//     title: "Beautiful Sunset Photography",
//     user: {
//       name: "PhotoPro Alex",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//   },
//   {
//     id: 3,
//     type: "video" as const,
//     src: "/placeholder.svg?height=720&width=1280",
//     thumbnail: "/placeholder.svg?height=300&width=200",
//     title: "Morning Workout Routine for Beginners",
//     duration: "5:12",
//     user: {
//       name: "FitLife Jake",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//   },
//   {
//     id: 4,
//     type: "image" as const,
//     src: "/placeholder.svg?height=800&width=1200",
//     thumbnail: "/placeholder.svg?height=300&width=200",
//     title: "Modern Architecture Design",
//     user: {
//       name: "ArchVision Studio",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//   },
//   {
//     id: 5,
//     type: "video" as const,
//     src: "/placeholder.svg?height=720&width=1280",
//     thumbnail: "/placeholder.svg?height=300&width=200",
//     title: "Latest iPhone 15 Pro Review",
//     duration: "8:45",
//     user: {
//       name: "TechGuru Sam",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//   },
// ];

export default function LightboxDemo() {
  //   interface LightboxParams {
  //     id: string;
  //   }
  const [mediaItems, setMediaItems] = useState<ContentItem[] | []>([]);
  const { id } = useParams<any>(); // Use typed params

  const { data: contents, isLoading: isContentsLoading } = useFetchStoreContent(
    id ?? ""
  );
  const { data: storeData, isLoading: isStoreLoading } = useFetchStoreById(
    id ?? ""
  ); // Fetch store data for the current page's ID
  //@ts-expect-error
  const currentStore = storeData?.store; // This is the store whose content is being displayed

  useEffect(() => {
    if (contents) {
      setMediaItems(contents);
    }
  }, [contents]);

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };
  console.log(storeData, currentStore);
  const overallLoading = isContentsLoading || isStoreLoading;

  return (
    <div className="min-h-screen bg-primary  py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className=" px-4 md:px-6 lg:px-8 pt-5 justify-between flex items-center gap-2">
          <Back />
          <p className="uppercase font-bold">
            {currentStore?.name || "Store"}
          </p>{" "}
          {/* Use currentStore */}
        </div>
        <div className="text-center mb-12">
          <h1 className="text-4xl uppercase font-bold text-gray-900 mb-4">
            {/* {currentStore?.name} Content */}
          </h1>
          <p className="text-gray-600 uppercase text-lg">
            Click on any media item to view
          </p>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {overallLoading ? (
            <div className="col-span-full text-center py-10">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-700">Loading content...</p>
            </div>
          ) : mediaItems.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-700">
              <p>No content found for this store.</p>
            </div>
          ) : (
            mediaItems?.map((item, index) => (
              <div
                key={item.id}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105"
                onClick={() => openLightbox(index)}
              >
                <div className="relative bgblur rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  {/* Thumbnail */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={item.url || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 5}
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <Play className="w-6 h-6 text-gray-900 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg capitalize">
                      {item.type}
                    </div>
                  </div>

                  {/* Content Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      {/* Use currentStore for consistency */}
                      <Image
                        src={currentStore?.avatar || "/assets/use1.jpg"}
                        alt={currentStore?.name || "Store owner"}
                        width={32}
                        height={32}
                        className="rounded-full ring-2 ring-white shadow-sm"
                      />
                      <span className="text-sm capitalize text-gray-600 font-medium">
                        {currentStore?.name || "Unknown Creator"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 max-w-2xl mx-auto">
            <h3 className="font-semibold text-gray-900 mb-3">
              Lightbox Controls
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">←</kbd>{" "}
                <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">→</kbd>{" "}
                Navigate between items
              </p>
              <p>
                <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">
                  Space
                </kbd>{" "}
                Play/pause videos
              </p>
              <p>
                <kbd className="bg-gray-100 px-2 py-1 rounded text-xs">Esc</kbd>{" "}
                Close lightbox
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Component */}
      <ContentLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        items={mediaItems}
        initialIndex={selectedIndex}
        store={currentStore}
      />
    </div>
  );
}
