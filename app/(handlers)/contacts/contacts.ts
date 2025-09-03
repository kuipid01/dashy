"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../base";
import { 
  Contact, 
  CreateContactRequest, 
  UpdateContactRequest,
  CreatePublicContactRequest,
  UpdatePublicContactRequest
} from "@/constants/types";
import { useMutation, useQuery } from "@tanstack/react-query";

// API Functions
const createContact = async (data: CreateContactRequest): Promise<Contact> => {
  const response = await api.post("/contacts", data);
  return response.data.data || response.data;
};

const getMyContacts = async (): Promise<Contact[]> => {
  const response = await api.get("/contacts");
  return response.data.data?.contacts || response.data.contacts || response.data;
};

const getContactById = async (id: string): Promise<Contact> => {
  const response = await api.get(`/contacts/${id}`);
  return response.data.data || response.data;
};

const updateContact = async (id: string, data: UpdateContactRequest): Promise<Contact> => {
  const response = await api.put(`/contacts/${id}`, data);
  return response.data.data || response.data;
};

const deleteContact = async (id: string): Promise<void> => {
  await api.delete(`/contacts/${id}`);
};

const searchContacts = async (query: string): Promise<Contact[]> => {
  const response = await api.get(`/contacts/search?q=${encodeURIComponent(query)}`);
  return response.data.data?.contacts || response.data.contacts || response.data;
};

// Public API Functions
const createPublicContact = async (data: CreatePublicContactRequest): Promise<Contact> => {
  const response = await api.post("/contacts/public", data);
  return response.data.data || response.data;
};

const getPublicContacts = async (userEmail: string): Promise<Contact[]> => {
  const response = await api.get(`/contacts/public?user_email=${encodeURIComponent(userEmail)}`);
  return response.data.data?.contacts || response.data.contacts || response.data;
};

const getPublicContactById = async (id: string): Promise<Contact> => {
  const response = await api.get(`/contacts/public/${id}`);
  return response.data.data || response.data;
};

const updatePublicContact = async (id: string, data: UpdatePublicContactRequest): Promise<Contact> => {
  const response = await api.put(`/contacts/public/${id}`, data);
  return response.data.data || response.data;
};

const deletePublicContact = async (id: string, userEmail: string): Promise<void> => {
  await api.delete(`/contacts/public/${id}?user_email=${encodeURIComponent(userEmail)}`);
};

// Legacy functions - keeping for backward compatibility
const fetchContacts = async (): Promise<Contact[]> => {
  const response = await api.get("/contacts");
  return response.data.data?.contacts || response.data.contacts || response.data;
};

const fetchPublicContacts = async (userEmail: string): Promise<Contact[]> => {
  const response = await api.get(`/contacts/public?user_email=${encodeURIComponent(userEmail)}`);
  return response.data.data?.contacts || response.data.contacts || response.data;
};

// React Query Hooks
export const useCreateContact = () => {
  return useMutation({
    mutationFn: createContact,
  });
};

export const useGetMyContacts = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["contacts", "me"],
    queryFn: getMyContacts,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetContactById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["contacts", "by-id", id],
    queryFn: () => getContactById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateContact = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactRequest }) => 
      updateContact(id, data),
  });
};

export const useDeleteContact = () => {
  return useMutation({
    mutationFn: deleteContact,
  });
};

export const useSearchContacts = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["contacts", "search", query],
    queryFn: () => searchContacts(query),
    enabled: enabled && !!query && query.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Public Contact Hooks
export const useCreatePublicContact = () => {
  return useMutation({
    mutationFn: createPublicContact,
  });
};

export const useGetPublicContacts = (userEmail: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["contacts", "public", userEmail],
    queryFn: () => getPublicContacts(userEmail),
    enabled: enabled && !!userEmail,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetPublicContactById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["contacts", "public", "by-id", id],
    queryFn: () => getPublicContactById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdatePublicContact = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePublicContactRequest }) => 
      updatePublicContact(id, data),
  });
};

export const useDeletePublicContact = () => {
  return useMutation({
    mutationFn: ({ id, userEmail }: { id: string; userEmail: string }) => 
      deletePublicContact(id, userEmail),
  });
};

// Legacy exports for backward compatibility
export {
  fetchContacts,
  fetchPublicContacts,
  createContact,
  getMyContacts,
  getContactById,
  updateContact,
  deleteContact,
  searchContacts,
  createPublicContact,
  getPublicContacts,
  getPublicContactById,
  updatePublicContact,
  deletePublicContact,
};
