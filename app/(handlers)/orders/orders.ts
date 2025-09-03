/* eslint-disable @typescript-eslint/no-unused-vars */
import { EarningsResponse, Order } from "@/constants/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../base";

// Legacy functions - keeping for backward compatibility
const fetchOrders = async (): Promise<Order[]> => {
  console.log("here before")
  const response = await api.get(`/orders/me`);
  return response.data.data;
};

const fetchOrdersForStore = async (id: string): Promise<Order[]> => {
  console.log("here before")
  const response = await api.get(`/orders/${id}/store`);
  return response.data.data;
};

const fetchStoreEarnings = async (): Promise<EarningsResponse> => {
  const response = await api.get(`/earning/me`);
  return response.data;
};

const updateOrderStatus = async ({ orderId, status }: { orderId: number; status: string }): Promise<Order> => {
  const response = await api.patch(`/orders/${orderId}/status`, { status });
  return response.data.data;
};

// Legacy hooks - keeping for backward compatibility
export const useFetchStoreOrders = (id: string) => {
  const { data, isLoading, error, isError } = useQuery<Order[], Error>({
    queryKey: ["orders"],
    queryFn: () => fetchOrdersForStore(id),
    retry: 1,
    enabled: !!id
  });

  return {
    data,
    isLoading,
    error,
    isError,
  };
};

export const useFetchStoreEarnings = () => {
  const { data, isLoading, error, isError } = useQuery<EarningsResponse, Error>({
    queryKey: ["earnings"],
    queryFn: fetchStoreEarnings,
    retry: 1,
  });

  return {
    data,
    isLoading,
    error,
    isError,
  };
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, { orderId: number; status: string }>({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      // Invalidate and refetch orders to get updated data
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (error) => {
      console.error("Failed to update order status:", error);
    },
  });
};

// Re-export new hooks from queries.ts for convenience
export {
  useCreateOrder,
  useGetMyOrders,
  useGetOrderById,
  useGetOrdersByStoreId,
  useGetOrderProducts,
  useUpdateOrder,
  useDeleteOrder,
  useLinkOrderToDeliveryOption,
} from "./queries";

// Re-export API functions for direct use
export { orderAPI } from "./api";