"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../base";
import { 
  Order, 
  CreateOrderRequest, 
  UpdateOrderRequest, 
  LinkOrderToDeliveryOptionRequest,
  OrderWithProducts,
  CreateTemporalOrderRequest,
 
} from "@/constants/types";

// Direct API functions for use outside of React Query
export const orderAPI = {
  // Create a new order
  create: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await api.post("/orders", data);
    return response.data;
  },
  createTemporalUser: async (data: CreateTemporalOrderRequest): Promise<Order> => {
    const response = await api.post("/orders/temporal", data);
    return response.data;
  },

  // Get orders for the current user
  getMyOrders: async (): Promise<Order[]> => {
    const response = await api.get("/orders/me");
    return response.data.data || response.data;
  },

  // Get order by ID
  getById: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data.data || response.data;
  },

  // Update order
  update: async (id: number, data: UpdateOrderRequest): Promise<Order> => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data.data || response.data;
  },

  // Delete order
  delete: async (id: number): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },

  // Get order products
  getProducts: async (id: number): Promise<OrderWithProducts> => {
    const response = await api.get(`/orders/${id}/products`);
    return response.data.data || response.data;
  },

  // Get orders by store ID
  getByStoreId: async (storeId: number): Promise<Order[]> => {
    const response = await api.get(`/orders/${storeId}/store`);
    return response.data.data || response.data;
  },

  // Link order to delivery option
  linkToDeliveryOption: async (id: number, data: LinkOrderToDeliveryOptionRequest): Promise<Order> => {
    const response = await api.put(`/orders/${id}/delivery-options`, data);
    return response.data.data || response.data;
  },

  // Update order status (existing functionality)
  updateStatus: async (orderId: number, status: string): Promise<Order> => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data.data || response.data;
  },
};
