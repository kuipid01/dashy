import {
  Trophy,
  ShoppingBag,
  Calendar,
  Folder,
  List,
  Tag,
  ChevronDown
} from "lucide-react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

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
  products: TopSellingProduct[];
  onSortChange?: (sortBy: string) => void;
  sortBy?: string;
}

export default function TopSellingProducts({
  products,
  onSortChange,
  sortBy = "Total Sales"
}: TopSellingProductsProps) {
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

        <div className="relative ">
          <select
            value={sortBy}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent cursor-pointer"
          >
            <option value="Total Sales">Sort By</option>
            <option value="Total Sales">Total Sales</option>
            <option value="Date">Date</option>
            <option value="Category">Category</option>
            <option value="Stock">Stock</option>
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
          />
        </div>
      </div>

      {/* Table */}
      <Table className=" bg-primary rounded-[20px] p-5">
        <TableHeader>
          <TableRow className="border-gray-200  px-3">
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
                <Calendar size={14} />
                <span>Date</span>
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
        <TableBody className="">
          {products.map((product, index) => (
            <TableRow key={product.id || index} className=" transition-colors">
              <TableCell className="py-4 px-2">
                <span className="text-sm font-medium text-gray-900">
                  #{product.id}
                </span>
              </TableCell>
              <TableCell className="py-4 px-2">
                <div className="flex items-center gap-3">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={40}
                    height={40}
                    className="size-10 rounded-md object-cover"
                  />
                  <span className="text-sm font-medium text-gray-900 max-w-[200px] truncate">
                    {product.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4 px-2">
                <span className="text-sm text-gray-600">{product.date}</span>
              </TableCell>
              <TableCell className="py-4 px-2">
                <span className="text-sm text-gray-600">
                  {product.category}
                </span>
              </TableCell>
              <TableCell className="py-4 px-2">
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    product.stock === "In Stock"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock}
                </span>
              </TableCell>
              <TableCell className="py-4 px-2">
                <span className="text-sm font-semibold text-gray-900">
                  {product.totalSales.toLocaleString()}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Empty State */}
      {products.length === 0 && (
        <div className="text-center py-12">
          <div className="size-16 rounded-full bg-gray-100 grid place-items-center mx-auto mb-4">
            <ShoppingBag size={24} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No products found</p>
        </div>
      )}
    </div>
  );
}
