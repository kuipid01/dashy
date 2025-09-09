/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import {
  Package,
  Calendar,
  User,
  MapPin,
  DollarSign,
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import OrderDetails from "./order-details";
import UpdateOrderDialog from "./update-order-dialog";
import { Order } from "@/constants/types";
import Link from "next/link";

export interface LatestOrdersProps {
  orders: Order[];
  onViewOrder?: (order: Order) => void;
  onUpdateStatus?: (orderId: number, newStatus: string) => void;
  isLoading: boolean;
}

export const LatestOrdersSkeletonRow = () => {
  return (
    <TableRow className="animate-pulse">
      <TableCell className="py-4 px-2">
        <div className="h-4 w-10 bg-gray-200 rounded-md"></div>
      </TableCell>
      <TableCell className="py-4 px-2">
        <div className="flex flex-col gap-1">
          <div className="h-4 w-28 bg-gray-200 rounded-md"></div>
          <div className="h-3 w-36 bg-gray-200 rounded-md"></div>
        </div>
      </TableCell>
      <TableCell className="py-4 px-2">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-md bg-gray-200"></div>
          <div className="flex flex-col gap-1">
            <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
            <div className="h-3 w-16 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </TableCell>
      <TableCell className="py-4 px-2">
        <div className="h-4 w-16 bg-gray-200 rounded-md"></div>
      </TableCell>
      <TableCell className="py-4 px-2">
        <div className="h-4 w-20 bg-gray-200 rounded-md"></div>
      </TableCell>
      <TableCell className="py-4 px-2">
        <div className="h-4 w-16 bg-gray-200 rounded-md"></div>
      </TableCell>
      <TableCell className="py-4 px-2">
        <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
      </TableCell>
      <TableCell className="py-4 px-2">
        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
      </TableCell>
    </TableRow>
  );
};
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return <Clock size={14} />;
    case "processing":
      return <Package size={14} />;
    case "shipped":
      return <Truck size={14} />;
    case "delivered":
      return <CheckCircle size={14} />;
    case "cancelled":
      return <XCircle size={14} />;
    default:
      return <Clock size={14} />;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};

export default function LatestOrders({
  orders,
  onViewOrder,
  onUpdateStatus,
  isLoading
}: LatestOrdersProps) {
  const SKELETON_ROW_COUNT = 5; // You can adjust this number
  const [detailsOrderId, setDetailsOrderId] = React.useState<number | null>(
    null
  );
  const [updateOrderId, setUpdateOrderId] = React.useState<number | null>(null);

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    onUpdateStatus?.(orderId, newStatus);
  };

  return (
    <div className="bgblur p-6 rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="size-12 rounded-full bg-[#ffffffcd] hover:bg-[#e6e3df] backdrop-blur-3xl grid place-items-center text-gray-600">
            <Package size={20} className="text-black" />
          </div>
          <h2 className="text-xl font-bold text-black">Latest Orders</h2>
        </div>

        <div className="text-sm text-gray-500">
          {isLoading ? (
            <div className="h-4 w-16 bg-gray-200 rounded-md animate-pulse"></div>
          ) : (
            `${orders.length} orders`
          )}
        </div>
      </div>

      {/* Table */}
      <Table className="bg-primary rounded-[20px] p-5">
        <TableHeader>
          <TableRow className="border-gray-200 px-3">
            <TableHead className="py-4 px-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <Package size={14} />
                <span>Order ID</span>
              </div>
            </TableHead>
            <TableHead className="py-4 px-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <User size={14} />
                <span>Customer</span>
              </div>
            </TableHead>
            <TableHead className="py-4 px-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <Package size={14} />
                <span>Products</span>
              </div>
            </TableHead>
            <TableHead className="py-4 px-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <DollarSign size={14} />
                <span>Total</span>
              </div>
            </TableHead>
            <TableHead className="py-4 px-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <MapPin size={14} />
                <span>Delivery</span>
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
                <span>Status</span>
              </div>
            </TableHead>
            <TableHead className="py-4 px-2">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
                <span>Actions</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Render skeletons when loading is true
            Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
              <LatestOrdersSkeletonRow key={index} />
            ))
          ) : orders.length > 0 ? (
            // Render actual data when not loading and orders exist
            orders.map((order, index) => (
              <TableRow key={order.id || index} className="transition-colors">
                <TableCell className="py-4 px-2">
                  <span className="text-sm font-medium text-gray-900">
                    #{order.id}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {order?.user?.Name || "N/A"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {order.user?.Email || "No contact info"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    {order.orderItems && order.orderItems.length > 0 && (
                      <Image
                        src="/assets/login.jpg"
                        alt={order.orderItems[0].name}
                        width={32}
                        height={32}
                        className="size-8 rounded-md object-cover"
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {order.orderItems && order.orderItems.length > 0
                          ? order.orderItems[0].name
                          : "No items"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {order.orderItems?.length || 0} items
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-2">
                  <span className="text-sm font-semibold text-gray-900">
                    ₦{order.total?.toFixed(2) || "0.00"}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-2">
                  <span className="text-sm text-gray-600 capitalize">
                    {order.deliveryMode || "N/A"}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-2">
                  <span className="text-sm text-gray-600">
                    {formatDate(
                      order.placedAt ||
                        order.placed_at ||
                        new Date().toISOString()
                    )}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setDetailsOrderId(order.id)}
                      >
                        <Eye size={14} className="mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setUpdateOrderId(order.id)}
                      >
                        <Calendar size={14} className="mr-2" />
                        Update Status
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusUpdate(order.id, "processing")
                        }
                        disabled={order.status === "processing"}
                      >
                        <Clock size={14} className="mr-2" />
                        Mark Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(order.id, "shipped")}
                        disabled={order.status === "shipped"}
                      >
                        <Truck size={14} className="mr-2" />
                        Mark Shipped
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusUpdate(order.id, "delivered")
                        }
                        disabled={order.status === "delivered"}
                      >
                        <CheckCircle size={14} className="mr-2" />
                        Mark Delivered
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleStatusUpdate(order.id, "cancelled")
                        }
                        disabled={order.status === "cancelled"}
                      >
                        <XCircle size={14} className="mr-2" />
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {detailsOrderId === order.id && (
                    <OrderDetails
                      order={order}
                      isOpen={true}
                      setIsOpen={() => setDetailsOrderId(null)}
                    />
                  )}
                  {updateOrderId === order.id && (
                    <UpdateOrderDialog
                      order={order}
                      isOpen={true}
                      onOpenChange={() => setUpdateOrderId(null)}
                    />
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            // Render empty state if no products are found after loading
            <TableRow>
              <TableCell colSpan={8} className="text-center py-12">
                <div className="size-16 rounded-full bg-gray-100 grid place-items-center mx-auto mb-4">
                  <Package size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">No orders found</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex mt-5 justify-center items-center">
        <Link
          className=" px-3 py-1 rounded-md border border-black flex gap-2"
          href="/orders"
        >
          See More Orders <ChevronRight />{" "}
        </Link>
      </div>
    </div>
  );
}
