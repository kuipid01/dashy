import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEarnings, getMyEarnings, getStoreEarnings, getPayoutOrders } from "./api";
import { EarningsQueryParams, PayoutOrdersResponse } from "./types";

/**
 * Hook to fetch current user's earnings data
 * @param params - Optional query parameters for filtering
 * @returns Query result with earnings data
 */
export const useEarnings = (params?: EarningsQueryParams) => {
  console.log(params, "PARAMS");
  return useQuery({
    queryKey: ["earnings", "me", params],
    queryFn: () => getMyEarnings(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch earnings data for a specific store
 * @param storeId - The store ID to fetch earnings for
 * @param params - Optional query parameters for filtering
 * @returns Query result with earnings data
 */
export const useStoreEarnings = (storeId: number, params?: EarningsQueryParams) => {
  return useQuery({
    queryKey: ["earnings", "store", storeId, params],
    queryFn: () => getStoreEarnings(storeId, params),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Payout orders hook
export const usePayoutOrders = (params?: { status?: "completed" | "pending"; page?: number; limit?: number; }) => {
  return useQuery<PayoutOrdersResponse>({
    queryKey: ["earnings", "payout-orders", params],
    queryFn: () => getPayoutOrders(params),
    staleTime: 60 * 1000,
  });
};

/**
 * Hook to fetch earnings data with a specific store ID
 * @param storeId - The store ID to fetch earnings for
 * @param params - Optional query parameters for filtering
 * @returns Query result with earnings data
 */
export const useEarningsByStoreId = (storeId: number, params?: EarningsQueryParams) => {
  return useQuery({
    queryKey: ["earnings", storeId, params],
    queryFn: () => getEarnings(storeId, params),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to invalidate earnings queries
 * @returns Function to invalidate earnings queries
 */
export const useInvalidateEarnings = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ["earnings"] });
    },
    invalidateMyEarnings: () => {
      queryClient.invalidateQueries({ queryKey: ["earnings", "me"] });
    },
    invalidateStoreEarnings: (storeId: number) => {
      queryClient.invalidateQueries({ queryKey: ["earnings", "store", storeId] });
    },
    invalidateEarningsByStoreId: (storeId: number) => {
      queryClient.invalidateQueries({ queryKey: ["earnings", storeId] });
    },
  };
};

/**
 * Hook to prefetch earnings data
 * @returns Function to prefetch earnings data
 */
export const usePrefetchEarnings = () => {
  const queryClient = useQueryClient();
  
  return {
    prefetchMyEarnings: (params?: EarningsQueryParams) => {
      queryClient.prefetchQuery({
        queryKey: ["earnings", "me", params],
        queryFn: () => getMyEarnings(params),
        staleTime: 5 * 60 * 1000,
      });
    },
    prefetchStoreEarnings: (storeId: number, params?: EarningsQueryParams) => {
      queryClient.prefetchQuery({
        queryKey: ["earnings", "store", storeId, params],
        queryFn: () => getStoreEarnings(storeId, params),
        staleTime: 5 * 60 * 1000,
      });
    },
  };
};
