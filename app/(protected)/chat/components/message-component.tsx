/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import clsx from "clsx";
import { Conversation, Message } from "@/app/(handlers)/chat/types";

import { Store } from "@/types/store";
import {
  useFetchUserConversations,
  useStartConvo,
} from "@/app/(handlers)/chat/queries";
import { useFetchUser } from "@/app/(handlers)/auth-handlers/auth";
import { useSearchUserStores } from "@/app/(handlers)/user/user";
import { User } from "@/constants/types";
import { getUserConversations } from "@/app/(handlers)/chat/api";

// // Mock message data
// interface Message {
//   id: string;
//   sender: string;
//   initials: string;
//   content: string;
//   timestamp: string;
//   isUnread: boolean;
// }

// const mockMessages: Message[] = [
//   {
//     id: "1",
//     sender: "John Doe",
//     initials: "JD",
//     content:
//       "Hey, loved your latest product launch tweet! Can we discuss a collab?",
//     timestamp: "2h ago",
//     isUnread: true,
//   },
//   {
//     id: "2",
//     sender: "Jane Smith",
//     initials: "JS",
//     content: "Quick question about the phone case specs...",
//     timestamp: "5h ago",
//     isUnread: false,
//   },
//   {
//     id: "3",
//     sender: "Alex Brown",
//     initials: "AB",
//     content: "Can you share the discount code from your last post?",
//     timestamp: "1d ago",
//     isUnread: true,
//   },
//   {
//     id: "4",
//     sender: "Alex Brown",
//     initials: "AB",
//     content: "Can you share the discount code from your last post?",
//     timestamp: "1d ago",
//     isUnread: true,
//   },
//   {
//     id: "5",
//     sender: "Alex Brown",
//     initials: "AB",
//     content: "Can you share the discount code from your last post?",
//     timestamp: "1d ago",
//     isUnread: true,
//   },
//   // Add more mock messages as needed
// ];

export default function MessagesComponent({
  setActiveChat,
  currentUserId,
}: {
  currentUserId?: number;
  setActiveChat: React.Dispatch<React.SetStateAction<Conversation | null>>;
}) {
  type UserResult = {
    type: "user";
    data: User;
  };

  type StoreResult = {
    type: "store";
    data: Store;
  };

  type SearchResult = UserResult | StoreResult;
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null);

  // Debounce query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(timer);
  }, [query]);
  // const handleMessageClick = (messageId: string) => {
  //   setSelectedMessage(messageId);
  //   // Mark message as read
  //   setMessages((prev) =>
  //     prev.map((msg) =>
  //       msg.id === messageId ? { ...msg, isUnread: false } : msg
  //     )
  //   );
  // };
  const { user, isLoading } = useFetchUser();
  const { data: conversations, isLoading: fetchingConversations } =
    useFetchUserConversations();
  const { mutateAsync: startConvo } = useStartConvo();
  const { data: searchResults, isLoading: searching } = useSearchUserStores(
    debouncedQuery ?? ""
  );

  console.log(conversations, "all conos");
  useEffect(() => {
    if (searchResults) {
      setResults(searchResults);
    }
  }, [searchResults]);

  // console.log(conversations);
  // console.log(results, searchResults);
  const startConversation = async () => {
    if (!selectedUser || !user) return;

    const senderId =
      selectedUser.type === "store"
        ? String((selectedUser.data as Store).user_id)
        : String(
            (selectedUser.data as User).id ?? (selectedUser.data as User).ID
          );

    const receiverId = String(user.ID ?? user.id);
    // console.log(senderId, receiverId);
    // console.log(selectedUser);
    // return;
    startConvo({ senderId: Number(senderId), receiverId: Number(receiverId) });

    setShowDialog(false);
    setQuery("");
    setSelectedUser(null);
  };

  const SingleMessage = ({ message }: { message: Conversation }) => {
    // console.log(message);
    const otherUser =
      message.SenderID === currentUserId ? message.Receiver : message.Sender;
    return (
      <div
        className={`flex bg-[#D1D5DB]/90 px-4 backdrop-blur-3xl h-[80px]   _items-center gap-3 w-full overflow-hidden py-4 rounded-lg cursor-pointer transition-all duration-200 ${
          selectedMessage === message?.ID
            ? "bg-black/90 text-white "
            : "_hover:bg-gray-50"
        } ${message?.Messages?.[0]?.ReadByReceiver ? "_bg-gray-100" : ""}`}
        onClick={() => setActiveChat(message)}
      >
        <Avatar className="size-12">
          <AvatarFallback className="bg-black text-white font-semibold">
            {otherUser?.Name?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className=" w-full flex flex-col justify-between">
          <div className="flex gap-5  font-bold w-full items-center justify-between">
            <p
              className={clsx(
                "font-semibold  capitalize truncate",
                selectedMessage === message?.ID ? "text-white " : " text-black"
              )}
            >
              {otherUser?.Name}
            </p>
            <p className="text-xs text-black/90">
              {new Date(message?.CreatedAt).toDateString() ?? ""}
            </p>
          </div>
          <p
            className={clsx(
              "text-sm  truncate",
              selectedMessage === message?.ID ? "text-black " : " text-black"
            )}
          >
            {message?.Messages?.[0]?.Content}
          </p>
          {/* 
          {message.Messages.length > 0 &&
            !message.Messages[0].ReadByReceiver && (
              <Badge className="mt-1 bg-black">Unread</Badge>
            )} */}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-primary border-gray-900 hidden  lg:w-[30%] h-[80vh] p-4 rounded-xl shadow-lg lg:flex flex-col gap-6 border ">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-bold text-gray-800">Messages</h2>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full bg-black rounded-lg grid grid-cols-2">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            All ({conversations?.length})
          </TabsTrigger>
          {/* <TabsTrigger
            value="unread"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Unread ({messages?.filter((msg) => !msg.ReadByReceiver).length})
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <ScrollArea className="h-[400px] pr-2">
            <div className="space-y-3  w-full">
              {conversations?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No conversations ?yet. Start one
                </div>
              ) : (
                conversations?.map((convo: Conversation) => (
                  <SingleMessage key={convo.ID} message={convo} />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        {/* <TabsContent value="unread" className="mt-4">
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {messages?.filter((msg) => !msg.ReadByReceiver).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No unread messages.
                </div>
              ) : (
                messages
                  ?.filter((msg) => !msg.ReadByReceiver)
                  .map((message) => (
                    <SingleMessage key={message.id} message={message} />
                  ))
              )}
            </div>
          </ScrollArea>
        </TabsContent> */}
      </Tabs>

      <button
        onClick={() => setShowDialog(true)}
        className=" text-white backdrop-blur-3xl cursor-pointer shadow-2xl shadow-gray-200 text-[40px] rounded-full size-[50px] absolute bottom-4 right-5 bg-[#b53a53] flex items-center justify-center hover:bg-[#b53a53]/80"
      >
        +
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-primary _bg-opacity-90 _backdrop-blur-3xl flex _items-center justify-center z-50">
          <div className="bg-primary w-full max-w-md rounded-lg p-6 space-y-4 shadow-md">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Start Conversation</h2>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-500 hover:text-black"
              >
                &times;
              </button>
            </div>

            <input
              type="text"
              placeholder="Search user by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />

            {searching && <p className="text-sm text-gray-500">Searching...</p>}

            <div className="max-h-40 overflow-y-auto space-y-1">
              {results.length === 0 ? (
                <p>No Store and user with that name</p>
              ) : (
                results?.map((user) => {
                  const isStore = user.type === "store";
                  const data = user.data as Store | User;
                  const displayName = isStore
                    ? (data as Store).name
                    : (data as User).name ?? (data as User).Name;
                  const id = isStore ? (data as Store).id : (data as User).id;
                  // console.log(user, "user");
                  return (
                    <div
                      key={id}
                      onClick={() => {
                        console.log("passing", user);
                        setSelectedUser(user);
                      }}
                      className={`p-2 capitalize border rounded cursor-pointer ${
                        selectedUser?.data?.id === id
                          ? "bgblur font-medium"
                          : ""
                      }`}
                    >
                      {displayName}
                    </div>
                  );
                })
              )}
            </div>

            <button
              onClick={startConversation}
              className="w-full mt-2 bg-chart-1 text-white py-2 rounded cursor-pointer _hover:bg-green-700 disabled:opacity-50"
              disabled={!selectedUser}
            >
              Start Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
