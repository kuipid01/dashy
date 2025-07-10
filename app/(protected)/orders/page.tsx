"use client";
// import { MockOrders } from "@/constants/mock_data";
import { Order } from "@/constants/types";

import React from "react";
import OrderCard from "../_components/order-card";
import { useFetchStoreOrders } from "@/app/(handlers)/orders/orders";
import OrderSkeletonLoader from "../_components/order-skelton";

const Page = () => {
  const { data, isLoading } = useFetchStoreOrders();
  console.log(data);

  return (
    <div className=" flex flex-col gap-5 p-5 rounded-xl min-h-screen h-full w-full">
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 ">
        {isLoading ? (
          // Display skeleton loaders while loading
          [1, 2, 3, 4, 5].map((ske) => <OrderSkeletonLoader key={ske} />)
        ) : data && data.length > 0 ? (
          // Display OrderCards if data is available
          data.map((order: Order) => <OrderCard key={order.id} order={order} />)
        ) : (
          // Fallback for empty orders
          <div className="col-span-full flex flex-col items-center justify-center p-10 text-gray-500">
            {/* <img
              src="/images/empty-box.png" // **Replace with your actual image path**
              alt="No orders found"
              className="w-40 h-40 object-contain mb-6"
            /> */}
            <h2 className="text-2xl font-semibold mb-2">No Orders Yet!</h2>
            <p className="text-lg text-center">
              It looks like you haven&lsquo;t received any orders for your
              store.
            </p>
            <p className="text-md text-center mt-2">
              Start promoting your products to see orders appear here!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
