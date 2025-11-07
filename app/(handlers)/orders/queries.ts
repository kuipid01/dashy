/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orderAPI } from "./api";
import {
  UpdateOrderRequest,
  LinkOrderToDeliveryOptionRequest
} from "@/constants/types";
import { toast } from "sonner";

// Query Keys
export const orderKeys = {
  all: ["orders"] as const,
  myOrders: () => [...orderKeys.all, "me"] as const,
  byId: (id: number) => [...orderKeys.all, "by-id", id] as const,
  byStoreId: (storeId: number) => [...orderKeys.all, "by-store", storeId] as const,
  products: (id: number) => [...orderKeys.all, "products", id] as const,
};

// React Query Hooks
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderAPI.create,
    onSuccess: (data) => {
      // Invalidate and refetch order queries
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      // Set the new order in cache
      queryClient.setQueryData(orderKeys.byId(data.data.id), data);
      // Invalidate store orders if storeId is present
      if (data.data.storeId) {
        queryClient.invalidateQueries({ queryKey: orderKeys.byStoreId(data.data.storeId) });
      }
    },
  });
};
// React Query Hooks
export const useCreateOrderWithTemporalUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderAPI.createTemporalUser,
    onSuccess: (data) => {
      // Invalidate and refetch order queries
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      // Set the new order in cache
      queryClient.setQueryData(orderKeys.byId(data.data.id), data);
      // Invalidate store orders if storeId is present
      if (data.data.storeId) {
        queryClient.invalidateQueries({ queryKey: orderKeys.byStoreId(data.data.storeId) });
      }
    },
  });
};

export const useGetMyOrders = (enabled: boolean = true) => {
  return useQuery({
    queryKey: orderKeys.myOrders(),
    queryFn: orderAPI.getMyOrders,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetOrderById = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: orderKeys.byId(id),
    queryFn: () => orderAPI.getById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetOrdersByStoreId = (storeId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: orderKeys.byStoreId(storeId),
    queryFn: () => orderAPI.getByStoreId(storeId),
    enabled: enabled && !!storeId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetOrderProducts = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: orderKeys.products(id),
    queryFn: () => orderAPI.getProducts(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOrderRequest }) =>
      orderAPI.update(id, data),
    onSuccess: (data) => {
    
      //@ts-expect-error
      if (!data?.ID) return;
      toast.success("Order updated")
      // Update specific order cache
      queryClient.setQueryData(orderKeys.byId(data.id), data);

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: orderKeys.myOrders() });
      queryClient.invalidateQueries({ queryKey: orderKeys.all }); // make sure it's an array
      if (data.storeId) {
        queryClient.invalidateQueries({ queryKey: orderKeys.byStoreId(data.storeId) });
      }
    },
    onError: (error: any) => {
      console.error("Failed to update order:", error);
      toast.error("Failed to update order");
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: orderAPI.delete,
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: orderKeys.byId(id) });
      queryClient.removeQueries({ queryKey: orderKeys.products(id) });
      // Invalidate all order queries
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
};

export const useLinkOrderToDeliveryOption = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: LinkOrderToDeliveryOptionRequest }) =>
      orderAPI.linkToDeliveryOption(id, data),
    onSuccess: (data) => {
      // Update cache for the specific order
      queryClient.setQueryData(orderKeys.byId(data.id), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: orderKeys.myOrders() });
      if (data.storeId) {
        queryClient.invalidateQueries({ queryKey: orderKeys.byStoreId(data.storeId) });
      }
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
      orderAPI.updateStatus(orderId, status),
    onSuccess: (data) => {
      // Update cache for the specific order
      queryClient.setQueryData(orderKeys.byId(data.id), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: orderKeys.myOrders() });
      if (data.storeId) {
        queryClient.invalidateQueries({ queryKey: orderKeys.byStoreId(data.storeId) });
      }
    },
  });
};
