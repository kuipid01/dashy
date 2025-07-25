import { User } from "@/constants/types";

export interface Message {
  id: string;
  ID: string;
  conversationId: string;
  conversation: Conversation;
  SenderID: number;
  Sender: User;
  content: string;
  Content: string;
  Attachments?: string;
  ReadByReceiver: boolean;
  Delivered: boolean;
  CreatedAt: Date | string;
}
export interface SendMessageDTO {
  receiver_id: string;
  content: string;
  attachments?: string;
    conversationId: string;
}

export interface Conversation {
  ID: string;
  SenderID: number;
  ReceiverID: number;
  Sender: User;
  Receiver: User;
  CreatedAt: Date;
  UpdatedAt: Date;
  Messages: Message[];
}
