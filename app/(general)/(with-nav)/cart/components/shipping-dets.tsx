"use client";

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { shippingAPI } from "@/app/(handlers)/shipping/api";
import { useCartStore } from "@/stores/cart-store";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Truck, Clock } from "lucide-react";
import { ShippingConfig } from "@/constants/types";

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

const ShippingDetailsOrder = () => {
  const { items } = useCartStore();
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

  useEffect(() => {
    if (storeIds.length === 0) return;
    (async () => {
      try {
        const configs: StoreConfig[] = [];
        for (const id of storeIds) {
          const res = await shippingAPI.getStoreConfig(id);
          if (!res) return;
          configs.push({ storeId: id, config: res });
        }
        setStoreConfigs(configs);
      } catch (err) {
        console.error("Failed to fetch shipping configs", err);
      }
    })();
  }, [JSON.stringify(storeIds)]);

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

  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Shipping Details</h2>
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
              </div>
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
