import { Trophy, ShoppingBag, Folder, List, Tag } from "lucide-react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Product } from "@/constants/types";
import { imageToRenderImage } from "@/app/utils/get-image";

export interface TopSellingProduct {
  id: string;
  name: string;
  date: string;
  category: string;
  stock: "In Stock" | "Out Of Stock";
  totalSales: number;
  image: string;
}

interface TopSellingProductsProps {
  products: {
    productId: number;
    quantity: number;
    product: Product;
  }[];
  onSortChange?: (sortBy: string) => void;
  sortBy?: string;
  isLoading: boolean;
}

export const TopSellingProductsSkeletonRow = () => {
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
        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
      </TableCell>
      <TableCell className="py-4 px-2">
        <div className="h-4 w-12 bg-gray-200 rounded-md"></div>
      </TableCell>
    </TableRow>
  );
};

export default function TopSellingProducts({
  products,
  isLoading // Destructure the prop
}: TopSellingProductsProps) {
  const SKELETON_ROW_COUNT = 5; // You can adjust this number
  console.log(products);
  return (
    <div className="bgblur p-6 rounded-xl shadow-sm">
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
                <span>Id.no</span>
              </div>
            </TableHead>
            <TableHead className="py-4 px-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <ShoppingBag size={14} />
                <span>Product Name</span>
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
                <List size={14} />
                <span>Stock</span>
              </div>
            </TableHead>
            <TableHead className="py-4 px-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <Tag size={14} />
                <span>Total Sales</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Render skeletons when loading is true
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
              <TopSellingProductsSkeletonRow key={index} />
            ))
          ) : products.length > 0 ? (
            // Render products when data is available
            products.map((product, index) => (
              <TableRow
                key={product.productId || index}
                className="transition-colors"
              >
                <TableCell className="py-4 px-2">
                  <span className="text-sm font-medium text-gray-900">
                    #{index + 1}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-2">
                  <div className="flex items-center gap-3">
                    <Image
                      src={imageToRenderImage(product.product.Image) ?? ""}
                      alt={product.product.Name ?? "image alt"}
                      width={40}
                      height={40}
                      className="size-10 rounded-md object-cover"
                    />
                    <span className="text-sm font-medium text-gray-900 max-w-[200px] truncate">
                      {product?.product?.Name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-2">
                  <span className="text-sm text-gray-600">
                    {product.product.Category}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-2">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                      product?.product?.Stock && product?.product?.Stock > 0
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product?.product.Stock ?? 0}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {product.quantity.toLocaleString()}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            // Render empty state if no products are found after loading
            <TableRow>
              <TableCell colSpan={5} className="text-center py-12">
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
