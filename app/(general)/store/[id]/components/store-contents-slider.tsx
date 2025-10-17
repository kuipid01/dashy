"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFetchStoreContent } from "@/app/(handlers)/content/content";

export default function StoreContentsSlider({ storeId }: { storeId: string }) {
  const params = useParams();
  const { data, isLoading } = useFetchStoreContent(storeId);

  const items = useMemo(() => {
    if (!data || data.length === 0) return [] as any[];
    return data.slice(0, 10);
  }, [data]);

  return (
    <section className="py-8 px-4 bgblur rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Store Contents</h2>
          <p className="text-gray-600 text-sm">Latest from this store</p>
        </div>
        <Button
          asChild
          variant="ghost"
          className="hidden md:inline-flex items-center gap-2"
        >
          <Link href={`/store/${params.id}/contents`}>
            See more <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
          {(isLoading ? Array.from({ length: 8 }) : items).map(
            (item: any, idx: number) => (
              <div
                key={item?.id ?? idx}
                className="min-w-[220px] max-w-[220px] snap-start bg-white rounded-xl shadow-sm border border-white/20 overflow-hidden"
              >
                <div className="relative aspect-[4/5]">
                  {isLoading ? (
                    <div className="w-full h-full animate-pulse bg-gray-100" />
                  ) : (
                    <Image
                      src={(item?.thumbnail as string) || "/placeholder.svg"}
                      alt={item?.title ?? "content"}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-2">
                    {isLoading ? "\u00A0" : item?.title ?? "Untitled"}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      <div className="mt-4 md:hidden">
        <Button asChild className="w-full">
          <Link href={`/store/${params.id}/contents`}>See more</Link>
        </Button>
      </div>
    </section>
  );
}
