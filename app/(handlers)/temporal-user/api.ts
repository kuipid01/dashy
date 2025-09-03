"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../base";
import { 
  TemporalUser, 
  CreateTemporalUserRequest, 
  UpdateTemporalUserRequest, 
  LinkOrderToTemporalUserRequest,
  TemporalUserWithOrders 
} from "@/constants/types";

// Direct API functions for use outside of React Query
export const temporalUserAPI = {
  // Create a new temporal user
  create: async (data: CreateTemporalUserRequest): Promise<TemporalUser> => {
    const response = await api.post("/temporal-users", data);
    return response.data;
  },

  // Create or get existing temporal user
  createOrGet: async (data: CreateTemporalUserRequest): Promise<TemporalUser> => {
    const response = await api.post("/temporal-users/create-or-get", data);
    return response.data;
  },

  // Get temporal user by ID
  getById: async (id: number): Promise<TemporalUser> => {
    const response = await api.get(`/temporal-users/${id}`);
    return response.data;
  },

  // Get temporal user by email
  getByEmail: async (email: string): Promise<TemporalUser> => {
    const response = await api.get(`/temporal-users?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  // Get temporal user with orders by ID
  getWithOrdersById: async (id: number): Promise<TemporalUserWithOrders> => {
    const response = await api.get(`/temporal-users/${id}/orders`);
    return response.data;
  },

  // Get temporal user with orders by email
  getWithOrdersByEmail: async (email: string): Promise<TemporalUserWithOrders> => {
    const response = await api.get(`/temporal-users/orders?email=${encodeURIComponent(email)}`);
    return response.data;
  },

  // Update temporal user
  update: async (id: number, data: UpdateTemporalUserRequest): Promise<TemporalUser> => {
    const response = await api.put(`/temporal-users/${id}`, data);
    return response.data;
  },

  // Delete temporal user
  delete: async (id: number): Promise<void> => {
    await api.delete(`/temporal-users/${id}`);
  },

  // Link order to temporal user
  linkOrder: async (data: LinkOrderToTemporalUserRequest): Promise<{ success: boolean; message: string }> => {
    const response = await api.post("/temporal-users/link-order", data);
    return response.data;
  },
};
