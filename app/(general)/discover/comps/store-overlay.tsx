/* eslint-disable @typescript-eslint/no-unused-vars */
import { Store } from "@/types/store";
import { MapPin, Globe, Phone, Mail } from "lucide-react";
import React from "react";
import Image from "next/image";

const StoreOverlay = ({ store }: { store?: Partial<Store> }) => {
  if (!store) return null;

  return (
    <div className="absolute text-white bottom-0 left-0 right-0 p-6 space-y-4 bg-black/30 backdrop-blur-sm">
      {store.cover_image && (
        <Image
          src={store.cover_image}
          alt={`${store.name} cover`}
          className="w-full h-48 object-cover"
          width={600}
          height={200}
        />
      )}

      <div className="p-4 bg-black/50 backdrop-blur-sm text-white absolute bottom-0 left-0 right-0 space-y-2">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-lg uppercase font-semibold capitalize">
              {store.name}
            </h2>
          </div>
        </div>

        <div className="flex gap-3 text-xs"></div>

        <a
          href={`/store/${store.id}`}
          className="inline-block mt-2 bg-white text-black text-sm px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Visit Store
        </a>
      </div>
    </div>
  );
};

export default StoreOverlay;
