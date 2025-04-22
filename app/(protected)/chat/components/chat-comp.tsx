"use client";
import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Smile } from "lucide-react";

// Mock conversation data based on the screenshot
interface Message {
  id: string;
  sender: string;
  initials: string;
  content: string;
  timestamp: string;
  type: "text" | "voice" | "image";
  isCurrentUser: boolean;
}

interface Conversation {
  id: string;
  sender: string;
  messages: Message[];
}

const mockConversation: Conversation = {
  id: "1",
  sender: "Wolf Pixel Family",
  messages: [
    {
      id: "1",
      sender: "Jude Bellingham",
      initials: "JB",
      content:
        "Agreed, Ramos. We had some good moments, but we need to be more clinical in front of the goal.",
      timestamp: "08:34 AM",
      type: "text",
      isCurrentUser: false
    },
    {
      id: "2",
      sender: "You",
      initials: "YOU",
      content:
        "We need to control the midfield and exploit their defensive weaknesses. Rodrigo and Vini, I'm counting on your creativity. Marcus and Jadon, stretch their defense wide. Use pace and take on their full-backs.",
      timestamp: "08:34 AM",
      type: "text",
      isCurrentUser: true
    },
    {
      id: "3",
      sender: "Kylian Mbappe",
      initials: "KM",
      content: "voice message",
      timestamp: "08:34 AM",
      type: "voice",
      isCurrentUser: false
    }
  ]
};

interface ChatComponentProps {
  conversationId: string | null;
}

export default function ChatComponent({ conversationId }: ChatComponentProps) {
  const [conversation, setConversation] = useState<Conversation | null>(
    conversationId ? mockConversation : null
  );
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [conversation?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !conversation) return;

    const newMsg: Message = {
      id: (conversation.messages.length + 1).toString(),
      sender: "You",
      initials: "YOU",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      }),
      type: "text",
      isCurrentUser: true
    };

    setConversation({
      ...conversation,
      messages: [...conversation.messages, newMsg]
    });
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="flex-1 h-[80vh] relative overflow-auto flex flex-col bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Chat Header */}
      <div className="p-4 border-b sticky top-0 z-20 bg-white border-gray-200 flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarFallback className="bg-black text-white font-semibold">
            {conversation.sender
              .split(" ")
              .map((name) => name[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {conversation.sender}
          </h2>
          <p className="text-sm font-medium text-gray-600">{`${conversation.sender} is typing...`}</p>
        </div>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 overflow-auto p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          <div className="text-center text-sm text-gray-500">Today</div>
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {!message.isCurrentUser && (
                <Avatar className="size-8 mr-2 mt-1">
                  <AvatarFallback className="bg-black text-white font-semibold">
                    {message.initials}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] ${
                  message.isCurrentUser ? "ml-2" : "mr-2"
                }`}
              >
                <div className="flex items-end gap-1">
                  {!message.isCurrentUser && (
                    <p className="text-xs text-gray-500 mb-1">
                      {message.sender} • {message.timestamp}
                    </p>
                  )}
                  {message.isCurrentUser && (
                    <p className="text-xs text-gray-500 mb-1 order-2">
                      {message.timestamp}
                    </p>
                  )}
                </div>
                {message.type === "text" && (
                  <div
                    className={`p-3 rounded-lg ${
                      message.isCurrentUser
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                )}
                {message.type === "voice" && (
                  <div
                    className={`p-3 rounded-lg flex items-center gap-2 ${
                      message.isCurrentUser
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <div className="flex-1 h-6 bg-gray-300 rounded-full flex items-center px-2">
                      <div className="w-4 h-4 bg-gray-500 rounded-full" />
                      <div className="flex-1 h-1 bg-gray-400 mx-2 rounded-full">
                        <div className="w-1/2 h-full bg-gray-600 rounded-full" />
                      </div>
                      <span className="text-xs">0:00</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center gap-3">
        <div className=" flex gap-3 flex-1 items-center">
          <Smile size={24} />
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Write a message..."
            className="flex-1 h-[50px] rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-gray-300"
        >
          <Paperclip className="h-4 w-4 text-gray-600" />
        </Button>
        <Button
          size="icon"
          className="rounded-full bg-black hover:bg-black/90"
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
        >
          <Send className="h-4 w-4 text-white" />
        </Button>
      </div>
    </div>
  );
}
