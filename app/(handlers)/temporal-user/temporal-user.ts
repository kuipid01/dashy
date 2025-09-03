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
import { useMutation, useQuery } from "@tanstack/react-query";

// API Functions
const createTemporalUser = async (data: CreateTemporalUserRequest): Promise<TemporalUser> => {
  const response = await api.post("/temporal-users", data);
  return response.data;
};

const createOrGetTemporalUser = async (data: CreateTemporalUserRequest): Promise<TemporalUser> => {
  const response = await api.post("/temporal-users/create-or-get", data);
  return response.data;
};

const getTemporalUserByID = async (id: number): Promise<TemporalUser> => {
  const response = await api.get(`/temporal-users/${id}`);
  return response.data;
};

const getTemporalUserByEmail = async (email: string): Promise<TemporalUser> => {
  const response = await api.get(`/temporal-users?email=${encodeURIComponent(email)}`);
  return response.data;
};

const getTemporalUserWithOrders = async (id: number): Promise<TemporalUserWithOrders> => {
  const response = await api.get(`/temporal-users/${id}/orders`);
  return response.data;
};

const getTemporalUserWithOrdersByEmail = async (email: string): Promise<TemporalUserWithOrders> => {
  const response = await api.get(`/temporal-users/orders?email=${encodeURIComponent(email)}`);
  return response.data;
};

const updateTemporalUser = async ({ id, data }: { id: number; data: UpdateTemporalUserRequest }): Promise<TemporalUser> => {
  const response = await api.put(`/temporal-users/${id}`, data);
  return response.data;
};

const deleteTemporalUser = async (id: number): Promise<void> => {
  await api.delete(`/temporal-users/${id}`);
};

const linkOrderToTemporalUser = async (data: LinkOrderToTemporalUserRequest): Promise<{ success: boolean; message: string }> => {
  const response = await api.post("/temporal-users/link-order", data);
  return response.data;
};

// React Query Hooks
export const useCreateTemporalUser = () => {
  return useMutation({
    mutationFn: createTemporalUser,
  });
};

export const useCreateOrGetTemporalUser = () => {
  return useMutation({
    mutationFn: createOrGetTemporalUser,
  });
};

export const useGetTemporalUserByID = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["temporal-user", id],
    queryFn: () => getTemporalUserByID(id),
    enabled: enabled && !!id,
  });
};

export const useGetTemporalUserByEmail = (email: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["temporal-user", "email", email],
    queryFn: () => getTemporalUserByEmail(email),
    enabled: enabled && !!email,
  });
};

export const useGetTemporalUserWithOrders = (id: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["temporal-user", id, "orders"],
    queryFn: () => getTemporalUserWithOrders(id),
    enabled: enabled && !!id,
  });
};

export const useGetTemporalUserWithOrdersByEmail = (email: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["temporal-user", "email", email, "orders"],
    queryFn: () => getTemporalUserWithOrdersByEmail(email),
    enabled: enabled && !!email,
  });
};

export const useUpdateTemporalUser = () => {
  return useMutation({
    mutationFn: updateTemporalUser,
  });
};

export const useDeleteTemporalUser = () => {
  return useMutation({
    mutationFn: deleteTemporalUser,
  });
};

export const useLinkOrderToTemporalUser = () => {
  return useMutation({
    mutationFn: linkOrderToTemporalUser,
  });
};
