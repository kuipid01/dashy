import React from "react";
import Skeleton from "./skeleton";

const ProductLoadingSkeleton = ({ number }: { number: number }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: number || 5 }).map((_, index) => (
                <div className="flex flex-col gap-3" key={index}>
                    <Skeleton className="w-[350px] h-[250px]" />
                    <Skeleton className="w-[350px] h-[50px]" />
                </div>
            ))}
        </div>
    );
};

export default ProductLoadingSkeleton;
