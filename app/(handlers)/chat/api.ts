import { api } from "../base";
import { SendMessageDTO } from "./types";

export const sendMessage = async (message: SendMessageDTO) => {
  const response = await api.post("/chat/send", message);
  return response.data;
};
export const getConversationMessages = async (
  id: string,
  limit?: number,
  offset?: number
) => {
  const response = await api.get(`/chat/messages/${id}`, {
    params: {
      limit,
      offset,
    },
  });
  return response.data;
};
export const getUserConversations = async () => {
  const response = await api.get(`/chat/conversations`);
  return response.data;
};
export const updateMessageStatus = async () => {
  const response = await api.get(`/chat/message-status`);
  return response.data;
};
export const deleteMessage = async (conversationId:string) => {
 await api.delete(`/chat/message/${conversationId}`);
  
};
export const startConvo = async (data: {
  senderId: number;
  receiverId: number;
}) => {
  const response = await api.post(`/chat/conversations`, data);
  return response.data;
};
export const getUsersStores = async (query: string) => {
  const response = await api.get(`/users/search`, {
    params: {
      q: query,
    },
  });
  return response.data;
};
