/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../base";
import { Product } from "../types/product";
import { Store } from "@/types/store";
import { ProductVariant } from "@/constants/types";
import {
  CreateStoreReviewRequest,
  StoreReview,
  StoreReviewStatsResponse,
} from "@/constants/types";

const fetchStoreProducts = async (
  storeId: string,
  filters?: {
    searchTerm?: string;
    ratings?: number | null;
    priceRange?: [number, number] | null;
    category?: string;
  }
): Promise<Product[]> => {
  const params: Record<string, any> = {};

  if (filters?.searchTerm) params.name = filters.searchTerm;
  if (filters?.ratings) params.ratings = filters.ratings;
  if (filters?.priceRange) {
    params.minPrice = filters.priceRange[0];
    params.maxPrice = filters.priceRange[1];
  }
  if (filters?.category) params.categories = filters.category;

  const response = await api.get(`/store/products/${storeId}`, { params });
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

const fetchSimilarProducts = async (
  productId: string
): Promise<Product[]> => {
  const response = await api.get(`/similar-products/${productId}`);
  return response.data;
};

// Store Reviews
export const createStoreReview = async (
  data: CreateStoreReviewRequest
): Promise<StoreReview> => {
  const response = await api.post(`/store-reviews`, data);
  return response.data;
};

export const fetchStoreReviews = async (
  storeId: number | string
): Promise<StoreReview[]> => {
  const response = await api.get(`/store-reviews/${storeId}`);
  return response.data;
};

export const fetchStoreReviewStats = async (
  storeId: number | string
): Promise<StoreReviewStatsResponse> => {
  const response = await api.get(`/store-reviews/${storeId}/stats`);
  return response.data;
};




export const useFetchStoreProducts = (
  storeId: string,
  filters?: {
    searchTerm?: string;
    ratings?: number | null;
    priceRange?: [number, number] | null;
    category?: string;
  }
) => {
  const { data, isLoading, error, isError } = useQuery<Product[], Error>({
    queryKey: ["store-products", storeId, filters], // include filters in key
    queryFn: () => fetchStoreProducts(storeId, filters),
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

export const useFetchSimilarProducts = (productId: string) => {
  const { data, isLoading, error, isError } = useQuery<Product[], Error>({
    queryKey: ["similar-products", productId],
    queryFn: () => fetchSimilarProducts(productId),
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
