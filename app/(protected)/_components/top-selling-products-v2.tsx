/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trophy, ShoppingBag, Folder, List, Tag, Star } from "lucide-react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

// Type definitions for the new data structure
export interface ProductWithSales {
  Product: {
    ID: number;
    Name: string;
    Category: string;
    Image: string;
    Videos?: string | null;
    Description?: string | null;
    Stock?: number | null;
    Live: boolean;
    Price: number;
    DiscountedPrice?: number | null;
    Rating: number;
    StoreID: number;
    Store?: any;
    Tweets?: any;
    Variants?: any;
    DeletedAt?: string | null;
    Content?: any;
  };
  TotalSold: number;
}

interface TopSellingProductsV2Props {
  products: ProductWithSales[];
  onSortChange?: (sortBy: string) => void;
  sortBy?: string;
  isLoading: boolean;
}

export const TopSellingProductsV2SkeletonRow = () => {
  return (
    <TableRow className="animate-pulse">
      <TableCell className="py-4 px-2">
        <div className="h-4 w-6 bg-gray-200 rounded-md"></div>
      </TableCell>
      <TableCell className="py-4 px-2">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-md bg-gray-200"></div>
          <div className="h-4 w-32 bg-gray-200 rounded-md"></div>
        </div>
      </TableCell>
      <TableCell className="py-4 px-2">
        <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
      </TableCell>
      <TableCell className="py-4 px-2">
        <div className="h-4 w-16 bg-gray-200 rounded-md"></div>
      </TableCell>
      <TableCell className="py-4 px-2">
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
      </TableCell>
      <TableCell className="py-4 px-2">
        <div className="h-4 w-12 bg-gray-200 rounded-md"></div>
      </TableCell>
    </TableRow>
  );
};

// Helper function to get the first image from comma-separated string
const getFirstImage = (imageString: string): string => {
  return imageString.split(",")[0] || "";
};

// Helper function to format price
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0
  }).format(price);
};

// Helper function to get stock status
const getStockStatus = (stock: number | null, live: boolean) => {
  if (!live) return { text: "Offline", className: "bg-gray-100 text-gray-600" };
  if (stock === null || stock === 0)
    return { text: "Out of Stock", className: "bg-red-100 text-red-800" };
  if (stock < 10)
    return { text: "Low Stock", className: "bg-yellow-100 text-yellow-800" };
  return { text: "In Stock", className: "bg-green-100 text-green-800" };
};

export default function TopSellingProductsV2({
  products,
  isLoading
}: TopSellingProductsV2Props) {
  const SKELETON_ROW_COUNT = 5;

  return (
    <div className="bgblur w-full p-6 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full bg-[#ffffffcd] hover:bg-[#e6e3df] backdrop-blur-3xl grid place-items-center text-gray-600">
            <Trophy size={20} className="text-black" />
          </div>
          <h2 className="text-xl font-bold text-black">Top Selling Products</h2>
        </div>
      </div>

      {/* Table */}
      <Table className="bg-primary rounded-[20px] p-5">
        <TableHeader>
          <TableRow className="border-gray-200 px-3">
            <TableHead className="py-4 px-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <div className="size-4 rounded bg-gray-100 grid place-items-center">
                  <input type="checkbox" className="size-3" />
                </div>
                <span>Rank</span>
              </div>
            </TableHead>
            <TableHead className="py-4 px-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <ShoppingBag size={14} />
                <span>Product</span>
              </div>
            </TableHead>
            <TableHead className="py-4 px-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <Folder size={14} />
                <span>Category</span>
              </div>
            </TableHead>
            <TableHead className="py-4 px-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <Tag size={14} />
                <span>Price</span>
              </div>
            </TableHead>
            <TableHead className="py-4 px-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <List size={14} />
                <span>Status</span>
              </div>
            </TableHead>
            <TableHead className="py-4 px-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <Trophy size={14} />
                <span>Total Sold</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Render skeletons when loading is true
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
              <TopSellingProductsV2SkeletonRow key={index} />
            ))
          ) : products.length > 0 ? (
            // Render products when data is available
            products.map((item, index) => {
              const product = item.Product;
              const stockStatus = getStockStatus(
                product.Stock === undefined ? null : product.Stock,
                product.Live
              );
              const firstImage = getFirstImage(product.Image);
              const displayPrice = product.DiscountedPrice || product.Price;
              const hasDiscount =
                product.DiscountedPrice != null &&
                product.DiscountedPrice < product.Price;

              return (
                <TableRow
                  key={product.ID}
                  className="transition-colors hover:bg-gray-50"
                >
                  <TableCell className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">
                        #{index + 1}
                      </span>
                      {index < 3 && (
                        <Trophy
                          size={16}
                          className={`${
                            index === 0
                              ? "text-yellow-500"
                              : index === 1
                              ? "text-gray-400"
                              : "text-amber-600"
                          }`}
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={firstImage}
                          alt={product.Name}
                          width={40}
                          height={40}
                          className="size-10 rounded-md object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/placeholder-product.png"; // fallback image
                          }}
                        />
                        {!product.Live && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              OFF
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.Name}
                        </p>
                        {product.Rating > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            <Star
                              size={12}
                              className="text-yellow-400 fill-current"
                            />
                            <span className="text-xs text-gray-500">
                              {product.Rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-2">
                    <span className="text-sm text-gray-600">
                      {product.Category}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-gray-900">
                        {formatPrice(displayPrice)}
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(product.Price)}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-2">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${stockStatus.className}`}
                    >
                      {stockStatus.text}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 px-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {item.TotalSold.toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            // Render empty state if no products are found after loading
            <TableRow>
              <TableCell colSpan={6} className="text-center py-12">
                <div className="size-16 rounded-full bg-gray-100 grid place-items-center mx-auto mb-4">
                  <ShoppingBag size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No products found</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
