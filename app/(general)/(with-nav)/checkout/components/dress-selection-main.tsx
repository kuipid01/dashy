/* eslint-disable @typescript-eslint/no-explicit-any */
import Skeleton from "@/app/(general)/_compoenents/skeleton";
import React, { SetStateAction, Dispatch } from "react";
import { AddressSelection } from "./address-selection";
import { useFetchUser } from "@/app/(handlers)/auth-handlers/auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import ShippingDetailsOrder from "../../cart/components/shipping-dets";
interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  addressDescription?: string;
}
interface MainProps {
  handleNewAddressAdded: (address: Address) => void;
  handleAddressSelected: (address: Address) => void;
  addressManually: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    addressDescription: string;
  };
  setAddressManually: Dispatch<
    SetStateAction<{
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      addressDescription: string;
    }>
  >;
}

const AddressSelectionMain = ({
  handleNewAddressAdded,
  handleAddressSelected,
  addressManually,
  setAddressManually
}: MainProps) => {
  // Session & details state
  const { user, isLoading: isUserLoading } = useFetchUser();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Shipping Address
          </CardTitle>
        </CardHeader>
        {/* Shipping Address Section */}
        <CardContent className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-700"></h3>

          {/* Loading state while fetching user */}
          {isUserLoading && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24" /> {/* Label */}
                <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </div>
          )}

          {/* Case 2: Logged-in user choosing from saved addresses */}
          {user && !isUserLoading && (
            <AddressSelection
              email={(user as any).Email}
              onAddressSelected={handleAddressSelected}
              onNewAddressAdded={handleNewAddressAdded}
            />
          )}

          {/* Case 3: Manual address form (guest or custom mode) */}
          {!user && !isUserLoading && (
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  placeholder="123 Main St"
                  value={addressManually.street}
                  onChange={(e) =>
                    setAddressManually({
                      ...addressManually,
                      street: e.target.value
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="Lagos"
                    value={addressManually.city}
                    onChange={(e) =>
                      setAddressManually({
                        ...addressManually,
                        city: e.target.value
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    placeholder="Lagos"
                    value={addressManually.state}
                    onChange={(e) =>
                      setAddressManually({
                        ...addressManually,
                        state: e.target.value
                      })
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="100001"
                    value={addressManually.postalCode}
                    onChange={(e) =>
                      setAddressManually({
                        ...addressManually,
                        postalCode: e.target.value
                      })
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="Nigeria"
                    value={addressManually.country}
                    onChange={(e) =>
                      setAddressManually({
                        ...addressManually,
                        country: e.target.value
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="addressDescription">
                  Address Description (Optional)
                </Label>
                <Input
                  id="addressDescription"
                  placeholder="e.g., Near the blue gate"
                  value={addressManually.addressDescription}
                  onChange={(e) =>
                    setAddressManually({
                      ...addressManually,
                      addressDescription: e.target.value
                    })
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <ShippingDetailsOrder />
    </>
  );
};

export default AddressSelectionMain;
