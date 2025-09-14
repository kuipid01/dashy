"use client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactAPI } from "./api";
import { 
  UpdateContactRequest,
  UpdatePublicContactRequest
} from "@/constants/types";

// Query Keys
export const contactKeys = {
  all: ["contacts"] as const,
  myContacts: () => [...contactKeys.all, "me"] as const,
  byId: (id: string) => [...contactKeys.all, "by-id", id] as const,
  search: (query: string) => [...contactKeys.all, "search", query] as const,
  public: (userEmail: string) => [...contactKeys.all, "public", userEmail] as const,
  publicById: (id: string) => [...contactKeys.all, "public", "by-id", id] as const,
};

// Authenticated Contact Hooks

export const useCreateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contactAPI.create,
    onSuccess: (data) => {
      // Invalidate and refetch contact queries
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
      // Set the new contact in cache
      queryClient.setQueryData(contactKeys.byId(data.ID), data);
    },
  });
};

export const useGetMyContacts = (enabled: boolean = true) => {
  return useQuery({
    queryKey: contactKeys.myContacts(),
    queryFn: contactAPI.getMyContacts,
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetContactById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: contactKeys.byId(id),
    queryFn: () => contactAPI.getById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContactRequest }) => 
      contactAPI.update(id, data),
    onSuccess: (data) => {
      // Update cache for the specific contact
      queryClient.setQueryData(contactKeys.byId(data.ID), data);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: contactKeys.myContacts() });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contactAPI.delete,
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: contactKeys.byId(id) });
      // Invalidate all contact queries
      queryClient.invalidateQueries({ queryKey: contactKeys.all });
    },
  });
};

export const useSearchContacts = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: contactKeys.search(query),
    queryFn: () => contactAPI.search(query),
    enabled: enabled && !!query && query.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

// Public Contact Hooks (for unauthenticated users)

export const useCreatePublicContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: contactAPI.createPublic,
    onSuccess: (data, variables) => {
      // Invalidate public contact queries for the user
      queryClient.invalidateQueries({ queryKey: contactKeys.public(variables.user_email) });
      // Set the new contact in cache
      queryClient.setQueryData(contactKeys.publicById(data.ID), data);
    },
  });
};

export const useGetPublicContacts = (userEmail: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: contactKeys.public(userEmail),
    queryFn: () => contactAPI.getPublicContacts(userEmail),
    enabled: enabled && !!userEmail,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetPublicContactById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: contactKeys.publicById(id),
    queryFn: () => contactAPI.getPublicById(id),
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdatePublicContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePublicContactRequest }) => 
      contactAPI.updatePublic(id, data),
    onSuccess: (data) => {
      // Update cache for the specific contact
      queryClient.setQueryData(contactKeys.publicById(data.ID), data);
      // Invalidate related queries
       },
  });
};

export const useDeletePublicContact = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userEmail }: { id: string; userEmail: string }) => 
      contactAPI.deletePublic(id, userEmail),
    onSuccess: (_, { id, userEmail }) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: contactKeys.publicById(id) });
      // Invalidate public contact queries for the user
      queryClient.invalidateQueries({ queryKey: contactKeys.public(userEmail) });
    },
  });
};
