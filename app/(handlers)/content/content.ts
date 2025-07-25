import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createContent, deleteContent, getContentById, getDiscoveryContent, getMyContents, getStoreContents, markContentAsViewed, updateContent } from "./api";
import { ContentItem } from "@/app/(protected)/contents/types/content";


// 1️⃣ Fetch content by ID
export const useFetchContentById = (id: string | number) => {
  return useQuery({
    queryKey: ["content", id],
    queryFn: () => getContentById(id),
    enabled: !!id,
  });
};
//  Fetch my content by ID
export const useFetchMyContents = () => {
  return useQuery({
    queryKey: ["content",],
    queryFn:  getMyContents
  });
};

// 2️⃣ Fetch discovery content
export const useFetchDiscoveryContent = () => {
  return useQuery({
    queryKey: ["content", "discovery"],
    queryFn: getDiscoveryContent,
  });
};
export const useFetchStoreContent = (id:string) => {
  return useQuery({
    queryKey: ["store-contents", id],
    queryFn: () => getStoreContents(id),
    enabled:!!id
  });
};
export const useMarkContentAsViewed = (id:string) => {
  return useQuery({
    queryKey: ["viewed", id],
    queryFn: () => markContentAsViewed(id),
    enabled:!!id
  });
};

// 3️⃣ Create content
export const useCreateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "discovery"] });
    },
  });
};

// 4️⃣ Update content
export const useUpdateContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: Partial<ContentItem> }) =>
      updateContent(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["content", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["content", "discovery"] });
    },
  });
};

// 5️⃣ Delete content
export const useDeleteContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string | number) => deleteContent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content", "discovery"] });
    },
  });
};
