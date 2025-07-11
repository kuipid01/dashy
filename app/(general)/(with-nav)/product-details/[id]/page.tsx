/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ProductDetailSkeleton from "@/app/(general)/_compoenents/product-detail-skeleton";
import YouMightLike from "@/app/(general)/_compoenents/you-might-like";
import { useFetchProduct, UseFetchProductVariants } from "@/app/(handlers)/general/general";
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
  Percent,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import React, { useState, useMemo } from "react";

const Page = () => {
  const router = useRouter();
  const params = useSearchParams();
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading: productLoading } = useFetchProduct(id);
  const {
    data: variants,
    isLoading: variantsLoading,
  } = UseFetchProductVariants(product?.id ?? 0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [showShippingDetails, setShowShippingDetails] = useState(false);

  const {
    variantTypes,
    selectedVariant,
    currentPrice,
    currentStock,
  }: {
    variantTypes: { key: string; name: string; values: string[] }[];
    selectedVariant: ProductVariant & { [key: string]: any } | null;
    currentPrice: number | undefined;
    currentStock: number | undefined;
  } = useMemo(() => {
    if (!variants?.length) {
      return {
        variantTypes: [],
        selectedVariant: null,
        currentPrice: product?.price,
        currentStock: undefined,
      };
    }

    const excludedKeys = ['id', 'ID', 'product_id', 'product', 'price', 'stock', 'sku'];
    const variantKeys = Object.keys(variants[0]).filter(
      key => !excludedKeys.includes(key) && typeof variants[0][key] === "string"
    );

    const types = variantKeys.map(key => ({
      key,
      name: key.charAt(0).toUpperCase() + key.slice(1),
      values: [...new Set(variants.map(v => v[key]).filter(Boolean))] as string[],
    }));

    const currentSelections: Record<string, string> = {};
    variantKeys.forEach(key => {
      const paramValue = params.get(key.toLowerCase());
      if (paramValue) currentSelections[key] = paramValue;
    });

    const matchingVariant = variants.find(variant =>
      Object.entries(currentSelections).every(
        ([key, value]) => variant[key] === value
      )
    );

    return {
      variantTypes: types,
      selectedVariant: matchingVariant || null,
      currentPrice: matchingVariant?.Price ?? product?.price,
      currentStock: matchingVariant?.Stock,
    };
  }, [variants, params, product?.price]);

  const updateVariantParam = (variantKey: string, value: string) => {
    const currentParams = new URLSearchParams(Array.from(params.entries()));
    currentParams.set(variantKey.toLowerCase(), value);
    router.replace(`?${currentParams.toString()}`, { scroll: false });
  };

  const getSelectedValue = (variantKey: string) => params.get(variantKey.toLowerCase()) ?? "";

  const getAvailableOptions = (variantKey: string): string[] => {
    if (!variants?.length) return [];

    const otherSelections: Record<string, string> = {};
    variantTypes.forEach(type => {
      if (type.key !== variantKey) {
        const selected = getSelectedValue(type.key);
        if (selected) otherSelections[type.key] = selected;
      }
    });

    const filteredVariants = variants.filter(variant =>
      Object.entries(otherSelections).every(
        ([key, value]) => variant[key] === value
      )
    );

    return [...new Set(filteredVariants.map(v => v[variantKey]).filter(Boolean))] as string[];
  };

  const isSelectionAvailable = useMemo(() => {
    if (!variants?.length) return true;

    const currentSelections: Record<string, string> = {};
    variantTypes.forEach(type => {
      const selected = getSelectedValue(type.key);
      if (selected) currentSelections[type.key] = selected;
    });

    return variants.some(variant =>
      Object.entries(currentSelections).every(
        ([key, value]) => variant[key] === value
      )
    );
  }, [variants, variantTypes, params]);

  const images = product?.image?.length ? product.image : ["/assets/login.jpg"];

  if (productLoading || variantsLoading || !product) {
    return (
      <div className="min-h-screen w-[90%] mx-auto px-5 lg:px-10 py-[calc(10vh+50px)]">
        <ProductDetailSkeleton />
      </div>
    );
  }


  return (
    <div className="min-h-screen w-[90%] mx-auto px-5 lg:px-10 py-[calc(10vh+50px)]">
      <div className="flex gap-1 items-center">
        <Back />
        <h1 className="text-zinc-600 font-medium">Product Details</h1>
      </div>

      <div className="flex my-10 flex-col w-full lg:flex-row gap-10">
        {/* Product Image Section */}
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

        {/* Product Details Section */}
        <div className="w-full lg:w-[45%] flex flex-col gap-3">
          <Pill text={product?.category || ""} />
          <h1 className="font-bold text-4xl mt-5">{product?.name}</h1>
          <div className="flex items-center gap-3">
            <p className="font-bold text-lg">${currentPrice}</p>
            {currentStock && currentStock !== null && (
              <p className="text-sm text-zinc-500">
                {currentStock > 0 ? `${currentStock} in stock` : "Out of stock"}
              </p>
            )}
          </div>

          {/* Dynamic Variant Selection */}
          {variantTypes.map((variantType) => {
            const availableOptions = getAvailableOptions(variantType.key);
            const selectedValue = getSelectedValue(variantType.key);

            return (
              <div key={variantType.key} className="flex flex-col gap-2">
                <p className="text-xs text-zinc-500">Select {variantType.name.toLowerCase()}</p>
                <div className="grid grid-cols-4 gap-2">
                  {variantType.values.map((value) => {
                    const isAvailable = availableOptions.includes(value);
                    const isSelected = selectedValue === value;

                    return (
                      <button
                        key={value}
                        onClick={() => isAvailable && updateVariantParam(variantType.key, value)}
                        disabled={!isAvailable}
                        className={cn(
                          "px-4 py-3 rounded-[30px] cursor-pointer font-medium text-sm transition-all",
                          isSelected
                            ? "bg-black text-white"
                            : isAvailable
                              ? "bg-gray-100 hover:bg-gray-200"
                              : "bg-gray-50 text-gray-400 cursor-not-allowed"
                        )}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Selection validation message */}
          {!isSelectionAvailable && (
            <p className="text-sm text-red-500 bg-red-50 p-2 rounded">
              This combination is not available. Please select different options.
            </p>
          )}

          <div className="flex items-center gap-3 mt-4">
            <button
              disabled={!isSelectionAvailable || (typeof currentStock === "number" && currentStock <= 0)}
              className={cn(
                "w-full px-10 py-3 cursor-pointer rounded-[30px] font-medium transition-all",
                isSelectionAvailable && (currentStock === undefined || currentStock > 0)
                  ? "bg-black text-white hover:bg-gray-800"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              )}
            >
              {currentStock !== undefined && currentStock <= 0 ? "Out of Stock" : "Add to Cart"}
            </button>

            <button className="size-10 grid place-content-center shrink-0 rounded-full border border-gray-300">
              <Heart className="text-zinc-500 w-5 h-5" />
            </button>
          </div>

          {/* Selected variant info */}
          {selectedVariant && (
            <div className="text-xs text-zinc-500 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">Selected Variant:</p>
              <p>SKU: {selectedVariant.SKU || 'N/A'}</p>
              {selectedVariant.Stock !== null && (
                <p>Stock: {selectedVariant.Stock}</p>
              )}
            </div>
          )}

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
                { icon: <Percent />, label: "Discount", value: "Disc 50%" },
                { icon: <PackageOpen />, label: "Package", value: "Regular Packaging" },
                { icon: <CalendarHeart />, label: "Delivery Time", value: "4–5 Working Days" },
                { icon: <div />, label: "Product Details", value: "" },
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