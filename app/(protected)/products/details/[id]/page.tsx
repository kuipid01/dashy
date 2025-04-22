"use client";
import React, { useState } from "react";
import PoductSec from "./components/product-sec";
import MediaSec from "./components/media-sec";
import { Switch } from "@/components/ui/switch";
import clsx from "clsx";

const Page = () => {
  const [activeProduct, setActiveProduct] = useState(false);
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

  const reviews = [
    { user: "John Doe", rating: 5, comment: "Amazing product!" },
    { user: "Jane Smith", rating: 4, comment: "Good, but could be better." }
  ];

  return (
    <div className="flex flex-col w-full gap-10 p-6">
      <div className="flex w-full mx-auto items-center gap-2 justify-end">
        <p
          className={clsx(
            " font-medium uppercase  px-3 py-1 rounded-md",
            activeProduct ? "bg-black text-white " : "bg-black/50 text-gray-700"
          )}
        >
          {" "}
          Live Product
        </p>
        <Switch
          className=" cursor-pointer"
          checked={activeProduct}
          onCheckedChange={() => {
            setActiveProduct(!activeProduct);
          }}
        />
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
