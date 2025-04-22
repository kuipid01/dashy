"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import clsx from "clsx";

// Mock message data
interface Message {
  id: string;
  sender: string;
  initials: string;
  content: string;
  timestamp: string;
  isUnread: boolean;
}

const mockMessages: Message[] = [
  {
    id: "1",
    sender: "John Doe",
    initials: "JD",
    content:
      "Hey, loved your latest product launch tweet! Can we discuss a collab?",
    timestamp: "2h ago",
    isUnread: true
  },
  {
    id: "2",
    sender: "Jane Smith",
    initials: "JS",
    content: "Quick question about the phone case specs...",
    timestamp: "5h ago",
    isUnread: false
  },
  {
    id: "3",
    sender: "Alex Brown",
    initials: "AB",
    content: "Can you share the discount code from your last post?",
    timestamp: "1d ago",
    isUnread: true
  },
  {
    id: "4",
    sender: "Alex Brown",
    initials: "AB",
    content: "Can you share the discount code from your last post?",
    timestamp: "1d ago",
    isUnread: true
  },
  {
    id: "5",
    sender: "Alex Brown",
    initials: "AB",
    content: "Can you share the discount code from your last post?",
    timestamp: "1d ago",
    isUnread: true
  }
  // Add more mock messages as needed
];

export default function MessagesComponent() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);

  const handleMessageClick = (messageId: string) => {
    setSelectedMessage(messageId);
    // Mark message as read
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isUnread: false } : msg
      )
    );
  };

  const SingleMessage = ({ message }: { message: Message }) => {
    return (
      <div
        className={`flex items-center gap-3 w-[70%] overflow-hidden p-3 rounded-md cursor-pointer transition-all duration-200 ${
          selectedMessage === message.id
            ? "bg-black/90 text-white "
            : "hover:bg-gray-50"
        } ${message.isUnread ? "bg-gray-100" : ""}`}
        onClick={() => handleMessageClick(message.id)}
      >
        <Avatar className="size-12">
          <AvatarFallback className="bg-black text-white font-semibold">
            {message.initials}
          </AvatarFallback>
        </Avatar>
        <div className="">
          <div className="flex items-center justify-between">
            <p
              className={clsx(
                "font-semibold  truncate",
                selectedMessage === message.id ? "text-white " : " text-black"
              )}
            >
              {message.sender}
            </p>
            <p className="text-xs text-gray-100">{message.timestamp}</p>
          </div>
          <p
            className={clsx(
              "text-sm  truncate",
              selectedMessage === message.id ? "text-white " : " text-black/50"
            )}
          >
            {message.content}
          </p>
          {message.isUnread && <Badge className="mt-1 bg-black">Unread</Badge>}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white w-[30%] h-[80vh] p-6 rounded-xl shadow-lg flex flex-col gap-6 border border-gray-200">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full bg-gray-100 rounded-lg grid grid-cols-2">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            All ({messages.length})
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Unread ({messages.filter((msg) => msg.isUnread).length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <ScrollArea className="h-[400px] pr-2">
            <div className="space-y-3  w-full">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No messages yet.
                </div>
              ) : (
                messages.map((message) => (
                  <SingleMessage key={message.id} message={message} />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="unread" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {messages.filter((msg) => msg.isUnread).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No unread messages.
                </div>
              ) : (
                messages
                  .filter((msg) => msg.isUnread)
                  .map((message) => (
                    <SingleMessage key={message.id} message={message} />
                  ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
