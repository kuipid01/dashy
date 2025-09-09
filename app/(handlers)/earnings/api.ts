import { api } from "../base";
import { EarningsApiResponse, EarningsQueryParams } from "./types";

/**
 * Fetch earnings data for a specific store
 * @param storeId - The store ID to fetch earnings for
 * @param params - Optional query parameters for filtering
 * @returns Promise<EarningsApiResponse>
 */
export const getEarnings = async (
  storeId: number,
  params?: EarningsQueryParams
): Promise<EarningsApiResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.month) queryParams.append('month', params.month.toString());
  if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params?.dateTo) queryParams.append('dateTo', params.dateTo);

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
): Promise<EarningsApiResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.month) queryParams.append('month', params.month.toString());
  if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params?.dateTo) queryParams.append('dateTo', params.dateTo);

  const queryString = queryParams.toString();
  const url = `/earning/me${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get(url);
  return response.data;
};

/**
 * Fetch earnings data for a specific store by ID
 * @param storeId - The store ID
 * @param params - Optional query parameters for filtering
 * @returns Promise<EarningsApiResponse>
 */
export const getStoreEarnings = async (
  storeId: number,
  params?: EarningsQueryParams
): Promise<EarningsApiResponse> => {
  const queryParams = new URLSearchParams();
  
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.month) queryParams.append('month', params.month.toString());
  if (params?.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params?.dateTo) queryParams.append('dateTo', params.dateTo);

  const queryString = queryParams.toString();
  const url = `/earning/store/${storeId}${queryString ? `?${queryString}` : ''}`;
  
  const response = await api.get(url);
  return response.data;
};
