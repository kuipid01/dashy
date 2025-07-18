import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../base";
import { Product } from "../types/product";
import { Store } from "@/types/store";
import { ProductVariant } from "@/constants/types";

const fetchStoreProducts = async (storeId: string): Promise<Product[]> => {
  const response = await api.get(`/store/products/${storeId}`);
  //   console.log(response)
  return response.data;
};
const fetchProduct = async (productId: string): Promise<Product> => {
  const response = await api.get(`/products/${productId}`);
  //   console.log(response)
  return response.data;
};
const fetchProductVariants = async (
  productId: number
): Promise<ProductVariant[]> => {
  const response = await api.get(`/variants/${productId}`);
  //   console.log(response)
  return response.data;
};
const createProductVariant = async (
  data: Omit<ProductVariant, "ID">
): Promise<ProductVariant> => {
  const response = await api.post(`/variant`, data);
  //   console.log(response)
  return response.data;
};
const updateProductVariant = async (
  data: Omit<ProductVariant, "ID">
): Promise<ProductVariant> => {
  const { VariantId, ...rest } = data;
  const response = await api.put(`/variants/${VariantId}`, rest);
  //   console.log(response)
  return response.data;
};
const deleteProductVariant = async (id: string): Promise<ProductVariant> => {
  const response = await api.delete(`/variants/${id}`);
  //   console.log(response)
  return response.data;
};
const fetchStore = async (storeId: string): Promise<Store> => {
  const response = await api.get(`/store/${storeId}`);
  //   console.log(response)
  return response.data.store;
};

export const useFetchStoreProducts = (storeId: string) => {
  const { data, isLoading, error, isError } = useQuery<Product[], Error>({
    queryKey: ["store-products", storeId],
    queryFn: () => fetchStoreProducts(storeId),
    retry: 1,
    enabled: !!storeId,
  });

  return {
    data,
    isLoading,
    error,
    isError,
  };
};
export const useFetchStore = (storeId: string) => {
  const { data, isLoading, error, isError } = useQuery<Store, Error>({
    queryKey: ["store", storeId],
    queryFn: () => fetchStore(storeId),
    retry: 1,
    enabled: !!storeId,
  });

  return {
    data,
    isLoading,
    error,
    isError,
  };
};
export const useFetchProduct = (productId: string) => {
  const { data, isLoading, error, isError } = useQuery<Product, Error>({
    queryKey: ["store", productId],
    queryFn: () => fetchProduct(productId),
    retry: 1,
    enabled: !!productId,
  });

  return {
    data,
    isLoading,
    error,
    isError,
  };
};
export const UseFetchProductVariants = (productId: number) => {
  const { data, isLoading, error, isError } = useQuery<ProductVariant[], Error>(
    {
      queryKey: ["variants"],
      queryFn: () => fetchProductVariants(productId),
      retry: 1,
      enabled: !!productId,
    }
  );

  return {
    data,
    isLoading,
    error,
    isError,
  };
};

export const useCreateVariant = () => {
  const query = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (variant: Omit<ProductVariant, "ID">) =>
      createProductVariant(variant),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["variant"] });
    },
  });

  return {
    mutateAsync,
    isPending,
  };
};
export const useUpdateVariant = () => {
  const query = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (variant: Omit<ProductVariant, "ID">) =>
      updateProductVariant(variant),
    onSuccess: (variables) => {
      query.invalidateQueries({ queryKey: ["variant", variables.variantId] });
      query.invalidateQueries({ queryKey: ["variant"] });
    },
  });

  return {
    mutateAsync,
    isPending,
  };
};
export const useDeleteProductVariant = () => {
  const query = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (id: string) =>
      deleteProductVariant(id),
    onSuccess: (variables) => {
      query.invalidateQueries({ queryKey: ["variant", variables.variantId] });
      query.invalidateQueries({ queryKey: ["variant", variables.id] });
    },
  });

  return {
    mutateAsync,
    isPending,
  };
};
