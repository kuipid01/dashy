/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Play, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ContentLightbox from "./content-lightbox";
import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const videoData = [
  {
    id: 1,
    thumbnail: "/placeholder.svg?height=300&width=200",
    duration: "2:34",
    title: "Amazing Pasta Recipe",
    user: {
      name: "Chef Maria",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 2,
    thumbnail: "/placeholder.svg?height=300&width=200",
    duration: "5:12",
    title: "Morning Workout Routine",
    user: {
      name: "FitLife Jake",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 3,
    thumbnail: "/placeholder.svg?height=300&width=200",
    duration: "8:45",
    title: "Latest Phone Review",
    user: {
      name: "TechGuru Sam",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 4,
    thumbnail: "/placeholder.svg?height=300&width=200",
    duration: "12:18",
    title: "Tokyo Street Food Tour",
    user: {
      name: "Wanderlust Emma",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: 5,
    thumbnail: "/placeholder.svg?height=300&width=200",
    duration: "6:22",
    title: "DIY Home Decor Ideas",
    user: {
      name: "Crafty Lisa",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
];

export default function TopUserVideos() {
  const { id } = useParams();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  return (
    <section className="py-8 px-4 bgblur">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Top Contents
            </h2>
            <p className="text-gray-600">
              Discover trending content from our community
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 backdrop-blur-sm border border-white/20 shadow-sm"
          >
            <Link href={`/store/${id}/contents`}>
              See More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {videoData.map((video, index) => (
            <div
              onClick={() => {
                setIsLightboxOpen(true);
                setMediaItems([video]);
                console.log(mediaItems);
              }}
              key={video.id}
              className={`group cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                index >= 3
                  ? "hidden xl:block"
                  : index >= 2
                  ? "hidden lg:block"
                  : ""
              }`}
            >
              {/* Video Card */}
              <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm border border-white/20">
                {/* Thumbnail Container */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                      <Play className="w-8 h-8 text-gray-900 fill-current ml-1" />
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg">
                    {video.duration}
                  </div>

                  {/* Gradient Overlay at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                {/* User Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Image
                        src={video.user.avatar || "/placeholder.svg"}
                        alt={video.user.name}
                        width={32}
                        height={32}
                        className="rounded-full ring-2 ring-white shadow-sm"
                      />
                    </div>
                    <span className="text-sm text-gray-600 font-medium">
                      {video.user.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* See More Card - Mobile */}
          <div className="xl:hidden group cursor-pointer">
            <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden backdrop-blur-sm border border-white/20 aspect-[4/5] flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="bg-white/80 backdrop-blur-sm rounded-full p-4 shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">See More</h3>
                <p className="text-sm text-gray-600">
                  Discover more amazing videos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile See More Button */}
        <div className="flex justify-center mt-8 md:hidden">
          <Button
            asChild
            className="bg-white/80 backdrop-blur-sm text-gray-900 hover:bg-white border border-white/20 shadow-sm"
          >
            <Link href={`/store/${id}/contents`}>
              View All Videos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Lightbox Component */}
      <ContentLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        items={mediaItems}
        initialIndex={0}
      />
    </section>
  );
}
