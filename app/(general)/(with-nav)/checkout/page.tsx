/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/stores/cart-store";
import { Package, ArrowLeft, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, useMemo } from "react";
import { AddressSelection } from "./components/address-selection";
import {
  useCheckUserExists,
  useCreatePendingUser,
  useResendOTP,
  useFetchUser,
} from "@/app/(handlers)/auth-handlers/auth";
import { toast } from "sonner";
import Skeleton from "../../_compoenents/skeleton";
import ShippingInformation from "./components/shipping-information";
import AddressSelectionMain from "./components/dress-selection-main";
import ContactSelectionMain from "./components/contact-selection-main";
import { isValidNigerianNumber } from "@/app/utils/valid-nigerian-number";
import { useCreateOrder } from "@/app/(handlers)/orders";
import { useCreateTemporalUser } from "@/app/(handlers)/temporal-user";
import { Contact } from "@/constants/types";
import { useCreateOrderWithTemporalUser } from "@/app/(handlers)/orders/queries";
import { generatePurchaseId } from "./utils/get-purchase-id";
import { useInitializePaystackPayment } from "@/app/(handlers)/paystack/queries";
// Removed verification panel in favor of anonymous checkout flow

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressDescription?: string;
}

const CheckoutPage = () => {
  const searchParams = useSearchParams();
  const activeStore = searchParams.get("store");
  const {
    items,
    getItemsByStore,
    clearCart,
    _hasHydrated,
    getItemPrice,
    getItemTotalPrice,
  } = useCartStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Session & details state
  const { user, isLoading: isUserLoading } = useFetchUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [distanceResults, setDistanceResults] = useState<Record<string, any>>(
    {}
  );
  // Address selection state
  const [showAddressSelection, setShowAddressSelection] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null); // For future use in order processing

  const [contactManually, setContactManually] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    sub_contact_phone: "",
    sub_contact_email: "",
  });

  const [addressManually, setAddressManually] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria",
    addressDescription: "",
  });

  // Contact selection state
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [latLon, setLatLon] = useState({
    lat: "",
    lon: "",
  });

  const { mutateAsync: createOrder, isPending: creatingOrder } =
    useCreateOrder();
  const { mutateAsync: createOrderTemp, isPending: creatingOrderTemp } =
    useCreateOrderWithTemporalUser();
  const {
    mutateAsync: initializePaystackPayment,
    isPending: isInitializingPaystackPayment,
  } = useInitializePaystackPayment();
  const { mutateAsync: createPendingUser, isPending: isCreatingUser } =
    useCreatePendingUser();

  // Convert items object to array for easier mapping
  const cartItems = Object.values(items);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + getItemTotalPrice(item);
    }, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Keep address selection aligned with mode
  useEffect(() => {
    if (user) {
      setShowAddressSelection(true);
    } else {
      setShowAddressSelection(false);
      setSelectedAddress(null);
    }
  }, [user]);

  const shippingFee: number = useMemo(
    () =>
      Object.values(distanceResults).reduce(
        (acc, distance) => acc + parseFloat(distance.cost),
        0
      ),
    [distanceResults]
  );

  const handleCompleteOrder = async (isEscrow: boolean = false) => {
    if (user) {
      if (!email || !firstName || !lastName) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Validate address
      if (
        !selectedAddress &&
        (!addressManually.street ||
          !addressManually.city ||
          !addressManually.state ||
          !addressManually.postalCode ||
          !addressManually.country)
      ) {
        toast.error("Please add a shipping address");
        return;
      }
      const purchaseId = generatePurchaseId();
      // Get grouped cart items by store
      const itemsByStore = getItemsByStore(); // {storeId: [items...]}

      const createdOrders: any[] = [];

      for (const [storeId, items] of Object.entries(itemsByStore)) {
        const orderItems = items.map((item: any) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.discounted_price ?? item.product.price ?? 0,
        }));
        const shippingRes = distanceResults[storeId];
        let shippingPayload;
        if (shippingRes.type === "zone") {
          shippingPayload = {
            zone_id: shippingRes.zone_id,
            zone_name: shippingRes.zone_name,
            fee: parseFloat(shippingRes.cost),
          };
        } else {
          shippingPayload = {
            distance: parseFloat(shippingRes.distance),
            fee: parseFloat(shippingRes.cost),
          };
        }
        try {
          let createdOrder;

          if (!user) {
            // Temporary user order
            createdOrder = await createOrderTemp({
              store_id: Number(storeId),
              order_items: orderItems,
              deliveryMode: "store" as const,
              sales_means: "ONLINE" as const,
              contact: {
                id: selectedContact?.ID as string,
                ...contactManually,
              },
              paymentstatus: false,
              address: {
                id: selectedAddress?.id as string,
                ...addressManually,
              },
              temporal_user: {
                email: contactManually.email,
                first_name: contactManually.first_name,
                last_name: contactManually.last_name,
                phone: contactManually.phone,
              },
              shipping: shippingPayload,
              purhase_id: purchaseId,
              isEscrow,
            });
          } else {
            // Logged-in user order
            createdOrder = await createOrder({
              store_id: Number(storeId),
              order_items: orderItems,
              deliveryMode: "store" as const,
              sales_means: "ONLINE" as const,
              contact: {
                id: selectedContact?.ID as string,
              },
              paymentstatus: false,
              address: {
                id: selectedAddress?.id as string,
              },
              shipping: shippingPayload,
              purhase_id: purchaseId,
              isEscrow,
            });
          }

          createdOrders.push(createdOrder);
        } catch (err: any) {
          console.error(`❌ Failed to create order for store ${storeId}`, err);
          toast.error(
            `Order for store ${storeId} failed: ${
              err?.response?.data?.error || err.message
            }`
          );
          // keep going (don’t crash all)
        }
      }

      if (createdOrders.length === 0) {
        toast.error("No orders could be created");
        return;
      }

      // 🚀 Redirect to checkout with the first successful order
      // router.push(
      //   `/checkout/success?orderId=${
      //     createdOrders[0]?.id ?? createdOrders[0]?.order_id
      //   }`
      // );
      if (user && !user.Email) {
        toast.error("Please add your email to your account");
        return;
      }
      if (!user && !contactManually.email) {
        toast.error("Please add your email to your account");
        return;
      }
      if (!user && !contactManually.first_name && !contactManually.last_name) {
        toast.error("Please add your name to make this order");
        return;
      }
      const userDetails = user
        ? {
            id: user.id,
            name: user.Name ?? user.name,
            email: user.Email,
          }
        : {
            email: contactManually.email,
            name: `${contactManually.first_name} ${contactManually.last_name}`,
          };
      const orderIds = createdOrders.map((o) => o.id ?? o.order_id).join(",");
      clearCart();
      const paystackResponse = await initializePaystackPayment({
        order_id: createdOrders[0].id,
        purchase_id: purchaseId,
        email: userDetails.email!,
        customer_name: userDetails.name,
        subaccount: createdOrders[0].sub_account_code,
        callback_url: `${window.location.origin}/checkout/success?orderIds=${orderIds}`,
      });
      if (paystackResponse.status === "success") {
        router.push(paystackResponse.data.authorization_url);
        setIsProcessing(false);
        return;
      } else {
        toast.error(paystackResponse.message || "Something went wrong");
        setIsProcessing(false);
        return;
      }
    } catch (error: unknown) {
      console.error(error, "error");
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddressSelected = (address: Address) => {
    setSelectedAddress(address);
  };

  const handleNewAddressAdded = (address: Address) => {
    setSelectedAddress(address);
  };

  const handleContactSelected = (contact: Contact) => {
    setSelectedContact(contact);
    // Auto-fill form fields with contact information
    setFirstName(contact.FirstName);
    setLastName(contact.LastName);
    setEmail(contact.Email);
    setPhone(contact.Phone);
  };

  const handleNewContactAdded = (contact: Contact) => {
    setSelectedContact(contact);
    // Auto-fill form fields with contact information
    setFirstName(contact.FirstName);
    setLastName(contact.LastName);
    setEmail(contact.Email);
    setPhone(contact.Phone);
  };

  const disabled = () => {
    if (isProcessing || isCreatingUser) {
      return true;
    }
    if (
      !selectedAddress && // if no saved address
      (!addressManually.street ||
        !addressManually.city ||
        !addressManually.state ||
        !addressManually.postalCode ||
        !addressManually.country)
    ) {
      return true;
    }
    if (
      !selectedContact && // if no saved address
      (!contactManually.email ||
        !contactManually.first_name ||
        !contactManually.last_name ||
        !contactManually.phone)
    ) {
      return true;
    }
    if (user) {
      if (!phone || !isValidNigerianNumber(phone)) {
        return true;
      }
    }
    if (!user) {
      if (
        !contactManually.phone ||
        !isValidNigerianNumber(contactManually.phone)
      ) {
        return true;
      }
    }

    return false;
  };
  const isAddressIncomplete = () => {
    return (
      !selectedAddress &&
      (!addressManually.street ||
        !addressManually.city ||
        !addressManually.state ||
        !addressManually.postalCode ||
        !addressManually.country)
    );
  };

  const shippingFeeIncluded = () => {
    if (shippingFee < 1) return false;
    return true;
  };
  const isButtonDisabled = () => {
    return (
      isProcessing ||
      isCreatingUser ||
      isAddressIncomplete() ||
      disabled() ||
      !shippingFeeIncluded()
    );
  };
  const canUseEscrow = () => {
    const distinctStoreLength = Object.keys(getItemsByStore()).length;
    if (distinctStoreLength === 1) {
      return true;
    } else {
      return false;
    }
  };
  const getButtonLabel = () => {
    if (isProcessing || isCreatingUser) return "Processing...";

    if (isAddressIncomplete()) return "Add Address to Continue";

    if (
      !selectedContact &&
      (!contactManually.email ||
        !contactManually.first_name ||
        !contactManually.last_name ||
        !contactManually.phone)
    ) {
      return "Add Contact to Continue";
    }

    if (user) {
      if (!phone || !isValidNigerianNumber(phone)) {
        return "Enter Valid Phone Number";
      }
    } else {
      if (
        !contactManually.phone ||
        !isValidNigerianNumber(contactManually.phone)
      ) {
        return "Enter Valid Phone Number";
      }
    }

    if (!shippingFeeIncluded()) return "Select Shipping Option";

    return "Checkout";
  };

  if (!_hasHydrated) {
    return (
      <div className="flex flex-col w-[90%] mx-auto px-5 lg:px-10 py-[calc(10vh+50px)] gap-10">
        {/* Header */}
        <div className="flex flex-col w-full gap-3">
          <Skeleton className="h-10 w-1/3 rounded-lg" />
          <Skeleton className="h-6 w-1/2 rounded-lg" />
        </div>

        {/* Content area: 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
          {/* Left column */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-1/2 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-4/5 rounded-md" />
            </div>
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-1/2 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-3/4 rounded-md" />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-1/2 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-4/5 rounded-md" />
            </div>
            <div className="flex flex-col gap-4">
              <Skeleton className="h-6 w-1/2 rounded-md" />
              <Skeleton className="h-10 w-full rounded-md" />
              <Skeleton className="h-10 w-3/4 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (cartItems.length === 0 && !isUserLoading) {
    return (
      <div className="min-h-screen bg-primary w-[90%] mx-auto px-5 lg:px-10 py-[calc(10vh+50px)]">
        <div className="max-w-2xl mt-20 mx-auto text-center">
          <Card className="p-8">
            <CardContent className="space-y-6">
              <Package className="w-20 h-20 mx-auto text-zinc-400" />
              <h2 className="text-3xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-zinc-500 mb-6">
                Add some products to your cart before checkout
              </p>
              <Link href="/">
                <Button className="px-8 py-3 text-lg">Continue Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary w-[90%] mx-auto px-5 lg:px-10 py-[calc(10vh+50px)]">
      <div className="flex gap-1 items-center mb-8">
        <Link
          href={activeStore ? "/cart?store=" + activeStore : "/cart"}
          className="flex items-center gap-2 text-zinc-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Cart</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {/* Shipping Information */}

            {/* <ShippingInformation
              phone={phone}
              setPhone={setPhone}
              email={email}
              firstName={firstName}
              lastName={lastName}
              setEmail={setEmail}
              setFirstName={setFirstName}
              setLastName={setLastName}
              handleEmailChange={handleEmailChange}
            /> */}
            <ContactSelectionMain
              email={email}
              onContactSelected={handleContactSelected}
              onNewContactAdded={handleNewContactAdded}
              setContactManually={setContactManually}
              contactManually={contactManually}
            />
            <AddressSelectionMain
              handleAddressSelected={handleAddressSelected}
              handleNewAddressAdded={handleNewAddressAdded}
              addressManually={addressManually}
              setAddressManually={setAddressManually}
              setLatLon={setLatLon}
              latLon={latLon}
              setDistanceResults={setDistanceResults}
              distanceResults={distanceResults}
            />
          </div>

          {/* Right Column - Order Review */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-2xl">Order Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => {
                  const price = getItemPrice(item);
                  const totalPrice = getItemTotalPrice(item);

                  // Helper function to render variant details
                  const renderVariantDetails = () => {
                    if (!item.variant) return null;

                    const variantDetails = [];
                    if (item.variant.Size)
                      variantDetails.push(`Size: ${item.variant.Size}`);
                    if (item.variant.Color)
                      variantDetails.push(`Color: ${item.variant.Color}`);
                    if (item.variant.Material)
                      variantDetails.push(`Material: ${item.variant.Material}`);
                    if (item.variant.Dimensions)
                      variantDetails.push(
                        `Dimensions: ${item.variant.Dimensions}`
                      );

                    if (variantDetails.length === 0) return null;

                    return (
                      <p className="text-xs text-zinc-400">
                        {variantDetails.join(" • ")}
                      </p>
                    );
                  };

                  return (
                    <div
                      key={item.cartItemId}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        {renderVariantDetails()}
                        <p className="text-sm text-zinc-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span className="font-semibold">
                        ₦{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  );
                })}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span>₦{getTotalPrice().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      ₦{shippingFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-xl pt-2 border-t">
                    <span>Total</span>
                    <span>
                      ₦
                      {(
                        getTotalPrice() + parseFloat(shippingFee.toFixed(2))
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
              <div className=" !w-full gap-3  px-4 flex flex-col">
                <Button
                  className="!w-full py-6 text-lg font-semibold"
                  onClick={() => handleCompleteOrder()}
                  disabled={isButtonDisabled()}
                >
                  {getButtonLabel()}
                </Button>
                {canUseEscrow() && (
                  <Button
                    className=" bg-green-800  !w-full py-6 text-lg font-semibold"
                    onClick={() => handleCompleteOrder(true)}
                    disabled={isButtonDisabled()}
                  >
                    Checkout (Escrow Protected)
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
