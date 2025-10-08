import { api } from "../base";
import { EarningsQueryParams, EarningsResponse, PayoutOrdersResponse } from "./types";

/**
 * Fetch earnings data for a specific store
 * @param storeId - The store ID to fetch earnings for
 * @param params - Optional query parameters for filtering
 * @returns Promise<EarningsApiResponse>
 */
export const getEarnings = async (
  storeId: number,
  params?: EarningsQueryParams
): Promise<EarningsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.month) queryParams.append('month', params.month.toString());
  if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params?.dateTo) queryParams.append('dateTo', params.dateTo);
  if (params?.payout_status) queryParams.append('payout_status', params.payout_status);
  if (params?.granularity) queryParams.append('granularity', params.granularity);

  const queryString = queryParams.toString();
  const url = `/earning/me${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get(url);
  return response.data;
};

/**
 * Fetch earnings data for the current user's store
 * @param params - Optional query parameters for filtering
 * @returns Promise<EarningsApiResponse>
 */
export const getMyEarnings = async (
  params?: EarningsQueryParams
): Promise<EarningsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.month) queryParams.append('month', params.month.toString());
  if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params?.dateTo) queryParams.append('dateTo', params.dateTo);
  if (params?.payout_status) queryParams.append('payout_status', params.payout_status);
  if (params?.granularity) queryParams.append('granularity', params.granularity);

  const queryString = queryParams.toString();
  const url = `/earning/me${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get(url);
  return response.data;
};

/**
 * Fetch earnings data for a specific store by ID
 * @param storeId - The store ID
 * @param params - Optional query parameters for filtering
 * @returns Promise<EarningsResponse>
 */
export const getStoreEarnings = async (
  storeId: number,
  params?: EarningsQueryParams
): Promise<EarningsResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.month) queryParams.append('month', params.month.toString());
  if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params?.dateTo) queryParams.append('dateTo', params.dateTo);
  if (params?.payout_status) queryParams.append('payout_status', params.payout_status);
  if (params?.granularity) queryParams.append('granularity', params.granularity);

  const queryString = queryParams.toString();
  const url = `/earning/store/${storeId}${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get(url);
  return response.data;
};

/**
 * Fetch orders grouped by platform payout status
 * Backend endpoint (to implement): GET /earning/payout-orders
 * Query: status=completed|pending, page, limit
 */
export const getPayoutOrders = async (params?: {
  status?: "completed" | "pending";
  page?: number;
  limit?: number;
}): Promise<PayoutOrdersResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append("status", params.status);
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  const queryString = queryParams.toString();
  const url = `/earning/payout-orders${queryString ? `?${queryString}` : ''}`;
  const response = await api.get(url);
  console.log(response.data.data, "RESPONSE PAYOUT ORDERS");
  return response.data.data;
};
