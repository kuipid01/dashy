import React from "react";
import Skeleton from "./skeleton";

const ProductLoadingSkeleton = () => {
  return (
    <div className=" hover:border relative hover:scale-[1.02] transition-all duration-500 ease-in-out hover:border-gray-200 rounded-xl pb-3  overflow-hidden flex flex-col gap-3">
      <Skeleton className="w-full h-[250px]   " />
      <Skeleton className="w-full h-[50px]" />
    </div>
  );
};

export default ProductLoadingSkeleton;
