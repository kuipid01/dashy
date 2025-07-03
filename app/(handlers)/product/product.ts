/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Product } from "../types/product";
import { api } from "../base";

const fetchProducts = async (): Promise<Product[]> => {
  const response = await api.get(`/products`);
  return response.data;
};
const fetchProduct = async (id: string | number): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};
const addProduct = async (product: Product): Promise<Product> => {
  const response = await api.post(`/products`, product);
  return response.data;
};
const updateProduct = async (
  id: string | number,
  product: Partial<Product>
): Promise<Product> => {
  const response = await api.put(`/products/${id}`, product);
  return response.data;
};
const uploadImage = async (images: File[]): Promise<any> => {
  const formData = new FormData();
  images.forEach((file) => formData.append("files", file));

  console.log([...formData.entries()]); // ✅ Confirm what you're sending

  const response = await api.post(`/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", //
    },
  });

  return response.data;
};

export const useFetchUserProducts = () => {
  const { data, isLoading, error, isError } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: fetchProducts,
    retry: 1,
  });

  return {
    data,
    isLoading,
    error,
    isError,
  };
};
export const useGetCurrentProduct = (id: string | number) => {
  const { data, isLoading, error, isError } = useQuery<Product, Error>({
    queryKey: ["product",id],
    queryFn: () => fetchProduct(id),
    retry: 1,
  });

  return {
    product: data,
    isLoading,
    error,
    isError,
  };
};

export const usePublishProducts = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (product: Product) => addProduct(product),
  });

  return {
    mutateAsync,
    isPending,
  };
};
export const useUpdateProduct = (id: string | number) => {
  const query = useQueryClient();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (product: Partial<Product>) => updateProduct(id, product),
    onSuccess: () => {
      query.invalidateQueries({ queryKey: ["product", id] });
      query.invalidateQueries({ queryKey: ["products"] });
    },
  });

  return {
    mutateAsync,
    isPending,
  };
};

export const useUploadImage = () => {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: (image: File[]) => uploadImage(image),
  });

  return {
    upload: mutateAsync,
    isPending,
  };
};
