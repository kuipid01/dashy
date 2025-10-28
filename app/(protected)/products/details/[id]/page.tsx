"use client";

import React from "react";
import PoductSec from "./components/product-sec";
import ProductVariantManager from "./components/variant-manger";
import MediaSec from "./components/media-sec";
import { useParams } from "next/navigation";

const Page = () => {
  const { id } = useParams();
  // const [reviews] = useState([
  //   { user: "Jane Doe", rating: 4, comment: "Great product!" },
  //   { user: "John Smith", rating: 5, comment: "Excellent quality." }
  // ]);

  return (
    <div className="min-h-screen w-[95%] mx-auto px-2 md:px-5 lg:px-10 lg:py-[calc(10vh+50px)]">
      <div className="flex flex-col lg:flex-row gap-10 w-full">
        {/* Main Section */}
        <div className="w-full lg:w-3/5 flex flex-col gap-10">
          <PoductSec />

          {/* Orders */}
          {/* <div className="p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Orders</h3>
            <p>No orders placed yet.</p>
          </div> */}

          {/* Reviews */}
          {/* <div className="p-4 border rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">Reviews</h3>
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
          </div> */}
        </div>

        {/* Sidebar Section */}
        <div className="w-full lg:w-2/5 flex flex-col gap-10">
          <ProductVariantManager productId={Number(id)} />
          <MediaSec />

          {/* Inventory */}
        </div>
      </div>
    </div>
  );
};

export default Page;
