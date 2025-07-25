import React from "react";

const OrderSkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse space-y-6 mr-6 p-6 bgblur rounded-lg shadow-md max-w-3xl mx-auto">
      {/* Header Section: Order ID and Status */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-48"></div> {/* Order ID */}
        <div className="h-6 bg-gray-200 rounded w-24"></div> {/* Status */}
      </div>

      {/* User and Store Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>{" "}
          {/* User Label */}
          <div className="h-5 bg-gray-300 rounded w-full mb-1"></div>{" "}
          {/* User Name */}
          <div className="h-4 bg-gray-200 rounded w-48"></div>{" "}
          {/* User Email/Phone (placeholder) */}
        </div>
        <div>
          <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>{" "}
          {/* Store Label */}
          <div className="h-5 bg-gray-300 rounded w-full mb-1"></div>{" "}
          {/* Store Name */}
          <div className="h-4 bg-gray-200 rounded w-48"></div>{" "}
          {/* Store Address (placeholder) */}
        </div>
      </div>

      {/* Order Items Section */}
      <div>
        <div className="h-5 bg-gray-200 rounded w-40 mb-4"></div>{" "}
        {/* Order Items Label */}
        {/* Loop for multiple order items */}
        {[...Array(3)].map(
          (
            _,
            i // Show 3 placeholder items
          ) => (
            <div
              key={i}
              className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
            >
              <div className="h-4 bg-gray-300 rounded w-3/5"></div>{" "}
              {/* Item Name */}
              <div className="h-4 bg-gray-200 rounded w-1/5"></div>{" "}
              {/* Item Quantity */}
              <div className="h-4 bg-gray-300 rounded w-1/5 text-right"></div>{" "}
              {/* Item Price */}
            </div>
          )
        )}
      </div>

      {/* Timestamps */}
      <div className="flex justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
        <div className="h-4 bg-gray-200 rounded w-40"></div> {/* Placed At */}
        <div className="h-4 bg-gray-200 rounded w-40"></div> {/* Updated At */}
      </div>
    </div>
  );
};

export default OrderSkeletonLoader;
