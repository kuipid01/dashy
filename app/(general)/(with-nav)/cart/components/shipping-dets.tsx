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
import clsx from "clsx";
import AbstractedLocationManager from "./abstracted-location-manager";

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
  setAddressManually,
  step,
  setZonesPresent,
  zonesPresent,
  setDistanceResults,
  distanceResults
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
  setZonesPresent: React.Dispatch<React.SetStateAction<boolean>>;
  zonesPresent: boolean;
  setSteps: React.Dispatch<React.SetStateAction<number>>;
  step: number;
  setDistanceResults: Dispatch<SetStateAction<Record<string, any>>>;
  distanceResults: Record<string, any>;
}) => {
  const { items } = useCartStore();

  //states
  const [debouncedAddress, setDebouncedAddress] = useState("");
  const [valueAdress, setValueAdress] = useState("");
  const [address, setAddress] = useState("");
  const [storeConfigs, setStoreConfigs] = useState<StoreConfig[]>([]);
  const [userLocation, setUserLocation] = useState<LocationInput>({
    address: ""
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [zonesSelected, setZonesSelected] = useState<
    {
      storeId: string | number;
      zoneSelectedId: string;
      price?: number;
    }[]
  >([]);

  console.log(zonesSelected, "ZONES ELECTED");

  const cart = Object.values(items);

  const storeIds = useMemo(
    () => Array.from(new Set(cart.map((c) => c.storeId))),
    [cart]
  );

  const { setShippingFeeForStore, clearShippingFees, setShippingAddress } =
    useCartStore();

  console.log(distanceResults, "Distance Results");

  const handleSelectLocation = (location: Location) => {
    console.log(location, " LOCATION SELECTED");

    setValueAdress(location.display_name);
    setAddress("");
    setDebouncedAddress("");

    setLatLon({
      lat: location.lat,
      lon: location.lon
    });
    clearShippingFees();
    // persist to store (for checkout summary and next steps)
    setShippingAddress({
      city: location.address.city ?? "",
      state: location.address.state ?? "",
      country: location.address.country ?? "",
      lat: Number(location.lat),
      lon: Number(location.lon)
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
    setSteps(2);
    // Note: this will log the **old state**, not the just-updated one
  };

  const handleClearLocation = () => {
    setValueAdress("");
    setAddress("");
    setDebouncedAddress("");
    // Set fallback coordinates when clearing
  };
  // Use browser geolocation and reverse geocode to state/country
  const handleUseMyLocationNow = async () => {
    if (!navigator.geolocation) {
      console.warn("Geolocation is not supported by this browser.");
      return;
    }
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          setLatLon({ lat: String(latitude), lon: String(longitude) });

          // Reverse geocode via OSM Nominatim
          const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(
            latitude
          )}&lon=${encodeURIComponent(longitude)}&format=json&addressdetails=1`;
          const res = await fetch(url, {
            headers: { Accept: "application/json" }
          });
          const data = await res.json();
          const state = data?.address?.state ?? "";
          const country = data?.address?.country ?? "";
          const city =
            data?.address?.city ??
            data?.address?.town ??
            data?.address?.county ??
            "";

          setAddressManually({
            ...addressManually,
            state,
            country,
            city
          });

          setValueAdress(data?.display_name ?? "");
          setAddress("");
          setDebouncedAddress("");

          setShippingAddress({
            state,
            country,
            city,
            lat: latitude,
            lon: longitude
          });

          setSteps(2);
        } catch (err) {
          console.error("Reverse geocoding failed", err);
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (err) => {
        console.error("Geolocation error", err);
        setIsLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

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
        if (config.config.model !== "distance" && zonesPresent) continue;
        // Only auto-calc for distance-based stores
        console.log("WE GOT HERE FOR THE CONFIG", config);

        console.log("PASSED THE MODEL", config.config.model);
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
          estimatedDays: `${estimatedDays}-${estimatedDays + 1}`,
          type: "distance"
        };

        console.log(
          `📦 Shipping result for storeId ${config.storeId}:`,
          result
        );

        setDistanceResults((prev) => ({
          ...prev,
          [config.storeId]: result
        }));
        // also persist to store shipping fees
        try {
          setShippingFeeForStore(Number(config.storeId), Number(result.cost));
        } catch (e) {
          console.error("Failed to set shipping fee for store", e);
        }
      }
    } else {
      console.warn("⚠️ latLon is missing or invalid:", latLon);
    }
  }, [latLon]);

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

  console.log(distanceResults, "DISTANECE RESULTS");
  return (
    <div
      className={clsx(
        "space-y-4",
        step === 1
          ? " translate-y-0  "
          : " translate-y-[100%]  pointer-events-none invisible hidden"
      )}
    >
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
                {zonesPresent ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Available shipping zones for this store:
                    </p>
                    <div className="grid gap-3">
                      {storeConfig.config.zones?.map((zone) => {
                        // Check if zone already exists in zonesSelected
                        const selected = zonesSelected.find(
                          (z) =>
                            z.zoneSelectedId === zone.id &&
                            z.storeId === storeConfig.storeId
                        );

                        return (
                          <div
                            onClick={() => {
                              setZonesSelected((prev) => {
                                const exist = prev.find(
                                  (z) =>
                                    z.zoneSelectedId === zone.id &&
                                    z.storeId === storeConfig.storeId
                                );

                                if (exist) {
                                  // unselect if it's already selected
                                  return prev.filter(
                                    (z) =>
                                      !(
                                        z.zoneSelectedId === zone.id &&
                                        z.storeId === storeConfig.storeId
                                      )
                                  );
                                }

                                // replace any existing zone for this store with the new one
                                const withoutStore = prev.filter(
                                  (z) => z.storeId !== storeConfig.storeId
                                );

                                return [
                                  ...withoutStore,
                                  {
                                    storeId: storeConfig.storeId,
                                    zoneSelectedId: zone.id,
                                    price: zone.flat_fee ?? undefined
                                  }
                                ];
                              });

                              const result = {
                                type: "zone",
                                zone_id: zone.id,
                                zone_name: zone.name,
                                cost: zone.flat_fee.toFixed(2),
                                estimatedDays: zone.estimatedDays
                              };
                              setDistanceResults((prev) => ({
                                ...prev,
                                [storeConfig.storeId]: result
                              }));
                              if (storeIds.length === 1) {
                                //it means we can move to the next step
                                setSteps(2);
                              } else {
                                //we check if  all have distances results
                                for (const id of storeIds) {
                                  if (!distanceResults[id as number]) {
                                    return;
                                  }
                                }
                                setSteps(2);
                              }
                            }}
                            key={zone.id}
                            className={clsx(
                              "flex items-center justify-between p-3 border rounded-lg hover:bg-amber-400 cursor-pointer transition-colors",
                              selected ? " bg-amber-200" : " bg-none"
                            )}
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
                        );
                      }) || (
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
                        checked={zonesPresent}
                        onCheckedChange={() => setZonesPresent(!zonesPresent)}
                      />
                    </div>
                  </div>
                ) : (
                  <AbstractedLocationManager
                    address={address}
                    debouncedAddress={debouncedAddress}
                    gettingLocations={gettingLocations}
                    handleClearLocation={handleClearLocation}
                    handleSelectLocation={handleSelectLocation}
                    handleUseMyLocationNow={handleUseMyLocationNow}
                    isLoadingLocation={isLoadingLocation}
                    locations={locations}
                    setAddress={setAddress}
                    valueAdress={valueAdress}
                  />
                )}
              </>
            ) : (
              <div>
                {zonesPresent ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Enter your location to calculate shipping cost and
                      delivery time:
                    </p>

                    <AbstractedLocationManager
                      address={address}
                      debouncedAddress={debouncedAddress}
                      gettingLocations={gettingLocations}
                      handleClearLocation={handleClearLocation}
                      handleSelectLocation={handleSelectLocation}
                      handleUseMyLocationNow={handleUseMyLocationNow}
                      isLoadingLocation={isLoadingLocation}
                      locations={locations}
                      setAddress={setAddress}
                      valueAdress={valueAdress}
                    />

                    {distanceResults[storeConfig.storeId] && (
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Shipping Quote</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">
                              Distance:
                            </span>
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
                            <span className="text-muted-foreground">
                              Delivery:
                            </span>
                            <p className="font-medium">
                              {
                                distanceResults[storeConfig.storeId]
                                  .estimatedDays
                              }{" "}
                              days
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {storeConfig.config.storeLocation?.address && (
                      <div className="text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 inline mr-1" />
                        Store location:{" "}
                        {storeConfig.config.storeLocation.address}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p>Shipping price will be determined automatically. </p>
                  </div>
                )}
              </div>

              // Distance-based shipping
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
