"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from "../base";
import { 
  Feedback, 
  CreateFeedbackRequest, 
  UpdateFeedbackRequest,
  FeedbacksListResponse,
  AverageRatingResponse,
  FeedbacksByStarsResponse
} from "@/constants/types";

// Direct API functions for use outside of React Query
export const feedbackAPI = {
  // Submit feedback
  submit: async (data: CreateFeedbackRequest): Promise<Feedback> => {
    const response = await api.post("/feedback", data);
    return response.data.data || response.data;
  },

  // Get all feedbacks
  getAll: async (params?: {
    page?: number;
    limit?: number;
    order_id?: number;
    product_id?: number;
    store_id?: number;
  }): Promise<FeedbacksListResponse> => {
    const response = await api.get("/feedback", { params });
    return response.data;
  },

  // Get feedback by ID
  getById: async (id: number): Promise<Feedback> => {
    const response = await api.get(`/feedback/${id}`);
    return response.data.data || response.data;
  },

  // Get average rating
  getAverageRating: async (params?: {
    store_id?: number;
    product_id?: number;
  }): Promise<AverageRatingResponse> => {
    const response = await api.get("/feedback/average-rating", { params });
    return response.data;
  },

  // Get feedbacks by stars
  getByStars: async (stars: number, params?: {
    page?: number;
    limit?: number;
    store_id?: number;
    product_id?: number;
  }): Promise<FeedbacksByStarsResponse> => {
    const response = await api.get("/feedback/by-stars", { 
      params: { stars, ...params } 
    });
    return response.data;
  },

  // Update feedback (if needed)
  update: async (id: number, data: UpdateFeedbackRequest): Promise<Feedback> => {
    const response = await api.put(`/feedback/${id}`, data);
    return response.data.data || response.data;
  },

  // Delete feedback (if needed)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/feedback/${id}`);
  },
};
