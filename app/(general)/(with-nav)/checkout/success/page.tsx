/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCartStore } from "@/stores/cart-store";
import { CheckCircle, Truck, Package, Home, Copy } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useFetchUser } from "@/app/(handlers)/auth-handlers/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetOrderById } from "@/app/(handlers)/orders";
import { useGetOrdersByIds } from "./use-fetch-orders";
import SuccessPageSkeleton from "./components/success-page";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // const orderIdParam = searchParams.get("orderId");
  const orderIdsParam = searchParams.get("orderIds");
  const orderIds = useMemo(() => {
    if (!orderIdsParam) return [];
    return orderIdsParam
      .split(",")
      .map((id) => Number(id))
      .filter(Boolean);
  }, [orderIdsParam]);

  const { data: orders, loading } = useGetOrdersByIds(orderIds);

  const { _hasHydrated } = useCartStore();
  const { user, isLoading } = useFetchUser();

  const orderItems = orders?.flatMap((order) => order.order_items) ?? [];
  const orderTotal = orders?.reduce((acc, order) => acc + order.total, 0) ?? 0;
  console.log(
    orders.flatMap((o) => o?.order_items),
    "orders"
  );
  // useEffect(() => {
  //   // If orderId is invalid or request errored/no data, redirect to checkout
  //   if (!orderIdParam || Number.isNaN(orderIdNumber)) {
  //     router.replace("/checkout");
  //     return;
  //   }

  //   if (!isPending && (isError || !order)) {
  //     router.replace("/checkout");
  //     return;
  //   }

  //   // Clear the cart after a successful order loads
  //   if (!isPending && order) {
  //     clearCart();
  //   }
  // }, [
  //   orderIdParam,
  //   orderIdNumber,
  //   isPending,
  //   isError,
  //   order,
  //   router,
  //   clearCart
  // ]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(orders[0].purhase_id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  if (!_hasHydrated || isLoading) return <SuccessPageSkeleton />;

  return (
    <div className="min-h-screen bg-primary w-[90%] mx-auto px-5 lg:px-10 py-[calc(10vh+50px)]">
      <div className="max-w-2xl mx-auto text-center">
        <Card className="p-8">
          <CardContent className="space-y-6">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            {/* Success Message */}
            <div>
              <h1 className="text-3xl font-bold mb-2">Order Complete!</h1>
              <p className="text-zinc-500 text-lg">
                Thank you for your purchase. Your order has been confirmed and
                will be processed shortly.
              </p>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl shadow-md bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg">
              <span className="truncate font-black">
                Purchase ID: {orders[0]?.purhase_id}
              </span>
              <Button
                variant="secondary"
                size="icon"
                className="ml-2 text-black bg-white hover:bg-gray-100 rounded-full"
                onClick={handleCopy}
              >
                <Copy className="h-5 w-5" />
              </Button>
              {copied && (
                <span className="ml-3 text-sm font-medium">Copied!</span>
              )}
            </div>
            {/* Order Details */}
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <h4 className="font-semibold mb-3">Order Summary</h4>
              {loading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ) : (
                <>
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="space-y-2 border-y py-3 border-gray-400 text-sm"
                    >
                      <div className="flex justify-between">
                        <span>Order ID:</span>
                        <span className="font-medium">#{order?.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className="font-medium capitalize">
                          {order?.status ?? order?.orderStatus ?? "processing"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Order Total:</span>
                        <span className="font-semibold">
                          ₦{orderTotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Items:</span>
                        <span>
                          {order?.order_items?.length ?? "NA"} product(s)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span className="text-green-600">Free</span>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Order Items */}
            {!loading && orderItems.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <h4 className="font-semibold mb-3">Items</h4>
                <div className="space-y-3">
                  {orderItems.map((it) => (
                    <div
                      key={`${it.productID}-${it.name}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex-1 pr-4">
                        <p className="font-medium line-clamp-1">
                          {it?.Product?.Name ?? "NA"}
                        </p>
                        <p className="text-zinc-500">
                          Qty: {it.quantity ?? it.Quantity}
                        </p>
                      </div>
                      <div className="font-semibold">
                        ₦{(it.price ?? it.UnitPrice ?? 0).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shipping Info */}
            {/* <div className="flex items-center justify-center gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <span>Free shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>2-3 business days</span>
              </div>
            </div> */}

            {/* Action Buttons */}
            <div className="flex lg:flex-row flex-col-reverse gap-4 justify-center pt-4">
              <Link href="/">
                <Button className="px-8 py-3 text-lg">
                  <Home className="w-5 h-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              {!loading && user && (
                <Button
                  variant="outline"
                  className="px-8 py-3 text-lg"
                  onClick={() =>
                    router.push(`/public-dashboard/${orders[0]?.purhase_id}`)
                  }
                >
                  Track Order
                </Button>
              )}
              {!user && !loading && (
                <Button
                  onClick={() => router.push(`/public-dashboard`)}
                  className="px-8 py-3 text-lg"
                >
                  Track Order
                </Button>
              )}
            </div>

            {/* Additional Info */}
            <div className="text-sm text-zinc-500 pt-4 border-t">
              <p>
                You will receive an email confirmation with your order details
                shortly.
              </p>
              <p className="mt-2">
                Need help? Contact our support team at support@Kuipid.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SuccessPage;
