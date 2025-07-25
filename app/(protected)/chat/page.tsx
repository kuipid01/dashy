/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import MessagesComponent from "./components/message-component";
import Profile from "./components/profile";
import ChatComponent from "./components/chat-comp";
import { Conversation } from "@/app/(handlers)/chat/types";
import { useFetchUser } from "@/app/(handlers)/auth-handlers/auth";

const Page = () => {
  const [showDetails, setShowDetails] = useState(true);

  const { user, isLoading } = useFetchUser();
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  return (
    <div className=" flex gap-10">
      <MessagesComponent
        currentUserId={user?.ID ?? user?.id}
        setActiveChat={setActiveChat}
      />
      <ChatComponent
        currentUserId={user?.ID ?? user?.id}
        conversation={activeChat}
      />
      {/* {showDetails && <Profile setShowDetails={setShowDetails} />} */}
    </div>
  );
};

export default Page;
