/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { refundAPI } from "./api";
import { toast } from "sonner";
import { CreateRefundRequest, UpdateRefundStatusRequest } from "@/constants/types";

// Query Keys
export const refundKeys = {
    all: ["refunds"] as const,
    lists: () => [...refundKeys.all, "list"] as const,
    list: (filters: Record<string, any>) => [...refundKeys.lists(), filters] as const,
    details: () => [...refundKeys.all, "detail"] as const,
    detail: (id: string) => [...refundKeys.details(), id] as const,
    stats: () => [...refundKeys.all, "stats"] as const,
    byOrder: (orderId: string) => [...refundKeys.all, "order", orderId] as const,
    byStore: (storeId: string) => [...refundKeys.all, "store", storeId] as const,
    byStatus: (status: string) => [...refundKeys.all, "status", status] as const,
};

// React Query Hooks

/**
 * Hook to create a new refund
 */
export const useCreateRefund = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: refundAPI.createRefund,
        onSuccess: (data) => {
            toast.success("Refund request created successfully");
            // Invalidate relevant queries to refetch data
            queryClient.invalidateQueries({ queryKey: refundKeys.lists() });
            queryClient.invalidateQueries({ queryKey: refundKeys.stats() });
            
            // If we have order/store info, invalidate those specific queries too
            if (data.data?.order_id) {
                queryClient.invalidateQueries({ 
                    queryKey: refundKeys.byOrder(data.data.order_id) 
                });
            }
            if (data.data?.store_id) {
                queryClient.invalidateQueries({ 
                    queryKey: refundKeys.byStore(data.data.store_id) 
                });
            }
        },
        onError: (error: unknown) => {
            console.error("Failed to create refund:", error);
            toast.error("Failed to create refund request. Please try again.");
        },
    });
};

/**
 * Hook to get all refunds with optional filters
 */
export const useGetAllRefunds = (params?: {
    page?: number;
    limit?: number;
    status?: string;
    store_id?: string;
    order_id?: string;
}) => {
    return useQuery({
        queryKey: refundKeys.list(params || {}),
        queryFn: () => refundAPI.getAllRefunds(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Hook to get refund statistics
 */
export const useGetRefundStats = () => {
    return useQuery({
        queryKey: refundKeys.stats(),
        queryFn: refundAPI.getRefundStats,
        staleTime: 2 * 60 * 1000, // 2 minutes - stats should be relatively fresh
    });
};

/**
 * Hook to get a specific refund by ID
 */
export const useGetRefund = (id: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: refundKeys.detail(id),
        queryFn: () => refundAPI.getRefund(id),
        enabled: enabled && !!id,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Hook to update refund status
 */
export const useUpdateRefundStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateRefundStatusRequest }) =>
            refundAPI.updateRefundStatus(id, data),
        onSuccess: (data, variables) => {
            toast.success(`Refund status updated to ${variables.data.status}`);
            
            // Update the specific refund in cache
            queryClient.setQueryData(refundKeys.detail(variables.id), data);
            
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: refundKeys.lists() });
            queryClient.invalidateQueries({ queryKey: refundKeys.stats() });
            
            // Invalidate order and store specific queries
            if (data.data?.order_id) {
                queryClient.invalidateQueries({ 
                    queryKey: refundKeys.byOrder(data.data.order_id) 
                });
            }
            if (data.data?.store_id) {
                queryClient.invalidateQueries({ 
                    queryKey: refundKeys.byStore(data.data.store_id) 
                });
            }
            if (data.data?.status) {
                queryClient.invalidateQueries({ 
                    queryKey: refundKeys.byStatus(data.data.status) 
                });
            }
        },
        onError: (error: unknown) => {
            console.error("Failed to update refund status:", error);
            toast.error("Failed to update refund status. Please try again.");
        },
    });
};

/**
 * Hook to delete a refund
 */
export const useDeleteRefund = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: refundAPI.deleteRefund,
        onSuccess: (data, refundId) => {
            toast.success("Refund deleted successfully");
            
            // Remove the refund from cache
            queryClient.removeQueries({ queryKey: refundKeys.detail(refundId) });
            
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: refundKeys.lists() });
            queryClient.invalidateQueries({ queryKey: refundKeys.stats() });
        },
        onError: (error: unknown) => {
            console.error("Failed to delete refund:", error);
            toast.error("Failed to delete refund. Please try again.");
        },
    });
};

/**
 * Hook to get refunds by order ID
 */
export const useGetRefundsByOrder = (
    orderId: string,
    params?: { page?: number; limit?: number },
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: [...refundKeys.byOrder(orderId), params || {}],
        queryFn: () => refundAPI.getRefundsByOrder(orderId, params),
        enabled: enabled && !!orderId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Hook to get refunds by store ID
 */
export const useGetRefundsByStore = (
    storeId: string,
    params?: { page?: number; limit?: number; status?: string },
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: [...refundKeys.byStore(storeId), params || {}],
        queryFn: () => refundAPI.getRefundsByStore(storeId, params),
        enabled: enabled && !!storeId,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Hook to get refunds by status
 */
export const useGetRefundsByStatus = (
    status: string,
    params?: { page?: number; limit?: number },
    enabled: boolean = true
) => {
    return useQuery({
        queryKey: [...refundKeys.byStatus(status), params || {}],
        queryFn: () => refundAPI.getRefundsByStatus(status, params),
        enabled: enabled && !!status,
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

/**
 * Hook to manually refresh refund data (useful for retry scenarios)
 */
export const useRefreshRefund = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: refundAPI.getRefund,
        onSuccess: (data, refundId) => {
            // Update cache with fresh data
            queryClient.setQueryData(refundKeys.detail(refundId), data);
            toast.success("Refund data refreshed");
        },
        onError: (error: unknown) => {
            console.error("Failed to refresh refund:", error);
            toast.error("Failed to refresh refund data. Please try again.");
        },
    });
};
