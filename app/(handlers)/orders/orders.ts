import { EarningsResponse, Order } from "@/constants/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../base";

const fetchOrders = async (): Promise<Order[]> => {
  console.log("here before")
  const response = await api.get(`/orders/me`);
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

export const useFetchStoreOrders = () => {
  const { data, isLoading, error, isError } = useQuery<Order[], Error>({
    queryKey: ["orders"],
    queryFn: fetchOrders,
    retry: 1,
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