import { useQuery } from "@tanstack/react-query"
import { Product } from "../types/product"
import { api } from "../base"





const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get(`/products`)
  return response.data
}
export const useFetchUserProducts = () => {
  const {
    data,
    isLoading,
    error,
    isError,
  } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    retry: 1,
  })

  return {
     data ,
    isLoading,
    error,
    isError,
  }
}