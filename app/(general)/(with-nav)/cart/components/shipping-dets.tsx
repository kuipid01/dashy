/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { shippingAPI } from "@/app/(handlers)/shipping/api";
import { useCartStore } from "@/stores/cart-store";
import { SetStateAction, Dispatch, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Truck,
  Clock,
  Search,
  AlertCircle,
  CheckCircle2,
  X
} from "lucide-react";
import { Location, ShippingConfig } from "@/constants/types";
import { Switch } from "@/components/ui/switch";
import Skeleton from "@/app/(general)/_compoenents/skeleton";
import { useFetchLocations } from "@/app/(handlers)/externals/ng-data/ng-data";
import { InputComponent } from "@/app/(protected)/_components/input-component";

interface StoreConfig {
  storeId: string | number;
  config: ShippingConfig;
  storeName?: string;
}

interface LocationInput {
  address: string;
  lat?: number;
  lng?: number;
}

const ShippingDetailsOrder = ({
  setSteps,
  latLon,
  setLatLon,
  addressManually,
  setAddressManually
}: {
  latLon: {
    lat: string;
    lon: string;
  };
  setLatLon: Dispatch<
    SetStateAction<{
      lat: string;
      lon: string;
    }>
  >;
  setAddressManually: React.Dispatch<
    React.SetStateAction<{
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
      addressDescription: string;
    }>
  >;
  addressManually: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    addressDescription: string;
  };
  setSteps: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const { items } = useCartStore();
  const [zonePresent, setZonePresent] = useState(true);

  const cart = Object.values(items);

  const storeIds = useMemo(
    () => Array.from(new Set(cart.map((c) => c.storeId))),
    [cart]
  );

  const [storeConfigs, setStoreConfigs] = useState<StoreConfig[]>([]);
  const [userLocation, setUserLocation] = useState<LocationInput>({
    address: ""
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [distanceResults, setDistanceResults] = useState<Record<string, any>>(
    {}
  );

  const handleSelectLocation = (location: Location) => {
    console.log(location, " LOCATION SELECTED");

    setValueAdress(location.display_name);
    setAddress("");
    setDebouncedAddress("");

    setLatLon({
      lat: location.lat,
      lon: location.lon
    });
    localStorage.setItem(
      "location",
      JSON.stringify({
        lat: location.lat,
        lon: location.lon
      })
    );

    setAddressManually({
      ...addressManually,
      state: location.address.state ?? "",
      country: location.address.country ?? "",
      city: location.address.city ?? ""
    });
    // setSteps(2);
    // Note: this will log the **old state**, not the just-updated one
  };

  const handleClearLocation = () => {
    setValueAdress("");
    setAddress("");
    setDebouncedAddress("");
    // Set fallback coordinates when clearing
  };
  const [debouncedAddress, setDebouncedAddress] = useState("");
  const [valueAdress, setValueAdress] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setDebouncedAddress(address);
    }, 1000);

    return () => {
      clearTimeout(timeOut);
    };
  }, [address]);
  const { data: locations, isLoading: gettingLocations } = useFetchLocations(
    debouncedAddress ?? ""
  );

  useEffect(() => {
    if (storeIds.length === 0) return;
    (async () => {
      try {
        const configs: StoreConfig[] = [];
        for (const id of storeIds) {
          const res = await shippingAPI.getStoreConfig(id);
          if (!res) return;
          configs.push({
            storeId: id,
            config: {
              ...res,
              storeLocation: {
                lng: res.store.lon,
                lat: res.store.lat
              }
            }
          });
        }
        setStoreConfigs(configs);
      } catch (err) {
        console.error("Failed to fetch shipping configs", err);
      }
    })();
  }, [JSON.stringify(storeIds)]);

  // console.log(storeConfigs, "Store nfigs");

  const calculateDistanceShipping = async (storeConfig: StoreConfig) => {
    if (
      !userLocation.lat ||
      !userLocation.lng ||
      !storeConfig.config.storeLocation
    ) {
      return null;
    }

    setIsLoadingLocation(true);
    try {
      // Calculate distance (you'd implement actual distance calculation here)
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        storeConfig.config.storeLocation.lat,
        storeConfig.config.storeLocation.lng
      );

      const baseRate = storeConfig.config.base_fee || 5;
      const perKmRate = storeConfig.config.per_km || 0.5;
      const shippingCost = baseRate + distance * perKmRate;
      const estimatedDays = Math.ceil(distance / 50); // Rough estimate

      const result = {
        distance: distance.toFixed(1),
        cost: shippingCost.toFixed(2),
        estimatedDays: `${estimatedDays}-${estimatedDays + 1}`
      };

      setDistanceResults((prev) => ({
        ...prev,
        [storeConfig.storeId]: result
      }));

      return result;
    } catch (error) {
      console.error("Error calculating distance shipping:", error);
      return null;
    } finally {
      setIsLoadingLocation(false);
    }
  };
  const distances: number[] = [];
  useEffect(() => {
    console.log("🚀 useEffect triggered with latLon:", latLon);

    if (latLon.lat && latLon.lon) {
      for (const config of storeConfigs) {
        console.log("🔍 Checking config for storeId:", config.storeId);

        if (
          !config.config.storeLocation?.lat &&
          !config.config.storeLocation?.lng
        ) {
          console.warn(
            `⚠️ Skipping storeId ${config.storeId} - missing storeLocation`,
            config.config.storeLocation
          );
          return;
        }

        const distance = calculateDistance(
          parseFloat(latLon.lat),
          parseFloat(latLon.lon),
          Number(config.config.storeLocation?.lat),
          Number(config.config.storeLocation?.lng)
        );

        console.log(
          `📏 Distance for storeId ${config.storeId}:`,
          distance,
          "km"
        );

        const baseRate = config.config.base_fee || 5;
        const perKmRate = config.config.per_km || 0.5;

        // Log the key variables before the final calculation.
        console.log("💰 Shipping calculation details:", {
          baseRate: baseRate,
          perKmRate: perKmRate,
          distance: distance
        });

        const shippingCost = baseRate + distance * perKmRate;

        // Log the final calculated shipping cost.
        console.log("📦 Calculated shipping cost:", shippingCost.toFixed(2));

        const estimatedDays = Math.ceil(distance / 50); // Rough estimate

        // Log the final calculated estimated delivery days.
        console.log("🚚 Estimated delivery days:", estimatedDays);
        const result = {
          distance: distance.toFixed(1),
          cost: shippingCost.toFixed(2),
          estimatedDays: `${estimatedDays}-${estimatedDays + 1}`
        };

        console.log(
          `📦 Shipping result for storeId ${config.storeId}:`,
          result
        );

        setDistanceResults((prev) => ({
          ...prev,
          [config.storeId]: result
        }));
      }
    } else {
      console.warn("⚠️ latLon is missing or invalid:", latLon);
    }
  }, [latLon]);

  console.log(latLon);
  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    // Log the input coordinates for debugging.
    console.log("🧮 Calculating distance with inputs:", {
      userLat: lat1,
      userLng: lng1,
      storeLat: lat2,
      storeLng: lng2
    });

    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;

    // Log intermediate values to track the calculation.
    console.log("📐 Delta Lat/Lng (in radians):", { dLat, dLng });

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    // Log the 'a' variable, which is part of the Haversine formula.
    console.log("🔢 'a' value:", a);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    // Log the final calculated distance.
    console.log("✅ Final distance calculated:", distance, "km");

    return distance;
  };

  const handleLocationSubmit = async () => {
    if (!userLocation.address.trim()) return;

    setIsLoadingLocation(true);
    try {
      // In a real app, you'd use a geocoding service like Google Maps API
      // For demo purposes, we'll simulate coordinates
      const mockCoordinates = {
        lat: 40.7128 + (Math.random() - 0.5) * 0.1,
        lng: -74.006 + (Math.random() - 0.5) * 0.1
      };

      setUserLocation((prev) => ({
        ...prev,
        ...mockCoordinates
      }));

      // Calculate shipping for all distance-based stores
      const distanceStores = storeConfigs.filter(
        (store) => store.config.model === "distance"
      );
      for (const store of distanceStores) {
        await calculateDistanceShipping({
          ...store,
          config: {
            ...store.config,
            storeLocation: store.config.storeLocation || {
              lat: 40.7589 + (Math.random() - 0.5) * 0.2,
              lng: -73.9851 + (Math.random() - 0.5) * 0.2,
              address: `Store ${store.storeId} Location`
            }
          }
        });
      }
    } catch (error) {
      console.error("Error processing location:", error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  console.log(latLon, distanceResults);
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Stores Shipping Settings</h2>
      </div>

      {storeConfigs.map((storeConfig) => (
        <Card key={storeConfig.storeId} className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Store {storeConfig.storeId}
              <Badge variant="outline">
                {storeConfig.config.model === "zones"
                  ? "Zone-based"
                  : "Distance-based"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {storeConfig.config.model === "zones" ? (
              // Zone-based shipping

              <>
                {zonePresent ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Available shipping zones for this store:
                    </p>
                    <div className="grid gap-3">
                      {storeConfig.config.zones?.map((zone) => (
                        <div
                          key={zone.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium">{zone.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Regions: {zone.name}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm font-medium">
                              ₦{zone.flat_fee.toFixed(2)}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {zone.estimatedDays} days
                            </div>
                          </div>
                        </div>
                      )) || (
                        <p className="text-sm text-muted-foreground">
                          No zones configured
                        </p>
                      )}
                    </div>
                    <div className=" flex items-center gap-3">
                      <div className=" bg-amber-500 font-bold text-white rounded-md px-3 py-1 text-xs">
                        Your location doesn&#39;t fall into this zones ?? click
                        toggle button
                      </div>
                      <Switch
                        checked={zonePresent}
                        onCheckedChange={() => setZonePresent(!zonePresent)}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Address Search
                      </label>
                    </div>

                    <>
                      {/* Input shows if no location selected */}
                      {!valueAdress ? (
                        <div className="relative">
                          <InputComponent
                            label=""
                            placeholder="Enter your address to search..."
                            name="address"
                            value={address}
                            onChange={(e) => {
                              setAddress(e.target.value);
                            }}
                            className="h-12 pl-10 pr-4 focus:ring-2 focus:ring-blue-500 border border-gray-300 focus:border-blue-500 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                          />
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-between border border-green-200 dark:border-green-700 rounded-lg px-4 py-3 bg-green-50 dark:bg-green-900/20">
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            <span className="text-sm font-medium text-green-800 dark:text-green-200">
                              {valueAdress}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleClearLocation}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-full transition-colors duration-200"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}

                      {/* Suggestions */}
                      {gettingLocations ? (
                        <div className="space-y-2 mt-3">
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                            Searching for locations...
                          </div>
                          <div className="space-y-2">
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                          </div>
                        </div>
                      ) : (
                        <>
                          {locations?.length > 0 && debouncedAddress && (
                            <div className="relative mt-1">
                              <div className="absolute z-10 mt-2 w-full max-h-60 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
                                {locations.map((location: Location) => (
                                  <div
                                    key={location.display_name}
                                    className="cursor-pointer px-4 py-3 hover:bg-blue-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors duration-200"
                                    onClick={() => {
                                      console.log(
                                        "WE CLICKED THE THE ADD LOCATION BTN"
                                      );

                                      handleSelectLocation(location);
                                    }}
                                  >
                                    <div className="flex items-start gap-3">
                                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                          {location.display_name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                          {location.address.city},{" "}
                                          {location.address.state}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {locations?.length === 0 &&
                            debouncedAddress &&
                            !gettingLocations && (
                              <div className="flex items-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                                <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                <span className="text-sm text-yellow-800 dark:text-yellow-200">
                                  We could not find that location. Using state
                                  coordinates as fallback.
                                </span>
                              </div>
                            )}
                        </>
                      )}
                    </>
                  </div>
                )}
              </>
            ) : (
              // Distance-based shipping
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Enter your location to calculate shipping cost and delivery
                  time:
                </p>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <Label
                      htmlFor={`location-${storeConfig.storeId}`}
                      className="sr-only"
                    >
                      Your location
                    </Label>
                    <Input
                      id={`location-${storeConfig.storeId}`}
                      placeholder="Enter your address or location"
                      value={userLocation.address}
                      onChange={(e) =>
                        setUserLocation((prev) => ({
                          ...prev,
                          address: e.target.value
                        }))
                      }
                      disabled={isLoadingLocation}
                    />
                  </div>
                  <Button
                    onClick={handleLocationSubmit}
                    disabled={!userLocation.address.trim() || isLoadingLocation}
                  >
                    {isLoadingLocation ? "Calculating..." : "Calculate"}
                  </Button>
                </div>

                {distanceResults[storeConfig.storeId] && (
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Shipping Quote</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Distance:</span>
                        <p className="font-medium">
                          {distanceResults[storeConfig.storeId].distance} km
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cost:</span>
                        <p className="font-medium">
                          ${distanceResults[storeConfig.storeId].cost}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Delivery:</span>
                        <p className="font-medium">
                          {distanceResults[storeConfig.storeId].estimatedDays}{" "}
                          days
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {storeConfig.config.storeLocation && (
                  <div className="text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 inline mr-1" />
                    Store location: {storeConfig.config.storeLocation.address}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {storeConfigs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No shipping configurations found
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShippingDetailsOrder;
