/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ProductDetailSkeleton from "@/app/(general)/_compoenents/product-detail-skeleton";
import VariantsCorner from "@/app/(general)/_compoenents/variants-corner";
import YouMightLike from "@/app/(general)/_compoenents/you-might-like";
import {
  useFetchProduct,
  UseFetchProductVariants
} from "@/app/(handlers)/general/general";
import { Pill } from "@/app/components/pill";
import Back from "@/app/components/reusables/back";
import { ProductVariant } from "@/constants/types";
import { cn } from "@/lib/utils";
import {
  CalendarHeart,
  ChevronDown,
  ChevronUp,
  Heart,
  PackageOpen,
  Percent
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState, useMemo } from "react";

const Page = () => {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading: productLoading } = useFetchProduct(id);
  const { data: variants, isLoading: variantsLoading } =
    UseFetchProductVariants(product?.id ?? 0);

  const [selectedVariantNew, setSelectedVariantNew] =
    useState<null | ProductVariant>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [showShippingDetails, setShowShippingDetails] = useState(false);

  const images = useMemo(
    () => (product?.image?.length ? product.image : ["/assets/login.jpg"]),
    [product?.image]
  );

  const currentStock = selectedVariantNew?.stock ?? product?.stock ?? 0;
  const currentPrice =
    selectedVariantNew?.price ??
    product?.discounted_price ??
    product?.price ??
    0;
  const isOutOfStock = currentStock <= 0;
  console.log(product);
  if (productLoading || variantsLoading || !product) {
    return (
      <div className="min-h-screen w-[90%] mx-auto px-5 lg:px-10 py-[calc(10vh+50px)]">
        <ProductDetailSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen  bg-primary w-[90%] mx-auto px-5 lg:px-10 py-[calc(10vh+50px)]">
      <div className="flex gap-1 items-center">
        <Back />
        <h1 className="text-zinc-600 font-medium">Product Details</h1>
      </div>

      <div className="flex my-10 flex-col w-full lg:flex-row gap-10">
        <div className="h-[650px] w-full lg:w-[45%] px-5 rounded-2xl relative overflow-hidden">
          <div className="grid absolute top-5 left-1/2 -translate-x-1/2 z-10 grid-cols-4 gap-2 rounded-2xl w-[80%] mx-auto">
            {images.map((_, index) => (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-[5px] rounded flex-1 cursor-pointer",
                  activeIndex === index ? "bg-white" : "bg-gray-300"
                )}
              />
            ))}
          </div>

          <Image
            src={images[activeIndex] as string}
            alt="Product Image"
            fill
            className="object-cover"
            priority
          />
          <div className="inset-0 bg-black opacity-50 absolute"></div>

          {images.length > 0 && (
            <div className="absolute w-[80%] z-10 bottom-2 left-1/2 -translate-x-1/2 space-x-5 grid-cols-3 grid">
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "relative cursor-pointer h-[150px] border-3 rounded-xl overflow-hidden",
                    activeIndex === index ? "border-black" : "border-gray-300"
                  )}
                >
                  <Image
                    src={image as string}
                    alt="Product Thumbnail"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-[45%] flex flex-col gap-3">
          <Pill text={product?.category || ""} />
          <h1 className="font-bold text-4xl mt-5">{product?.name}</h1>
          <div className="flex items-center gap-3">
            <p className="font-bold text-lg">${currentPrice}</p>
            <p className="text-sm text-zinc-500">
              {isOutOfStock ? "Out of stock" : `${currentStock} in stock`}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              disabled={isOutOfStock}
              className={cn(
                "w-full px-10 cursor-pointer py-3 rounded-[30px] font-medium transition-all",
                isOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              )}
            >
              {isOutOfStock ? "Out of Stock" : "Add to Cart"}
            </button>

            <button className="size-10 grid place-content-center shrink-0 rounded-full border border-gray-300">
              <Heart className="text-zinc-500 w-5 h-5" />
            </button>
          </div>

          <VariantsCorner
            selectedVariantNew={selectedVariantNew}
            setSelectedVariantNew={setSelectedVariantNew}
            variants={variants || []}
          />

          <div className="p-3 border border-gray-300 rounded-xl flex flex-col">
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Description</p>
              <button
                onClick={() => setShowDescription(!showDescription)}
                className="size-8 grid cursor-pointer place-content-center shrink-0 rounded-full border border-gray-300"
              >
                {showDescription ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            <p
              className={cn(
                "text-sm transition-all duration-500 ease-in-out text-zinc-500 overflow-hidden",
                showDescription ? "max-h-[600px] mt-5" : "max-h-[0px]"
              )}
            >
              {product?.description}
            </p>
          </div>

          <div className="p-3 border mt-5 border-gray-300 rounded-xl flex flex-col">
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Shipping Details</p>
              <button
                onClick={() => setShowShippingDetails(!showShippingDetails)}
                className="size-8 grid cursor-pointer place-content-center shrink-0 rounded-full border border-gray-300"
              >
                {showShippingDetails ? <ChevronUp /> : <ChevronDown />}
              </button>
            </div>
            <div
              className={cn(
                "grid transition-all duration-500 ease-in-out overflow-hidden grid-cols-2 gap-5",
                showShippingDetails ? "max-h-[600px] mt-5 p-2" : "max-h-[0px]"
              )}
            >
              {[
                {
                  icon: <Percent />,
                  label: "Discount",
                  value:
                    product.discounted_price && product.price
                      ? `Disc ${Math.round(
                          ((product.price - product.discounted_price) /
                            product.price) *
                            100
                        )}%`
                      : "No Discount"
                },
                {
                  icon: <PackageOpen />,
                  label: "Package",
                  value: "Regular Packaging"
                },
                {
                  icon: <CalendarHeart />,
                  label: "Delivery Time",
                  value: "4–5 Working Days"
                },
                { icon: <div />, label: "Product Details", value: "" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="size-12 rounded-full bg-zinc-100 grid place-items-center">
                    {item.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <small className="text-zinc-500 text-sm font-medium">
                      {item.label}
                    </small>
                    {item.value && (
                      <p className="font-bold text-lg">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <YouMightLike />
    </div>
  );
};

export default Page;
