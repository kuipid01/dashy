"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../base";
import { 
  Contact, 
  CreateContactRequest, 
  UpdateContactRequest,
  CreatePublicContactRequest,
  UpdatePublicContactRequest,
  ContactResponse,
  ContactsListResponse,
  ContactSearchResponse
} from "@/constants/types";

// Direct API functions for use outside of React Query
export const contactAPI = {
  // Authenticated endpoints
  
  // Create a new contact
  create: async (data: CreateContactRequest): Promise<Contact> => {
    const response = await api.post("/contacts", data);
    return response.data.data || response.data;
  },

  // Get user's contacts
  getMyContacts: async (): Promise<Contact[]> => {
    const response = await api.get("/contacts");
    return response.data.data?.contacts || response.data.contacts || response.data;
  },

  // Get specific contact by ID
  getById: async (id: string): Promise<Contact> => {
    const response = await api.get(`/contacts/${id}`);
    return response.data.data || response.data;
  },

  // Update contact
  update: async (id: string, data: UpdateContactRequest): Promise<Contact> => {
    const response = await api.put(`/contacts/${id}`, data);
    return response.data.data || response.data;
  },

  // Delete contact
  delete: async (id: string): Promise<void> => {
    await api.delete(`/contacts/${id}`);
  },

  // Search contacts
  search: async (query: string): Promise<Contact[]> => {
    const response = await api.get(`/contacts/search?q=${encodeURIComponent(query)}`);
    return response.data.data?.contacts || response.data.contacts || response.data;
  },

  // Public endpoints (for unauthenticated users)

  // Create a new public contact
  createPublic: async (data: CreatePublicContactRequest): Promise<Contact> => {
    const response = await api.post("/contacts/public", data);
    return response.data.data || response.data;
  },

  // Get user's contacts (public)
  getPublicContacts: async (userEmail: string): Promise<Contact[]> => {
    const response = await api.get(`/contacts/public?user_email=${encodeURIComponent(userEmail)}`);
    return response.data.data?.contacts || response.data.contacts || response.data;
  },

  // Get specific public contact by ID
  getPublicById: async (id: string): Promise<Contact> => {
    const response = await api.get(`/contacts/public/${id}`);
    return response.data.data || response.data;
  },

  // Update public contact
  updatePublic: async (id: string, data: UpdatePublicContactRequest): Promise<Contact> => {
    const response = await api.put(`/contacts/public/${id}`, data);
    return response.data.data || response.data;
  },

  // Delete public contact
  deletePublic: async (id: string, userEmail: string): Promise<void> => {
    await api.delete(`/contacts/public/${id}?user_email=${encodeURIComponent(userEmail)}`);
  },
};
