/* eslint-disable @typescript-eslint/no-explicit-any */
import { shippingAPI } from "@/app/(handlers)/shipping/api";
import { CartItem } from "@/stores/cart-store";
import React, { useEffect, useMemo, useState } from "react";

const ShippingDetailsOrder = ({ cart }: { cart: CartItem[] }) => {
  // Memoize storeIds so React doesn't think it's a new array every render
  const storeIds = useMemo(
    () => Array.from(new Set(cart.map((c) => c.storeId))),
    [cart]
  );

  const [storeConfigs, setStoreConfigs] = useState<
    { storeId: string | number; config: any }[]
  >([]);

  useEffect(() => {
    if (storeIds.length === 0) return;

    (async () => {
      try {
        const configs: { storeId: string | number; config: any }[] = [];
        for (const id of storeIds) {
          const res = await shippingAPI.getStoreConfig(id);
          configs.push({ storeId: id, config: res });
        }
        setStoreConfigs(configs);
      } catch (err) {
        console.error("Failed to fetch shipping configs", err);
      }
    })();
  }, [storeIds]);

  console.log("Store IDs:", storeIds);
  console.log("Store Configs:", storeConfigs);

  return <div>ShippingDetails</div>;
};

export default ShippingDetailsOrder;
