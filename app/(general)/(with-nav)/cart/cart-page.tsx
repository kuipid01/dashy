import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

import { useCartStore } from "@/stores/cart-store";
import {
  Minus,
  Plus,
  ShoppingCart,
  ChevronLeft,
  Store,
  Grid3X3
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import ShippingDetailsOrder from "./components/shipping-dets";
const CartPage = () => {
  const searchParams = useSearchParams();
  const activeStore = searchParams.get("store");
  const {
    items,
    updateItemQuantity,
    removeItem,
    groupedByStore,
    toggleGroupByStore,
    getItemsByStore
  } = useCartStore();

  console.log(activeStore, "activeStore");

  // Convert items object to array for easier mapping
  const cartItems = Object.values(items);

  // Get items grouped by store
  const itemsByStore = getItemsByStore();

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.discounted_price ?? item.product.price ?? 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getStoreTotal = (storeItems: typeof cartItems) => {
    return storeItems.reduce((total, item) => {
      const price = item.product.discounted_price ?? item.product.price ?? 0;
      return total + price * item.quantity;
    }, 0);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateItemQuantity(productId, newQuantity);
    }
  };

  const router = useRouter();

  // Render individual cart item
  const renderCartItem = (item: (typeof cartItems)[0]) => {
    const price = item.product.discounted_price ?? item.product.price ?? 0;
    const totalPrice = price * item.quantity;

    return (
      <Card key={item.product.id} className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Product Image */}
            <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src={(item.product.image?.[0] as string) || "/placeholder.svg"}
                alt={item.product.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-xl mb-2">{item.product.name}</h3>
              <p className="text-zinc-600 mb-2">{item.product.category}</p>
              {item.storeName && (
                <p className="text-sm text-blue-600 mb-2 flex items-center gap-1">
                  <Store size={14} />
                  {item.storeName}
                </p>
              )}
              <p className="font-bold text-lg">₦{price.toLocaleString()}</p>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-between rounded-full bg-gray-100 px-3 py-2 w-[140px] shadow-sm">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      String(item.product.id),
                      item.quantity - 1
                    )
                  }
                  className="p-1 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    handleQuantityChange(
                      String(item.product.id),
                      item.quantity + 1
                    )
                  }
                  className="p-1 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={18} />
                </button>
              </div>
            </div>

            {/* Total Price and Remove */}
            <div className="text-right">
              <p className="font-bold text-xl mb-3">
                ₦{totalPrice.toLocaleString()}
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(String(item.product.id))}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  return (
    <div className="min-h-screen bg-primary w-[90%] mx-auto px-5 lg:px-10 py-[calc(10vh+50px)]">
      <div className="flex gap-1 items-center mb-8 justify-between">
        {activeStore &&
          activeStore !== "0" &&
          activeStore !== null &&
          activeStore !== undefined && (
            <Link
              className="flex items-center gap-2 bg-[#b53a53] text-white p-2 rounded-md hover:text-white transition-colors"
              href={activeStore ? "/store/" + activeStore : "/"}
            >
              <ChevronLeft />
              Go To Store
            </Link>
          )}
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Your Cart</h1>

          <div className="flex gap-4 items-center">
            <Button
              variant="outline"
              onClick={toggleGroupByStore}
              className={cn(
                "px-4 shadow-md font-medium py-2",
                groupedByStore &&
                  "bg-general-primary border-general-primary text-general-primary-foreground"
              )}
            >
              {groupedByStore ? (
                <>
                  <Grid3X3 size={16} className="mr-2" />
                  Show All Items
                </>
              ) : (
                <>
                  <Store size={16} className="mr-2" />
                  Group by Store
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="px-6 shadow-md font-medium py-2"
              onClick={() => router.push("/discover")}
            >
              Shop Some Other Store
            </Button>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingCart className="w-20 h-20 mx-auto text-zinc-400 mb-6" />
              <h3 className="text-2xl font-semibold mb-3">
                Your cart is empty
              </h3>
              <p className="text-zinc-500 mb-6 text-lg">
                Add some products to get started
              </p>

              <div className="flex gap-4 flex-col">
                <Link href={activeStore ? "/store/" + activeStore : "/"}>
                  <Button className="px-8 py-3 text-lg">
                    Browse Store Products
                  </Button>
                </Link>
                <Link href={activeStore ? "/discover" : "/cart"}>
                  <Button className="px-8 py-3 text-lg">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {groupedByStore
                ? // Grouped by store view
                  Object.entries(itemsByStore).map(([storeId, storeItems]) => {
                    const storeName =
                      storeItems[0]?.storeName || `Store ${storeId}`;
                    const storeTotal = getStoreTotal(storeItems);
                    const storeItemCount = storeItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    );

                    return (
                      <Card key={storeId} className="overflow-hidden">
                        <CardHeader className="bg-general-primary border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Store
                                size={20}
                                className="text-general-primary"
                              />
                              <CardTitle className="text-xl">
                                {storeName}
                              </CardTitle>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-general-primary">
                                {storeItemCount} item
                                {storeItemCount !== 1 ? "s" : ""}
                              </p>
                              <p className="font-bold text-lg text-general-primary">
                                ₦{storeTotal.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="space-y-4 p-6">
                            {storeItems.map(renderCartItem)}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                : // Regular view - all items together
                  cartItems.map(renderCartItem)}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-2xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">
                      Subtotal ({getTotalItems()} items)
                    </span>
                    <span className="font-bold text-lg">
                      ₦{getTotalPrice().toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg">Shipping</span>
                    <ShippingDetailsOrder cart={cartItems} />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center font-bold text-2xl">
                      <span>Total</span>
                      <span>₦{getTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link
                    href={
                      activeStore
                        ? "/checkout?store=" + activeStore
                        : "/checkout"
                    }
                    className="w-full"
                  >
                    <Button className="w-full">Proceed to Checkout</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
