/* eslint-disable @typescript-eslint/no-explicit-any */
import { orderAPI } from "@/app/(handlers)/orders";
import { useEffect, useState } from "react";

export const useGetOrdersByIds = (orderIds: number[]) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderIds || orderIds.length === 0) return;

    const fetchOrders = async () => {
      try {
        const results = await Promise.all(
          orderIds.map((id) => orderAPI.getById(id))
        );
        setData(results);
      } catch (e) {
        console.error("Failed to fetch multiple orders", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orderIds]);

  return { data, loading };
};
