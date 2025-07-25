import { ContentItem, ContentItemPayload } from "@/app/(protected)/contents/types/content";
import { api } from "../base";


export const createContent = async (content: Partial<ContentItemPayload>) => {
  const response = await api.post("/content", content);
  return response.data;
};

export const getContentById = async (id: string | number): Promise<ContentItemPayload> => {
  const response = await api.get(`/content/${id}`);
  return response.data;
};
export const getMyContents = async (): Promise<ContentItem[]> => {
  const response = await api.get(`/content/user-contents/me`);
  return response.data;
};

export const updateContent = async (id: string | number, content: Partial<ContentItem>) => {
  const response = await api.put(`/content/${id}`, content);
  return response.data;
};

export const deleteContent = async (id: string | number) => {
  const response = await api.delete(`/content/${id}`);
  return response.data;
};

export const getDiscoveryContent = async (): Promise<ContentItem[]> => {
  const response = await api.get("/discover");
  return response.data;
};
export const markContentAsViewed = async (id:string): Promise<ContentItem[]> => {
  const response = await api.get(`/viewed/${id}`);
  return response.data;
};
export const getStoreContents = async (id:string): Promise<ContentItem[]> => {
  const response = await api.get(`/store/contents/${id}`);
  return response.data;
};
