/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import ProductDetailSkeleton from "@/app/(general)/_compoenents/product-detail-skeleton";
import Skeleton from "@/app/(general)/_compoenents/skeleton";
import VariantsCorner from "@/app/(general)/_compoenents/variants-corner";
import YouMightLike from "@/app/(general)/_compoenents/you-might-like";
import {
  useFetchProduct,
  UseFetchProductVariants
} from "@/app/(handlers)/general/general";
import { Pill } from "@/app/components/pill";
import { ProductVariant } from "@/constants/types";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import {
  CalendarHeart,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Heart,
  Minus,
  PackageOpen,
  Percent,
  Plus
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";
import { Moon } from "lucide-react";
import { Navbar } from "@/app/components/navbar";
import Footer from "@/app/components/footer";
import ShippingDetails from "../../components/shipping-details";
import FooterNew from "@/app/components/footer-new";
import { NavbarNew } from "@/app/components/navbar-new";
import { toast } from "sonner";

const Page = () => {
  const { pid, id } = useParams<{ pid: string; id: string }>();

  const { addItem, updateItemQuantity, items, removeItem, getCartItemId } =
    useCartStore();
  const { data: product, isLoading: productLoading } = useFetchProduct(pid);
  const { data: variants, isLoading: variantsLoading } =
    UseFetchProductVariants(product?.id ?? 0);

  const [selectedVariantNew, setSelectedVariantNew] =
    useState<null | ProductVariant>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDescription, setShowDescription] = useState(false);
  const [showShippingDetails, setShowShippingDetails] = useState(false);
  const iseSelectedVariantInCart = useMemo(() => {
    console.log("🟡 Checking if selected variant is in cart...");

    if (!selectedVariantNew || !product) {
      console.log("❌ No selectedVariantNew or product found.");
      return false;
    }

    console.log("🧩 Selected Variant Details:", {
      productId: product.id,
      variantId: selectedVariantNew.id,
      name: selectedVariantNew.Size || selectedVariantNew.Color || "Variant"
    });

    // Use the new cart item ID structure
    const cartItemId = getCartItemId(product.id, selectedVariantNew.id);
    const cartItem = items[cartItemId];

    console.log("🛒 Cart Item ID:", cartItemId);
    console.log("🛒 Cart Item:", cartItem);

    const isMatch = Boolean(cartItem);
    console.log(`✅ Variant Match Found: ${isMatch ? "YES" : "NO"}`);

    return isMatch;
  }, [selectedVariantNew, product, items, getCartItemId]);

  console.log("iseSelectedVariantInCart:", iseSelectedVariantInCart, items);
  const images = useMemo(() => {
    // If a variant is selected and has images, use variant images
    if (selectedVariantNew?.images) {
      const variantImages = selectedVariantNew.images
        .split(",")
        .filter(Boolean);
      if (variantImages.length > 0) {
        return variantImages;
      }
    }

    // Fallback to product images
    return product?.image?.length ? product.image : ["/assets/login.jpg"];
  }, [product?.image, selectedVariantNew?.images]);

  const productHasVariants = Array.isArray(variants) && variants.length > 0;
  console.log("productHasVariants:", productHasVariants);

  const productIsInCart = useMemo(() => {
    if (!product) return null;

    if (productHasVariants) {
      // For products with variants, only check if the currently selected variant is in cart
      if (selectedVariantNew) {
        const cartItemId = getCartItemId(product.id, selectedVariantNew.id);
        return items[cartItemId] || null;
      }
      // If no variant is selected, return null (don't show any cart state)
      return null;
    } else {
      // For products without variants, check if product is in cart
      const cartItemId = getCartItemId(product.id);
      return items[cartItemId] || null;
    }
  }, [product, productHasVariants, selectedVariantNew, items, getCartItemId]);

  const currentStock = selectedVariantNew?.stock ?? product?.stock ?? 0;
  const currentPrice =
    selectedVariantNew?.price ??
    product?.discounted_price ??
    product?.price ??
    0;
  const isOutOfStock = currentStock <= 0;

  if (productLoading || variantsLoading || !product) {
    return (
      <div className="min-h-screen bg-primary-new dark:bg-neutral-900 w-[90%] mx-auto px-5 lg:px-10 py-[calc(10vh+50px)]">
        <ProductDetailSkeleton />
      </div>
    );
  }
  console.log("productIsInCart:", productIsInCart);

  // console.log(selectedVariantNew?.product_id, "selectedVariantNew");
  console.log(items, "items");

  return (
    <>
      <NavbarNew />
      <div className="min-h-screen  bg-primary-new dark:bg-neutral-900 w-[90%] mx-auto px-5 lg:px-10 py-[calc(10vh+50px)]">
        {productLoading ? (
          <Skeleton className="w-full h-[50px] mb-5" />
        ) : (
          <Link
            className="bg-new-secondary  text-white  mb-5 w-fit p-2 rounded-full flex items-center gap-2"
            href={`/store/${id}`}
          >
            <ChevronLeft /> Go To Store
          </Link>
        )}
        <div className="flex gap-1 items-center">
          <h1 className="text-zinc-600 dark:text-zinc-200 font-medium">
            Product Details
          </h1>
        </div>

        <div className="flex my-10 flex-col w-full lg:flex-row gap-10">
          <div className="h-[650px] w-full lg:w-[45%] px-5 rounded-2xl relative overflow-hidden">
            <div className="grid absolute top-5 left-1/2 -translate-x-1/2 z-10 grid-cols-4 gap-2 rounded-2xl w-[80%] mx-auto">
              {images.map((_: string, index: number) => (
                <div
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    "h-[5px] rounded flex-1 cursor-pointer",
                    activeIndex === index
                      ? "bg-white dark:bg-white"
                      : "bg-gray-300 dark:bg-zinc-600"
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
                {images.map((image: string, index: number) => (
                  <div
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "relative cursor-pointer h-[150px] border-3 rounded-xl overflow-hidden",
                      activeIndex === index
                        ? "border-black dark:border-white"
                        : "border-gray-300 dark:border-zinc-600"
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
            <h1 className="font-bold text-4xl mt-5 dark:text-white">
              {product?.name}
            </h1>
            <div className="flex items-center gap-3">
              <p className="font-bold text-lg dark:text-zinc-200">
                ₦{currentPrice}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {isOutOfStock ? "Out of stock" : `${currentStock} in stock`}
              </p>
            </div>

            <div className="flex items-center gap-3 mt-4">
              {productHasVariants ? (
                selectedVariantNew ? (
                  iseSelectedVariantInCart ? (
                    // If product has variants AND that specific variant is in cart
                    <div className="flex items-center justify-between rounded-full bg-gray-100 dark:bg-zinc-800 px-2 py-1.5 w-[150px] shadow-sm">
                      <button
                        onClick={() => {
                          console.log(
                            selectedVariantNew,
                            "selectedVariantNew?"
                          );
                          const cartItemId = getCartItemId(
                            product.id,
                            selectedVariantNew?.id
                          );
                          console.log(cartItemId, "cartItemId");
                          updateItemQuantity(
                            cartItemId,
                            (productIsInCart?.quantity || 0) - 1
                          );
                        }}
                        className="p-1 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={20} />
                      </button>
                      <input
                        type="number"
                        value={productIsInCart?.quantity || 0}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value, 10);
                          if (!isNaN(newQuantity) && newQuantity >= 0) {
                            const cartItemId = getCartItemId(
                              product.id,
                              selectedVariantNew?.id
                            );
                            console.log(cartItemId, "cartItemId");
                            updateItemQuantity(cartItemId, newQuantity);
                          }
                        }}
                        className="w-10 text-center text-sm font-medium bg-transparent outline-none appearance-none dark:text-zinc-200"
                        min="0"
                      />
                      <button
                        onClick={() => {
                          console.log(currentStock, "currentStock");
                          if (
                            currentStock <
                            (productIsInCart?.quantity || 0) + 1
                          ) {
                            toast.error(
                              "You cannot add more than the available stock"
                            );
                            return;
                          }
                          const cartItemId = getCartItemId(
                            product.id,
                            selectedVariantNew?.id
                          );
                          console.log(cartItemId, "cartItemId");
                          updateItemQuantity(
                            cartItemId,
                            (productIsInCart?.quantity || 0) + 1
                          );
                        }}
                        className="p-1 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  ) : (
                    // If product has variants but this particular variant isn't in cart
                    <button
                      onClick={() => {
                        console.log("Product been added", product);
                        addItem(product, 1, selectedVariantNew);
                      }}
                      disabled={isOutOfStock}
                      className={cn(
                        "w-full px-10 cursor-pointer py-3 rounded-[30px] font-medium transition-all",
                        isOutOfStock
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-400"
                          : "bg-black text-white hover:bg-gray-800"
                      )}
                    >
                      {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                    </button>
                  )
                ) : (
                  // If product has variants but no variant is selected
                  <button
                    disabled
                    className="w-full px-10 cursor-not-allowed py-3 rounded-[30px] font-medium bg-gray-300 text-gray-500 dark:bg-zinc-700 dark:text-zinc-400"
                  >
                    Select a variant
                  </button>
                )
              ) : productIsInCart ? (
                // If no variants and product is already in cart
                <div className="flex items-center justify-between rounded-full bg-gray-100 dark:bg-zinc-800 px-2 py-1.5 w-[150px] shadow-sm">
                  <button
                    onClick={() => {
                      const cartItemId = getCartItemId(product.id);
                      updateItemQuantity(
                        cartItemId,
                        productIsInCart?.quantity - 1
                      );
                    }}
                    className="p-1 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={20} />
                  </button>
                  <input
                    type="number"
                    value={productIsInCart?.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value, 10);
                      if (!isNaN(newQuantity) && newQuantity >= 0) {
                        const cartItemId = getCartItemId(product.id);
                        updateItemQuantity(cartItemId, newQuantity);
                      }
                    }}
                    className="w-10 text-center text-sm font-medium bg-transparent outline-none appearance-none dark:text-zinc-200"
                    min="0"
                  />
                  <button
                    onClick={() => {
                      if (currentStock < (productIsInCart?.quantity || 0) + 1) {
                        toast.error(
                          "You cannot add more than the available stock"
                        );
                        return;
                      }
                      const cartItemId = getCartItemId(product.id);
                      updateItemQuantity(
                        cartItemId,
                        productIsInCart?.quantity + 1
                      );
                    }}
                    className="p-1 rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              ) : (
                // If no variants and product not in cart
                <button
                  onClick={() => addItem(product, 1)}
                  disabled={isOutOfStock}
                  className={cn(
                    "w-full px-10 cursor-pointer py-3 rounded-[30px] font-medium transition-all",
                    isOutOfStock
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-zinc-700 dark:text-zinc-400"
                      : "bg-black text-white hover:bg-gray-800"
                  )}
                >
                  {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
              )}

              <button className="size-10 grid place-content-center shrink-0 rounded-full border border-gray-300 dark:border-zinc-700">
                <Heart className="text-zinc-500 dark:text-zinc-300 w-5 h-5" />
              </button>
            </div>

            <VariantsCorner
              selectedVariantNew={selectedVariantNew}
              setSelectedVariantNew={setSelectedVariantNew}
              variants={variants || []}
            />

            <div className="p-3 border border-gray-300 dark:border-zinc-700 rounded-xl flex flex-col">
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg dark:text-zinc-100">
                  Description
                </p>
                <button
                  onClick={() => setShowDescription(!showDescription)}
                  className="size-8 grid cursor-pointer place-content-center shrink-0 rounded-full border border-gray-300 dark:border-zinc-700"
                >
                  {showDescription ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>
              <p
                className={cn(
                  "text-sm transition-all duration-500 ease-in-out text-zinc-500 dark:text-zinc-300 overflow-hidden",
                  showDescription ? "max-h-[600px] mt-5" : "max-h-[0px]"
                )}
              >
                {product?.description}
              </p>
            </div>
            {/* 
            <ShippingDetails
              setShowShippingDetails={setShowShippingDetails}
              product={product}
              showShippingDetails={showShippingDetails}
            /> */}
          </div>
        </div>

        <YouMightLike />
      </div>
      <FooterNew />
    </>
  );
};

export default Page;
