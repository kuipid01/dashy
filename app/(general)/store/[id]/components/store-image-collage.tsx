"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Image from "next/image";

export default function StoreImageCollage({
  images,
  names
}: {
  images: string[];
  names?: string[];
}) {
  const safeImages = images.slice(0, 3);
  const safeNames = names ?? [];

  return (
    <section className="py-8 px-4">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured</h2>
      <div className="grid grid-cols-3 gap-4">
        {safeImages.map((src, idx) => (
          <div
            key={idx}
            className={`relative aspect-square rounded-xl overflow-hidden ${
              idx === 0 ? "col-span-2" : "col-span-1"
            }`}
          >
            <Image
              src={src || "/placeholder.svg"}
              alt={safeNames[idx] ?? `image-${idx}`}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-white text-sm font-medium truncate">
                {safeNames[idx] ?? ""}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
