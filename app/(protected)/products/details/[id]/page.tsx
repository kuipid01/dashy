/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import PoductSec from "./components/product-sec";
import MediaSec from "./components/media-sec";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";
import {
  useGetCurrentProduct,
  useUpdateProduct,
} from "@/app/(handlers)/product/product";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useFetchUserStore } from "@/app/(handlers)/auth-handlers/auth";

const Page = () => {
  const params = useParams();

  const id = params?.id as string;
  const { product, isLoading } = useGetCurrentProduct(id);
  const { store, isLoading: fetchingsTore } = useFetchUserStore();
  console.log(product);
  const [liveState, setLiveState] = useState<boolean | null>(null);

  useEffect(() => {
    if (product) {
      setLiveState(product.live);
    }
  }, [product]);
  const { mutateAsync, isPending } = useUpdateProduct(id);
  // Mock data for products, media, and reviews
  // const product: Product = {
  //   name: "Sample Product",
  //   description: "This is a great product that does amazing things.",
  //   price: 99,
  //   category: "NA",
  //   image: ["/assets/login.jpg", "/assets/login.jpg", "/assets/login.jpg"],
  //   videos: [],
  //   stock: 1,
  //   discountedPrice: 0,
  //   rating: 3,
  // };

  const handleUpdate = async () => {
    if (liveState === null) return;

    const newLiveValue = !liveState;
    setLiveState(newLiveValue); // optimistic toggle

    try {
      const payload = {
        ...product,
        storeId: store.store.id,
        live: newLiveValue,
      };
      await mutateAsync(payload);
    } catch (err: any) {
      toast.error("Failed to update product", err);
      setLiveState(!newLiveValue); // rollback
    }
  };

  const reviews = [
    { user: "John Doe", rating: 5, comment: "Amazing product!" },
    { user: "Jane Smith", rating: 4, comment: "Good, but could be better." },
  ];

  return (
    <div className="flex flex-col w-full gap-10 p-6">
      <div className="flex w-full mx-auto items-center gap-2 justify-end">
        <p
          className={clsx(
            " font-medium uppercase  px-3 py-1 rounded-md",
            product?.live ? "bg-black text-white " : "bg-black/50 text-gray-700"
          )}
        >
          {" "}
          Live Product
        </p>
        {!product ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Switch
            className="cursor-pointer"
            checked={liveState ?? false}
            onCheckedChange={handleUpdate}
            disabled={isLoading || isPending}
          />
        )}
      </div>
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Main Section */}
        <div className=" w-full lg:w-4/5 mx-auto">
          {/* Product Display */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <PoductSec />

            {/* Media and Promote */}
            <MediaSec />
          </div>

          {/* Orders */}
          <div className="mt-10 p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Orders</h3>
            <p>No orders placed yet.</p>
          </div>

          {/* Reviews */}
          <div className="mt-10 p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Reviews</h3>
            <div>
              {reviews.map((review, index) => (
                <div key={index} className="mb-4 border-b pb-4">
                  <p className="font-semibold">{review.user}</p>
                  <div className="flex gap-1 items-center text-yellow-500">
                    {Array(review.rating)
                      .fill(null)
                      .map((_, idx) => (
                        <span key={idx} className="text-xl">
                          ★
                        </span>
                      ))}
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="w-full lg:w-1/5">
          {/* Inventory */}
          <div className="mb-10 p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Inventory</h3>
            <p>In stock: 20 units</p>
          </div>

          {/* Performance */}
          <div className="mb-10 p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Performance</h3>
            <p>Sales this month: $1200</p>
            <p>Customer satisfaction: 95%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
