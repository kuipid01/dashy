"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../base";
import { 
  CreateRefundRequest,
  UpdateRefundStatusRequest,
  RefundResponse,
  RefundsListResponse,
  RefundStatsResponse
} from "@/constants/types";

// Direct API functions for use outside of React Query
export const refundAPI = {
  // Create a new refund
  createRefund: async (data: CreateRefundRequest): Promise<RefundResponse> => {
    const response = await api.post("/refunds", data);
    return response.data;
  },

  // Get all refunds with pagination
  getAllRefunds: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    store_id?: string;
    order_id?: string;
  }): Promise<RefundsListResponse> => {
    const response = await api.get("/refunds", { params });
    return response.data;
  },

  // Get refund statistics
  getRefundStats: async (): Promise<RefundStatsResponse> => {
    const response = await api.get("/refunds/stats");
    return response.data;
  },

  // Get a specific refund by ID
  getRefund: async (id: string): Promise<RefundResponse> => {
    const response = await api.get(`/refunds/${id}`);
    return response.data;
  },

  // Update refund status
  updateRefundStatus: async (
    id: string, 
    data: UpdateRefundStatusRequest
  ): Promise<RefundResponse> => {
    const response = await api.put(`/refunds/${id}/status`, data);
    return response.data;
  },

  // Delete a refund
  deleteRefund: async (id: string): Promise<{ success: boolean; message?: string }> => {
    const response = await api.delete(`/refunds/${id}`);
    return response.data;
  },

  // Get refunds by order ID
  getRefundsByOrder: async (
    orderId: string,
    params?: { page?: number; limit?: number }
  ): Promise<RefundsListResponse> => {
    const response = await api.get(`/refunds/order/${orderId}`, { params });
    return response.data;
  },

  // Get refunds by store ID
  getRefundsByStore: async (
    storeId: string,
    params?: { page?: number; limit?: number; status?: string }
  ): Promise<RefundsListResponse> => {
    const response = await api.get(`/refunds/store/${storeId}`, { params });
    return response.data;
  },

  // Get refunds by status
  getRefundsByStatus: async (
    status: string,
    params?: { page?: number; limit?: number }
  ): Promise<RefundsListResponse> => {
    const response = await api.get(`/refunds/status/${status}`, { params });
    return response.data;
  },
};
