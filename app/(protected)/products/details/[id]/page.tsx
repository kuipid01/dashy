import ProductCard from "@/app/(protected)/_components/product-card";
import { Button } from "@/app/components/button";
import { Product } from "@/stores/product-store";
import React from "react";

const page = () => {
  // Mock data for products, media, and reviews
  const product: Product = {
    name: "Sample Product",
    description: "This is a great product that does amazing things.",
    price: 99,
    category: "NA",
    image: ["/assets/login.jpg", "/assets/login.jpg", "/assets/login.jpg"],
    videos: [],
    stock: 1,
    discountedPrice: 0,
    rating: 3,
  };

  const reviews = [
    { user: "John Doe", rating: 5, comment: "Amazing product!" },
    { user: "Jane Smith", rating: 4, comment: "Good, but could be better." },
  ];

  return (
    <div className="flex gap-10 p-6">
      {/* Main Section */}
      <div className="w-4/5">
        {/* Product Display */}
        <div className="grid grid-cols-2 gap-10">
          <ProductCard isAdmin={true} product={product} />

          {/* Media and Promote */}
          <div className="grid grid-cols-1 gap-10">
            <div className="border p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Media</h3>
              <div className="flex gap-4">
                {product.image.map((url, index) => (
                  <img
                    key={index}
                    src={url as string}
                    alt={`Media ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
            <div className="border p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Promote</h3>
              <Button text=" Promote Product" className=""/>
               
              
            </div>
          </div>
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
      <div className="w-1/5">
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

        {/* Settings */}
        <div className="p-4 border rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">Settings</h3>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Manage Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default page;
