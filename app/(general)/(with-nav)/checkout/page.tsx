/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCartStore } from "@/stores/cart-store";
import { Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { AddressSelection } from "./components/address-selection";
import {
  useCheckUserExists,
  useCreatePendingUser,
  useResendOTP,
  useFetchUser
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
  const { items } = useCartStore();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  // Session & details state
  const { user, isLoading: isUserLoading } = useFetchUser();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Address selection state
  const [showAddressSelection, setShowAddressSelection] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null); // For future use in order processing

  const [contactManually, setContactManually] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    sub_contact_phone: "",
    sub_contact_email: ""
  });

  const [addressManually, setAddressManually] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    addressDescription: ""
  });

  // Contact selection state
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [latLon, setLatLon] = useState({
    lat: "",
    lon: ""
  });
  const { mutateAsync: createOrder, isPending: creatingOrder } =
    useCreateOrder();
  const { mutateAsync: createOrderTemp, isPending: creatingOrderTemp } =
    useCreateOrderWithTemporalUser();

  const { mutateAsync: createPendingUser, isPending: isCreatingUser } =
    useCreatePendingUser();

  // Convert items object to array for easier mapping
  const cartItems = Object.values(items);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.product.discounted_price ?? item.product.price ?? 0;
      return total + price * item.quantity;
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

  // For guests, no verification panel; keep manual address form
  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (!user) {
      setShowAddressSelection(false);
      setSelectedAddress(null);
    }
  };

  const handleCompleteOrder = async () => {
    if (user) {
      if (!email || !firstName || !lastName) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    setIsProcessing(true);
    let createdOrder;
    try {
      // Validate address presence (either selected or manual filled)
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

      // Convert cart items to order items format
      const orderItems = cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.discounted_price ?? item.product.price ?? 0
      }));

      // If not logged in, create a temporary user record for the order
      if (!user) {
        console.log("JERERE ");
        try {
          createdOrder = await createOrderTemp({
            store_id: cartItems[0].storeId,
            order_items: orderItems,
            deliveryMode: "store" as const,
            sales_means: "ONLINE" as const,
            contact: {
              id: selectedContact?.ID as string,
              ...contactManually
            },
            paymentstatus: false,
            address: {
              id: selectedAddress?.id as string,
              ...addressManually
            },
            temporal_user: {
              email: contactManually.email,
              first_name: contactManually.first_name,
              last_name: contactManually.last_name,
              phone: contactManually.phone
            }
          });
        } catch (e: any) {
          toast.error(e.response.data.error);
          throw e.response.data.error;
          // Non-blocking: proceed even if pending user creation fails
        }
      } else {
        // Create order
        try {
          createdOrder = await createOrder({
            store_id: cartItems[0].storeId,
            order_items: orderItems,
            deliveryMode: "store" as const,
            sales_means: "ONLINE" as const,
            contact: {
              id: selectedContact?.ID as string
            },
            paymentstatus: false,
            address: {
              id: selectedAddress?.id as string
            }
          });
        } catch (error: any) {
          toast.error(error.response.data.error);
          throw error.response.data.error;
        }
      }

      //TODO:TRIGGER PAYMENT
      // TODO: create order and initiate payment here
      if (!createOrder) {
        return;
      }
      router.push(
        //@ts-expect-error
        `/checkout/success?orderId=${createdOrder?.id ?? createdOrder.order_id}`
      );
    } catch (error: unknown) {
      console.log(error, "error");
      const errorMessage =
        error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
      return;
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

  if (cartItems.length === 0) {
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
  console.log(
    selectedAddress,
    selectedContact,
    addressManually,
    phone,
    contactManually
  );
  const disabled = () => {
    console.log(selectedContact);
    if (isProcessing || isCreatingUser) {
      console.log("failed here 1");
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
      console.log("failed here 2");
      return true;
    }
    if (
      !selectedContact && // if no saved address
      (!contactManually.email ||
        !contactManually.first_name ||
        !contactManually.last_name ||
        !contactManually.phone)
    ) {
      console.log("failed here 3");
      return true;
    }
    if (user) {
      if (!phone || !isValidNigerianNumber(phone)) {
        console.log(phone);
        console.log("failed here 5 , rea");
        return true;
      }
    }
    if (!user) {
      if (
        !contactManually.phone ||
        !isValidNigerianNumber(contactManually.phone)
      ) {
        console.log(contactManually.phone);
        console.log("failed here 5 , manual");
        return true;
      }
    }

    return false;
  };
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
                  const price =
                    item.product.discounted_price ?? item.product.price ?? 0;
                  const totalPrice = price * item.quantity;

                  return (
                    <div
                      key={item.product.id}
                      className="flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">{item.product.name}</p>
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
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl pt-2 border-t">
                    <span>Total</span>
                    <span>₦{getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full py-6 text-lg font-semibold"
                  onClick={handleCompleteOrder}
                  disabled={disabled()}
                >
                  {isProcessing || isCreatingUser
                    ? "Processing..."
                    : !selectedAddress &&
                      (!addressManually.street ||
                        !addressManually.city ||
                        !addressManually.state ||
                        !addressManually.postalCode ||
                        !addressManually.country)
                    ? "Add Address to Continue"
                    : "Checkout"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
