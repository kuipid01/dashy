import { useQuery } from "@tanstack/react-query";
import { api } from "../base";
import { Product } from "../types/product";
import { Store } from "@/types/store";

const fetchStoreProducts = async (storeId:string): Promise<Product[]> => {
  const response = await api.get(`/store/products/${storeId}`);
//   console.log(response)
  return response.data;
};
const fetchStore = async (storeId:string): Promise<Store> => {
  const response = await api.get(`/store/${storeId}`);
//   console.log(response)
  return response.data.store;
};


export const useFetchStoreProducts = (storeId:string) => {
  const { data, isLoading, error, isError } = useQuery<Product[], Error>({
    queryKey: ["store-products", storeId],
    queryFn: ()  => fetchStoreProducts(storeId),
    retry: 1,
    enabled:!!storeId
  });

  return {
    data,
    isLoading,
    error,
    isError,
  };
};
export const useFetchStore = (storeId:string) => {
  const { data, isLoading, error, isError } = useQuery<Store, Error>({
    queryKey: ["store", storeId],
    queryFn: ()  => fetchStore(storeId),
    retry: 1,
    enabled:!!storeId
  });

  return {
    data,
    isLoading,
    error,
    isError,
  };
};