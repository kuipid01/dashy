import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getConversationMessages,
  sendMessage,
  getUserConversations,
  updateMessageStatus,
  startConvo,
  deleteMessage,
} from "./api";
import { Message } from "./types";

export const useFetchConversationMessages = (
  id: string,
  limit?: number,
  offset?: number
) => {
  return useQuery<{ count: number; messages: Message[] }>({
    queryKey: ["conversation-messages", id, ],
    queryFn: () => getConversationMessages(id, limit, offset),
    enabled: !!id, 
  });
};


// 2️⃣ Send a message
export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (_, variables) => {
      // Refetch messages for this conversation after sending
      queryClient.invalidateQueries({
        queryKey: ["conversation-messages", variables.conversationId],
      });
    },
  });
};

// 3 Start a conversation message
export const useStartConvo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: startConvo,
    onSuccess: (_, variables) => {
      // Refetch messages for this conversation after sending
      queryClient.invalidateQueries({
        queryKey: ["conversation", variables.receiverId, variables.senderId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversation"],
      });
    },
  });
};

// 3️⃣ Fetch all conversations for user
export const useFetchUserConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getUserConversations,
  });
};

// 4️⃣ Update message status (e.g., mark as read/delivered)
export const useUpdateMessageStatus = () => {
  return useMutation({
    mutationFn: updateMessageStatus,
    onSuccess: () => {
      // Optionally invalidate messages or conversations if needed
    },
  });
};
// 4️⃣ Update message status (e.g., mark as read/delivered)
export const useDeleteMessageMessage = () => {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({conversationId}:{
      conversationId:string
    }) =>  deleteMessage(conversationId),
    onSuccess: (_, variables)  => {
         queryClient.invalidateQueries({
        queryKey: ["conversation-messages", variables.conversationId],
      
      });
      // Optionally invalidate messages or conversations if needed
    },
  });
};
