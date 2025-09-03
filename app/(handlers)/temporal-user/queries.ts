/* eslint-disable @typescript-eslint/no-unused-vars */

"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { temporalUserAPI } from "./api";
import { 
  CreateTemporalUserRequest, 
  UpdateTemporalUserRequest, 
  LinkOrderToTemporalUserRequest 
} from "@/constants/types";

// Query Keys
export const temporalUserKeys = {
  all: ["temporal-users"] as const,
  byId: (id: number) => [...temporalUserKeys.all, "by-id", id] as const,
  byEmail: (email: string) => [...temporalUserKeys.all, "by-email", email] as const,
  withOrdersById: (id: number) => [...temporalUserKeys.all, "with-orders", "by-id", id] as const,
  withOrdersByEmail: (email: string) => [...temporalUserKeys.all, "with-orders", "by-email", email] as const,
};

// React Query Hooks
export const useCreateTemporalUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: temporalUserAPI.create,
    onSuccess: (data) => {
      // Invalidate and refetch temporal user queries
      queryClient.invalidateQueries({ queryKey: temporalUserKeys.all });
      // Optionally set the new data in cache
      queryClient.setQueryData(temporalUserKeys.byId(data.id), data);
    },
  });
};

export const useCreateOrGetTemporalUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: temporalUserAPI.createOrGet,
    onSuccess: (data) => {
      // Invalidate and refetch temporal user queries
      queryClient.invalidateQueries({ queryKey: temporalUserKeys.all });
      // Set the data in cache
      queryClient.setQueryData(temporalUserKeys.byId(data.id), data);
      queryClient.setQueryData(temporalUserKeys.byEmail(data.email), data);
    },
  });
};

export const useGetTemporalUserByID = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: temporalUserKeys.byId(id),
    queryFn: () => temporalUserAPI.getById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetTemporalUserByEmail = (email: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: temporalUserKeys.byEmail(email),
    queryFn: () => temporalUserAPI.getByEmail(email),
    enabled: enabled && !!email,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetTemporalUserWithOrders = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: temporalUserKeys.withOrdersById(id),
    queryFn: () => temporalUserAPI.getWithOrdersById(id),
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for orders data)
  });
};

export const useGetTemporalUserWithOrdersByEmail = (email: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: temporalUserKeys.withOrdersByEmail(email),
    queryFn: () => temporalUserAPI.getWithOrdersByEmail(email),
    enabled: enabled && !!email,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for orders data)
  });
};

export const useUpdateTemporalUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTemporalUserRequest }) => 
      temporalUserAPI.update(id, data),
    onSuccess: (data) => {
      // Update cache for both ID and email queries
      queryClient.setQueryData(temporalUserKeys.byId(data.id), data);
      queryClient.setQueryData(temporalUserKeys.byEmail(data.email), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: temporalUserKeys.withOrdersById(data.id) });
      queryClient.invalidateQueries({ queryKey: temporalUserKeys.withOrdersByEmail(data.email) });
    },
  });
};

export const useDeleteTemporalUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: temporalUserAPI.delete,
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: temporalUserKeys.byId(id) });
      queryClient.removeQueries({ queryKey: temporalUserKeys.withOrdersById(id) });
      // Invalidate all temporal user queries
      queryClient.invalidateQueries({ queryKey: temporalUserKeys.all });
    },
  });
};

export const useLinkOrderToTemporalUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: temporalUserAPI.linkOrder,
    onSuccess: (_, variables) => {
      // Invalidate orders-related queries for the temporal user
      queryClient.invalidateQueries({ 
        queryKey: temporalUserKeys.withOrdersById(variables.temporalUserId) 
      });
      // Invalidate all temporal user queries to ensure consistency
      queryClient.invalidateQueries({ queryKey: temporalUserKeys.all });
    },
  });
};
