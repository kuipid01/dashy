/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { feedbackAPI } from "./api";
import { AverageRatingResponse, FeedbacksByStarsResponse, FeedbacksListResponse, UpdateFeedbackRequest } from "@/constants/types";


// Query Keys
export const feedbackKeys = {
  all: ["feedback"] as const,
  lists: () => [...feedbackKeys.all, "list"] as const,
  list: (filters: Record<string, any>) => [...feedbackKeys.lists(), { filters }] as const,
  details: () => [...feedbackKeys.all, "detail"] as const,
  detail: (id: number) => [...feedbackKeys.details(), id] as const,
  averageRating: (filters: Record<string, any>) => [...feedbackKeys.all, "average-rating", { filters }] as const,
  byStars: (stars: number, filters: Record<string, any>) => [...feedbackKeys.all, "by-stars", stars, { filters }] as const,
};

// React Query Hooks

// Submit feedback
export const useSubmitFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: feedbackAPI.submit,
    onSuccess: (data) => {
      // Invalidate and refetch feedback queries
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
      // Set the new feedback in cache
      queryClient.setQueryData(feedbackKeys.detail(data.id), data);
      // Invalidate average rating if store/product is specified
      if (data.store_id) {
        queryClient.invalidateQueries({ 
          queryKey: feedbackKeys.averageRating({ store_id: data.store_id }) 
        });
      }
      if (data.product_id) {
        queryClient.invalidateQueries({ 
          queryKey: feedbackKeys.averageRating({ product_id: data.product_id }) 
        });
      }
    },
  });
};

// Get all feedbacks
export const useGetFeedbacks = (params?: {
  page?: number;
  limit?: number;
  order_id?: number;
  product_id?: number;
  store_id?: number;
}) => {
  return useQuery<FeedbacksListResponse>({
    queryKey: feedbackKeys.list(params || {}),
    queryFn: () => feedbackAPI.getAll(params),
    enabled: true,
  });
};

// Get feedback by ID
export const useGetFeedbackById = (id: number) => {
  return useQuery({
    queryKey: feedbackKeys.detail(id),
    queryFn: () => feedbackAPI.getById(id),
    enabled: !!id,
  });
};

// Get average rating
export const useGetAverageRating = (params?: {
  store_id?: number;
  product_id?: number;
}) => {
  return useQuery<AverageRatingResponse>({
    queryKey: feedbackKeys.averageRating(params || {}),
    queryFn: () => feedbackAPI.getAverageRating(params),
    enabled: true,
  });
};

// Get feedbacks by stars
export const useGetFeedbacksByStars = (
  stars: number,
  params?: {
    page?: number;
    limit?: number;
    store_id?: number;
    product_id?: number;
  }
) => {
  return useQuery<FeedbacksByStarsResponse>({
    queryKey: feedbackKeys.byStars(stars, params || {}),
    queryFn: () => feedbackAPI.getByStars(stars, params),
    enabled: stars >= 1 && stars <= 5,
  });
};

// Update feedback
export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFeedbackRequest }) =>
      feedbackAPI.update(id, data),
    onSuccess: (data) => {
      // Invalidate and refetch feedback queries
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
      // Set the updated feedback in cache
      queryClient.setQueryData(feedbackKeys.detail(data.id), data);
      // Invalidate average rating if store/product is specified
      if (data.store_id) {
        queryClient.invalidateQueries({ 
          queryKey: feedbackKeys.averageRating({ store_id: data.store_id }) 
        });
      }
      if (data.product_id) {
        queryClient.invalidateQueries({ 
          queryKey: feedbackKeys.averageRating({ product_id: data.product_id }) 
        });
      }
    },
  });
};

// Delete feedback
export const useDeleteFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: feedbackAPI.delete,
    onSuccess: (_, deletedId) => {
      // Invalidate and refetch feedback queries
      queryClient.invalidateQueries({ queryKey: feedbackKeys.all });
      // Remove the deleted feedback from cache
      queryClient.removeQueries({ queryKey: feedbackKeys.detail(deletedId) });
    },
  });
};
