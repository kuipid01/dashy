/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import ReviewsList from "./reviews/review-list";
import SearchAndFilters from "./search/search-filter";
import { ProductGrid } from "./products/product-grid";
import StoreContentsSlider from "../components/store-contents-slider";
import StoreTopProducts from "../components/store-top-products";
import StoreImageCollage from "../components/store-image-collage";
import StoreProductsByCategory from "../components/store-products-by-category";

export const LeftSection = ({ userStore }: { userStore?: any }) => {
  const [filters, setFilters] = useState({
    searchTerm: "",
    ratings: null as number | null,
    priceRange: null as [number, number] | null,
    category: ""
  });

  return (
    <div className="p-4 md:p-6 _mt-[10vh] lg:p-8 min-h-screen">
      <SearchAndFilters filters={filters} setFilters={setFilters} />
      <main className="mt-6">
        <h1 className="text-2xl mt-4 font-bold text-gray-900 mb-6">
          Store Products
        </h1>
        {userStore && userStore.id && (
          <ProductGrid id={userStore.id} filters={filters} />
        )}
      </main>
      <section className="mt-12  mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Customer Reviews
        </h2>
        {userStore?.id && <ReviewsList storeId={userStore.id} />}
      </section>
    </div>
  );
};
