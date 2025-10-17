import React from "react";
import {
  useFetchSimilarProducts,
  useFetchStore
} from "@/app/(handlers)/general/general";
import ProductCard from "@/app/(protected)/_components/product-card";
import { useParams } from "next/navigation";
import Skeleton from "@/app/(general)/_compoenents/skeleton";

const YouMightLike = () => {
  const { pid, id } = useParams<{ pid: string; id: string }>();
  const { data: storeData } = useFetchStore(id as string);
  const { data: similarProducts, isLoading } = useFetchSimilarProducts(
    pid as string
  );
  console.log(storeData, "store");
  if (isLoading) {
    return (
      <div className="flex flex-col items-center w-full justify-center gap-10 mt-20">
        <h1 className="text-5xl text-center">You might also like</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 w-full">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col gap-3">
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!similarProducts || similarProducts.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center w-full justify-center gap-10 mt-20">
      <h1 className="text-5xl text-center">You might also like</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {similarProducts.slice(0, 4).map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            storeName={id as string}
            isAdmin={false}
          />
        ))}
      </div>
    </div>
  );
};

export default YouMightLike;
