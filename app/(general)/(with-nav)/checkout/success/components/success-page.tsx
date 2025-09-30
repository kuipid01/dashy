"use client";

import Skeleton from "@/app/(general)/_compoenents/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const SuccessPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-primary w-[90%] mx-auto px-5 lg:px-10 py-[calc(10vh+50px)]">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="p-8">
          <CardContent className="space-y-6">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto" />

            {/* Success Message */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-2/3 mx-auto rounded-md" />
              <Skeleton className="h-5 w-3/4 mx-auto rounded-md" />
            </div>

            {/* Order Details */}
            <div className="bg-gray-50 p-4 rounded-lg text-left space-y-3">
              <Skeleton className="h-5 w-1/3 rounded-md" />
              <div className="space-y-2 text-sm">
                <Skeleton className="h-4 w-2/3 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <Skeleton className="h-4 w-1/3 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
                <Skeleton className="h-4 w-1/4 rounded-md" />
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 p-4 rounded-lg text-left space-y-3">
              <Skeleton className="h-5 w-1/3 rounded-md" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex-1 pr-4 space-y-2">
                      <Skeleton className="h-4 w-2/3 rounded-md" />
                      <Skeleton className="h-4 w-1/4 rounded-md" />
                    </div>
                    <Skeleton className="h-4 w-16 rounded-md" />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex lg:flex-row flex-col-reverse gap-4 justify-center pt-4">
              <Skeleton className="h-12 w-40 rounded-lg" />
              <Skeleton className="h-12 w-40 rounded-lg" />
            </div>

            {/* Additional Info */}
            <div className="text-sm text-zinc-500 pt-4 border-t space-y-2">
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessPageSkeleton;
