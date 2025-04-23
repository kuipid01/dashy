import React from "react";
import ReviewsList from "./reviews/review-list";
import SearchAndFilters from "./search/search-filter";
import { ProductGrid } from "./products/product-grid";

export const LeftSection = () => {
  return (
    <div className="p-4 md:p-6 _mt-[10vh] lg:p-8 min-h-screen">
      <SearchAndFilters />
      <main className="mt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Featured Products
        </h1>
        <ProductGrid />
      </main>
      <section className="mt-12 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Customer Reviews
        </h2>
        <ReviewsList />
      </section>
    </div>
  );
};
