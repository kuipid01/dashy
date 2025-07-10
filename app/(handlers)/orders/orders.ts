import { EarningsResponse, Order } from "@/constants/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "../base";




const fetchOrders = async (): Promise<Order[]> => {
  const response = await api.get(`/orders/me`);
  return response.data.orders;
};
const fetchStoreEarnings = async (): Promise<EarningsResponse> => {
  const response = await api.get(`/earning/me`);
  return response.data;
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