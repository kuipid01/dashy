"use client";

import Skeleton from "@/app/(general)/_compoenents/skeleton";

export default function ProductDetailSkeleton() {
    return (
        <div className="flex my-10 flex-col w-full lg:flex-row gap-10">
            {/* Product Image Section */}
            <div className="h-[650px] w-full lg:w-[45%] px-5 rounded-2xl relative overflow-hidden">
                <div className="grid absolute top-5 left-1/2 -translate-x-1/2 z-10 grid-cols-4 gap-2 rounded-2xl w-[80%] mx-auto">
                    {[1, 2, 3, 4].map((_, index) => (
                        <Skeleton key={index} className="h-[5px] flex-1 rounded bg-gray-300" />
                    ))}
                </div>

                <Skeleton className="absolute inset-0 rounded-2xl" />

                <div className="absolute w-[80%] z-10 bottom-2 left-1/2 -translate-x-1/2 space-x-5 grid-cols-3 grid">
                    {[1, 2, 3].map((_, index) => (
                        <Skeleton
                            key={index}
                            className="relative h-[150px] rounded-xl border-3 border-gray-300"
                        />
                    ))}
                </div>
            </div>

            {/* Product Details Section */}
            <div className="w-full lg:w-[45%] flex flex-col gap-3">
                <Skeleton className="w-[120px] h-[30px] rounded-full" />
                <Skeleton className="w-[70%] h-[40px] rounded-lg mt-5" />
                <Skeleton className="w-[30%] h-[20px] rounded-lg" />

                <Skeleton className="w-[100px] h-[10px] mt-3 rounded" />
                <div className="grid grid-cols-4 gap-2">
                    {["S", "M", "L", "XL"].map((_, index) => (
                        <Skeleton key={index} className="h-[45px] rounded-[30px]" />
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <Skeleton className="w-full h-[50px] rounded-[30px]" />
                    <Skeleton className="size-10 rounded-full" />
                </div>

                <div className="p-3 border border-gray-300 rounded-xl flex flex-col gap-3">
                    <Skeleton className="w-[120px] h-[20px] rounded-lg" />
                    <Skeleton className="w-[20px] h-[20px] rounded-full" />
                    <Skeleton className="w-full h-[80px] rounded-lg" />
                </div>

                <div className="p-3 border mt-5 border-gray-300 rounded-xl flex flex-col gap-3">
                    <Skeleton className="w-[120px] h-[20px] rounded-lg" />
                    <Skeleton className="w-[20px] h-[20px] rounded-full" />
                    <div className="grid grid-cols-2 gap-5">
                        {[1, 2, 3, 4].map((_, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Skeleton className="size-12 rounded-full" />
                                <div className="flex flex-col gap-1 w-full">
                                    <Skeleton className="w-[80%] h-[10px] rounded" />
                                    <Skeleton className="w-[60%] h-[15px] rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
