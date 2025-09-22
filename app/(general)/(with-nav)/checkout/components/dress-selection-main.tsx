/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Skeleton from "@/app/(general)/_compoenents/skeleton";
import React, { SetStateAction, Dispatch, useState, useEffect } from "react";
import { AddressSelection } from "./address-selection";
import { useFetchUser } from "@/app/(handlers)/auth-handlers/auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import ShippingDetailsOrder from "../../cart/components/shipping-dets";
import { COUNTRIES, NIGERIAN_STATES } from "@/constants/mock_data";
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

  setLatLon: Dispatch<
    SetStateAction<{
      lat: string;
      lon: string;
    }>
  >;
  latLon: {
    lat: string;
    lon: string;
  };
}

const AddressSelectionMain = ({
  handleNewAddressAdded,
  handleAddressSelected,
  addressManually,
  setAddressManually,
  setLatLon,
  latLon
}: MainProps) => {
  const [step, setSteps] = useState(1);
  // Session & details state
  const { user, isLoading: isUserLoading } = useFetchUser();
  console.log(latLon, "manual latLonk");

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Shipping Flow
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
            <>
              {step === 1 ? (
                <ShippingDetailsOrder
                  setLatLon={setLatLon}
                  latLon={latLon}
                  setSteps={setSteps}
                  setAddressManually={setAddressManually}
                  addressManually={addressManually}
                />
              ) : (
                <div className="space-y-4">
                  <div className=" bg-blue-600 w-fit font-bold uppercase text-white rounded-md px-3 py-1 text-xs">
                    Enter Street Address to help delivery drivers get to you
                    easily
                  </div>
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
                      {addressManually.state ? (
                        <Input
                          disabled={true}
                          id="state"
                          placeholder="Lagos State"
                          value={addressManually.state}
                        />
                      ) : (
                        <Select
                          onValueChange={(e) =>
                            setAddressManually({
                              ...addressManually,
                              state: e
                            })
                          }
                          value={addressManually.state}
                        >
                          <SelectTrigger className="h-12 px-4 focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500 block w-full text-sm rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500">
                            <SelectValue placeholder="Select a state" />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg border border-gray-200 dark:border-gray-700 max-h-60">
                            {NIGERIAN_STATES.map((state) => (
                              <SelectItem
                                key={state}
                                value={
                                  addressManually.state
                                    ? addressManually.state
                                    : state
                                }
                                className="hover:bg-blue-50 dark:hover:bg-gray-700"
                              >
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
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

                      <Select
                        disabled={true}
                        onValueChange={(e) =>
                          setAddressManually({
                            ...addressManually,
                            country: addressManually.country
                              ? addressManually.country
                              : e
                          })
                        }
                        value={
                          addressManually.country
                            ? addressManually.country
                            : COUNTRIES[0]
                        }
                      >
                        <SelectTrigger className="h-12 px-4 focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500 block w-full text-sm rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500">
                          <SelectValue placeholder="Select Country" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg border border-gray-200 dark:border-gray-700">
                          {COUNTRIES.map((country) => (
                            <SelectItem
                              key={country}
                              value={country}
                              className="hover:bg-blue-50 dark:hover:bg-gray-700"
                            >
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default AddressSelectionMain;
