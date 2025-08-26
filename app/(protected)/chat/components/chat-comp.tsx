/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Paperclip,
  Send,
  Smile,
  Loader2,
  ImageIcon,
  Video,
  Music,
  FileText,
  File,
  X,
  CloudLightning,
  Trash2,
} from "lucide-react"; // Added Loader2 for loading state
import {
  Conversation,
  Message,
  SendMessageDTO,
} from "@/app/(handlers)/chat/types";
import {
  useDeleteMessageMessage,
  useFetchConversationMessages,
  useSendMessage,
} from "@/app/(handlers)/chat/queries";
import { User } from "@/constants/types";
import { getConversationMessages } from "@/app/(handlers)/chat/api";
import { Card } from "@/components/ui/card";
import { useUploadImage } from "@/app/(handlers)/product/product";
import { toast } from "sonner";
import { url } from "inspector";
import { VoiceRecorder } from "./sound-recorder";
import { AudioPlayer } from "./udio-player";
import WebcamRecorder from "./video-recorder";
import AttachmentPreview from "./attachments";
import AttachmentComp from "./attachments-render";
import { isNull } from "util";
import UserDetailsChat from "./user-details";
import AttachmentsIncoming from "./attachments-incoming";
import TypingIndicator from "./typing-indicator";

interface ChatComponentProps {
  conversation: Conversation | null;
  currentUserId?: number;
}

// NOTE: This implementation requires a function to fetch paginated messages.
// You will need to adapt your data fetching logic to accept an offset and limit.
async function fetchPaginatedMessages(
  conversationId: string,
  offset: number,
  limit: number
): Promise<{ messages: Message[]; hasMore: boolean }> {
  console.log(`Fetching messages for ${conversationId} with offset ${offset}`);
  const res = await getConversationMessages(conversationId, offset, limit);
  return {
    messages: res.messages,
    hasMore: offset + res.messages.length < res.count,
  };
}

interface AttachmentFile {
  file: File;
  id: string;
  preview?: string;
}

export default function ChatComponent({
  conversation,
  currentUserId,
}: ChatComponentProps) {
  const otherUser =
    conversation?.SenderID === currentUserId
      ? conversation?.Receiver
      : conversation?.Sender;
  // --- Refs ---
  const ws = useRef<WebSocket | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [sendingAttachments, setSendingAttachments] = useState<{
    active: boolean;
    type: string;
    amount: number | null;
  }>({
    active: true,
    type: "",
    amount: null,
  });
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  // --- State ---
  type MessageWithDeleted = Message & { deleted?: boolean };
  const [messagesState, setMessagesState] = useState<MessageWithDeleted[]>([]);
  const [isIncomingMessage, setIsIncomingMessage] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState<{
    local: string;
    blob: null | Blob;
  }>({
    local: "",
    blob: null,
  });
  const [videoRecording, setVideoRecording] = useState<{
    local: string;
    blob: null | Blob;
  }>({
    local: "",
    blob: null,
  });
  const [showRecordingStudio, setShowRecordingStudio] =
    useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<{
    value: boolean;
    id: null | number;
  }>({
    value: false,
    id: null,
  });
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messageDialog, setMessageDialog] = useState<{
    active: boolean;
    id: null | string;
  }>({
    active: false,
    id: null,
  });
  const { mutateAsync: sendMessage } = useSendMessage();
  const { mutateAsync: deleteMessage, isPending: deletingMessage } =
    useDeleteMessageMessage();
  const LIMIT = 20;

  // --- Data Fetching ---
  const { data: initialMessages, isLoading: isFetchingInitial } =
    useFetchConversationMessages(conversation?.ID ?? "");
  const { upload } = useUploadImage();

  // --- Effects ---
  useEffect(() => {
    if (!currentUserId || !conversation?.ID) {
      console.log("OMO NO USERID OR COVO");
      return;
    }

    const connect = () => {
      console.log(currentUserId, "This Ran");
      if (!currentUserId) {
        console.log("OMO NO USERID");
        return;
      }
      ws.current = new WebSocket(
        `ws://localhost:4000/v1/api/chat-ws/ws?user_id=${currentUserId}`
      );

      ws.current.onopen = () => {
        console.log("WebSocket connected");
      };

      ws.current.onmessage = (event) => {
        console.log(conversation?.ID, "gethh,mmes");
        console.log("Raw event received", event.data);
        try {
          const parsedData = JSON.parse(event.data);
          const { type, data } = parsedData;
          // console.log(type, "TYPE AND DATA");
          console.log(parsedData);
          // console.log(data?.ConversationID, " CONVERSATON ID");
          // console.log(conversation?.ID, " CONVERSATON ID COMPONENT");

          if (
            (type === "new_message" || type === "message_sent") &&
            data?.ConversationID === conversation?.ID
          ) {
            console.log("GOT TO MESSAGE PART");
            setIsIncomingMessage(true);
            setMessagesState((prev) => [...prev, data]);
          }
          if (
            type === "message_deleted" &&
            parsedData?.conversationId === conversation?.ID
          ) {
            if (parsedData.receiver_id) {
              console.log(["That person deleted"]);
              // receiver: show 'message deleted' text
              const updatedForReceiver = messagesState.map((message) =>
                message.ID === parsedData.message_id
                  ? {
                      ...message,
                      deleted: true,
                      content: "", // hide original content
                    }
                  : message
              );
              setMessagesState(updatedForReceiver);
            } else {
              console.log(["I deleted"]);
              // sender: remove message entirely
              const updatedMessages = messagesState.filter(
                (message) => message.ID !== parsedData.message_id
              );
              setMessagesState(updatedMessages);
            }
          }

          if (
            (type === "awaiting_attachments" ||
              type === "attachments_scheduler_sent") &&
            data?.conversationId === conversation?.ID
          ) {
            console.log("we are here for a minute");
            setIsIncomingMessage(true);

            const lengthNum =
              typeof data.length === "string"
                ? parseInt(data.length)
                : Number(data.length);

            setSendingAttachments({
              active: true,
              amount: lengthNum,
              type: "", // optionally pass type from the original message
            });
          }
          if (
            type === "attachments_uploaded" &&
            data?.conversationId === conversation?.ID
          ) {
            // hide spinner, show attachments
            setSendingAttachments({
              active: false,
              type: "",
              amount: null,
            });
          }
          if (
            type === "message_incoming" &&
            data?.conversationId === conversation?.ID
          ) {
            console.log("Partner is typing...");
            setIsTyping({
              value: true,
              id: data.receiverId,
            });
            console.log("[WE TRIGGERED TYPING STATE]", isTyping);
          }
          if (
            type === "stopped_typing" &&
            data?.conversationId === conversation?.ID
          ) {
            console.log("Partner stopped typing.");
            setIsTyping({
              value: false,
              id: null,
            });
            console.log("[WE TRIGGERED STOPPED TYPING STATE]", isTyping);
          }
          if (type === "online_status") {
            setIsOnline(parsedData.online);
          }
          if (data.type === "user_online") {
            // Example: update your UI state to mark this user as online
            setIsOnline(data.userId === (otherUser?.ID ?? otherUser?.id));
          }
        } catch (err) {
          console.error("Failed to parse WS message", err);
        }
      };

      ws.current.onclose = () => {
        console.log("WebSocket disconnected, retrying in 3s...");
        setTimeout(connect, 3000);
      };

      ws.current.onerror = (err) => {
        console.error("WebSocket error:", err);
        ws.current?.close();
      };
    };

    connect();

    return () => {
      ws.current?.close();
    };
  }, [currentUserId, conversation?.ID]);

  // Effect to reset state and load initial messages when the conversation changes
  useEffect(() => {
    if (initialMessages?.messages) {
      setMessagesState([...initialMessages.messages].reverse());
      setOffset(initialMessages.messages.length);
      setIsIncomingMessage(true);
      // Correctly check if the number of messages is less than the limit
      setHasMore(initialMessages.messages.length < initialMessages.count);
    } else {
      // Clear state when conversation is deselected or has no messages
      setMessagesState([]);
      setOffset(0);
      setHasMore(true);
    }
    // FIX: Simplified and more stable dependency array
  }, [initialMessages, conversation?.ID]);
  // console.log(messagesState, "message state");
  // This layout effect is the key to maintaining scroll position.
  // It runs synchronously after the DOM is updated but before the browser paints.
  useLayoutEffect(() => {
    const viewport = scrollViewportRef.current;
    if (previousScrollHeightRef.current !== null && viewport) {
      const scrollHeightDifference =
        viewport.scrollHeight - previousScrollHeightRef.current;

      viewport.scrollTop = viewport.scrollTop + scrollHeightDifference;
      previousScrollHeightRef.current = null;
    }
  }, [messagesState]); // Or better: trigger only after loadMoreMessages

  // --- Core Logic for Infinite Scroll ---

  const loadMoreMessages = async () => {
    console.log("trying toload");
    if (isFetchingMore || !hasMore || !conversation) return;

    setIsFetchingMore(true);
    if (scrollViewportRef.current) {
      // Store the scroll height *before* new messages are rendered
      previousScrollHeightRef.current = scrollViewportRef.current.scrollHeight;
    }

    try {
      const { messages: newMessages, hasMore: newHasMore } =
        await fetchPaginatedMessages(conversation.ID, offset, LIMIT);

      // console.log(offset, LIMIT);
      console.log(newMessages, "new messages", newHasMore, "newhas more");
      if (newMessages.length > 0) {
        // Prepend older messages to the top of the state array
        setMessagesState((prev) => [...newMessages.reverse(), ...prev]);
        setOffset((prev) => prev + newMessages.length);
      }
      setHasMore(newHasMore);
    } catch (error) {
      console.error("Failed to fetch more messages:", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  // --- Event Handlers ---

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // console.log(hasMore);
    const { scrollTop } = e.currentTarget;
    if (scrollTop === 0 && hasMore && !isFetchingMore && !isFetchingInitial) {
      console.log("got here");
      loadMoreMessages();
    }
  };

  const handleSendMessage = async () => {
    // console.log("got here before check");
    if (
      (!newMessage.trim() &&
        attachments.length === 0 &&
        !voiceRecording.blob &&
        !videoRecording.blob) ||
      !conversation ||
      !currentUserId ||
      !ws.current ||
      ws.current.readyState !== WebSocket.OPEN
    ) {
      console.log(ws?.current?.readyState);
      toast.error("WebSocket not connected");
      return;
    }
    // console.log("got here after check");
    const localMessageContent = newMessage;
    setNewMessage(""); // Clear input immediately
    setAttachments([]);

    let attachmentUrls: string[] | undefined;

    const uploadFiles = async (files: File[]) => {
      try {
        const receiverId = String(otherUser?.ID ?? otherUser?.id);

        // 1. Notify receiver that attachments are being uploaded
        const sendingPayload: Record<string, any> = {
          receiver_id: receiverId,
          conversation_id: conversation.ID,
          length: files.length.toString(),
          type: "sending_attachments",
        };

        ws?.current?.send(JSON.stringify(sendingPayload));

        // 2. Perform the upload
        const res = await upload(files);
        if (!res?.urls || !Array.isArray(res.urls)) {
          toast.error("Invalid upload response");
          return undefined;
        }

        // 3. Notify receiver that upload is done and send the URLs
        const uploadedPayload: Record<string, any> = {
          receiver_id: receiverId,
          conversation_id: conversation.ID,
          length: files.length.toString(),
          type: "attachments_uploaded",
        };

        ws?.current?.send(JSON.stringify(uploadedPayload));
        console.log("[GOT TO ATTACHMENTS UPLODADE SECTION]");
        setSendingAttachments({
          active: false,
          type: "",
          amount: null,
        });
        return res.urls;
      } catch (err) {
        toast.error("Upload failed");
        console.error(err);
        setSendingAttachments({
          active: false,
          type: "",
          amount: null,
        });
        return undefined;
      }
    };

    // Upload voice recording if available
    if (voiceRecording.blob) {
      const voiceFile = new window.File(
        [voiceRecording.blob],
        "voice-message.webm",
        { type: "audio/webm" }
      );
      attachmentUrls = await uploadFiles([voiceFile]);
      if (!attachmentUrls) return;
    }
    if (videoRecording.blob) {
      const videoFile = new window.File(
        [videoRecording.blob],
        "webcam-video.webm",
        { type: "video/webm" }
      );
      attachmentUrls = await uploadFiles([videoFile]);
      if (!attachmentUrls) return;
    }

    // Upload attachments if any
    if (!attachmentUrls && attachments.length > 0) {
      const files = attachments.map((a) => a.file);
      attachmentUrls = await uploadFiles(files);
      if (!attachmentUrls) return;
    }

    const stringUrl = JSON.stringify(attachmentUrls);

    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      ID: `temp-${Date.now()}`,
      Content: localMessageContent,
      SenderID: currentUserId,
      content: localMessageContent,
      conversation: conversation,
      ReadByReceiver: false,
      Delivered: false,
      conversationId: conversation.ID,
      CreatedAt: new Date().toISOString(),
      Attachments: stringUrl,
      Sender: { ID: currentUserId, Name: "You", id: currentUserId } as User,
    };

    // setMessagesState((prev) => [...prev, optimisticMessage]);
    // setIsIncomingMessage(true);

    try {
      const payload: Record<string, any> = {
        content:
          voiceRecording.blob && videoRecording.blob && !localMessageContent
            ? ""
            : localMessageContent,
        receiver_id: String(otherUser?.ID ?? otherUser?.id),
        conversation_id: conversation.ID,
        type: "send_message",
      };

      if (attachmentUrls) {
        payload.attachments = stringUrl;
      }
      // console.log("got here", payload);
      ws.current.send(JSON.stringify(payload));
      // await sendMessage(payload);

      // Clear recording and attachments after successful send
      setAttachments([]);
      setVoiceRecording({ blob: null, local: "" });
    } catch (error) {
      console.error("Failed to send message:", error);
      // Rollback optimistic update
      setMessagesState((prev) =>
        prev.filter((m) => m.id !== optimisticMessage.id)
      );
      setNewMessage(localMessageContent);
    }
  };

  let typingTimeout: NodeJS.Timeout | null = null;

  const TYPING_INDICATOR_DEBOUNCE_TIME = 500; // milliseconds

  let isTypingSent = false;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);
    const receiverId = String(otherUser?.ID ?? otherUser?.id);
    if (value.length > 0) {
      // If the typing indicator hasn't been sent yet, or if the timeout has expired,
      // send the "typing" event.
      if (!isTypingSent) {
        // ws?.current?.send(
        //   JSON.stringify({
        //     type: "typing",
        //     conversation_id: conversation?.ID,
        //   })
        // );

        const typingPayload: Record<string, any> = {
          receiver_id: receiverId,
          conversation_id: conversation?.ID,
          type: "typing",
        };

        ws?.current?.send(JSON.stringify(typingPayload));
        console.log("[TypingPayload],", typingPayload);
        isTypingSent = true;
      }

      // Clear any previous stopped_typing timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Set a new timeout to send "stopped_typing" after a period of inactivity
      typingTimeout = setTimeout(() => {
        const typingPayload: Record<string, any> = {
          receiver_id: receiverId,
          conversation_id: conversation?.ID,
          type: "stopped_typing",
        };

        ws?.current?.send(JSON.stringify(typingPayload));
        console.log("[StoppedTypingPayload],", typingPayload);

        isTypingSent = false; // Reset the flag
      }, 2000); // 2 seconds of inactivity = stopped typing
    } else {
      // If the input is empty, immediately send stopped_typing
      ws?.current?.send(
        JSON.stringify({
          type: "stopped_typing",
          conversation_id: conversation?.ID,
        })
      );
      isTypingSent = false;
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const scrollRef = useRef<HTMLDivElement>(null);
  const receiverId = String(otherUser?.ID ?? otherUser?.id);
  //check if user is online
  useEffect(() => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.log(
        "WebSocket not connected. ReadyState:",
        ws?.current?.readyState
      );
      // toast.error("WebSocket not connected");
      return;
    }

    if (!receiverId || !conversation?.ID) {
      console.warn("Missing receiverId or conversation ID");
      return;
    }
    console.log("We ran");
    const checkOnlinePayload = {
      userId: Number(receiverId),
      conversation_id: conversation.ID,
      type: "check_online",
    };

    ws.current.send(JSON.stringify(checkOnlinePayload));
  }, [receiverId, conversation?.ID, ws.current]);

  useEffect(() => {
    if (isIncomingMessage) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      setIsIncomingMessage(false);
    }
  }, [messagesState]);

  // image component
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    files.forEach((file) => {
      const id = Math.random().toString(36).substr(2, 9);
      const attachment: AttachmentFile = { file, id };

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setAttachments((prev) =>
            prev.map((att) =>
              att.id === id
                ? { ...att, preview: e.target?.result as string }
                : att
            )
          );
        };
        reader.readAsDataURL(file);
      }

      setAttachments((prev) => [...prev, attachment]);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  // console.log(messageDialog);
  // --- Render Logic ---

  if (!conversation) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a conversation to start chatting
      </div>
    );
  }

  if (!currentUserId) return null;

  return (
    <div className="flex-1 h-[80vh] bgblur relative overflow-hidden flex flex-col  rounded-xl shadow-lg border border-gray-200">
      {/* Chat Header */}
      <div className="p-4 border-b sticky top-0 z-20 bg-white border-gray-200 flex items-center gap-3">
        <Avatar
          onClick={() => {
            setShowUserDetails(true);
          }}
          className="size-10 cursor-pointer"
        >
          <AvatarImage
            src={
              otherUser?.avatar ??
              otherUser?.avatar_url ??
              otherUser?.AvatarURL ??
              ""
            }
          />
          <AvatarFallback className="bg-black  text-white font-semibold">
            {otherUser?.Name?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-bold text-gray-800">{otherUser?.Name}</h2>
          <p className="text-sm font-medium text-gray-600">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {showUserDetails && otherUser && (
        <UserDetailsChat user={otherUser} setShowDetails={setShowUserDetails} />
      )}
      {/* Chat Messages */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setMessageDialog({
            active: false,
            id: null,
          });
        }}
        className="flex-1 pb-25 overflow-y-auto"
        onScroll={handleScroll}
        ref={scrollViewportRef}
      >
        <div className="space-y-4 p-4 pb-2 ">
          {isFetchingMore && (
            <div className="flex justify-center items-center p-2">
              <Loader2 className="h-6 w-6 text-gray-500 animate-spin" />
            </div>
          )}

          {messagesState.map((message: MessageWithDeleted) => (
            <div
              key={message.id}
              className={`flex  relative ${
                message.SenderID === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div className={`max-w-[70%] flex items-end gap-2`}>
                {message.SenderID !== currentUserId && (
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs bg-gray-200 text-gray-700 font-semibold">
                      {message.Sender?.Name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  onContextMenu={(e) => {
                    e.preventDefault();
                    console.log("i dey here", message.ID);

                    setMessageDialog({
                      active: true,
                      id: message.ID,
                    });
                  }}
                  className={`p-3 relative w-fit flex flex-col justify-end items-end rounded-lg ${
                    message.SenderID === currentUserId
                      ? "bg-black text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {messageDialog.active && messageDialog.id === message.ID && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 bottom-full z-[1000] min-w-[200px] bg-white shadow-xl rounded-lg p-3 flex flex-col backdrop-blur-md 
               animate-fade-in-up transition-all duration-200"
                    >
                      {currentUserId === message.SenderID && (
                        <button
                          className="text-red-600 flex items-center justify-between font-medium hover:text-red-800 transition disabled:opacity-50"
                          disabled={deletingMessage}
                          onClick={async () => {
                            if (currentUserId !== message.SenderID) {
                              toast.error(
                                "You can only delete your own messages"
                              );
                              return;
                            }

                            const delPayload = {
                              message_id: message.ID,
                              conversation_id: Number(conversation.ID),
                              type: "delete_message",
                            };

                            ws?.current?.send(JSON.stringify(delPayload));
                            // await deleteMessage({ conversationId: message.ID });
                            setMessageDialog({ active: false, id: null });
                          }}
                        >
                          <Trash2 /> Delete Message
                        </button>
                      )}
                    </div>
                  )}
                  <AttachmentComp attachments={message.Attachments} />
                  {message?.deleted ? (
                    <p className=" italic font-medium text-gray-500 ">
                      This Message has been Deleted{" "}
                    </p>
                  ) : (
                    message.Content
                  )}
                </div>
              </div>
            </div>
          ))}
          {currentUserId === isTyping.id && (
            <TypingIndicator isTyping={isTyping.value} />
          )}
          <AttachmentsIncoming state={sendingAttachments} />

          <div ref={scrollRef} />
        </div>
      </div>
      {/* Attachment Previews */}
      {!voiceRecording.blob && attachments.length > 0 && (
        <AttachmentPreview
          setAttachments={setAttachments}
          attachments={attachments}
        />
      )}
      {/* Voice Previews */}
      {showRecordingStudio && (
        <AudioPlayer
          setIsRecording={setIsRecording}
          isRecording={isRecording}
          setVoiceRecord={setVoiceRecording}
          sendMessage={handleSendMessage}
          // src={voiceRecording.local}
          setShowRecordingStudio={setShowRecordingStudio}
        />
      )}

      {/* Message Input */}
      {!showRecordingStudio && (
        <div className="p-4 absolute bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 flex items-center gap-3">
          <div className="flex gap-3 flex-1 items-center">
            {/* <Smile size={24} className="text-gray-500" /> */}
            <VoiceRecorder
              isRecording={showRecordingStudio}
              setIsRecording={setShowRecordingStudio}
              // onUpload={(url, blob) => {
              //   setVoiceRecording({
              //     local: url,
              //     blob: blob,
              //   });
              // }}
            />
            {/* <WebcamRecorder
            setVideoRecording={setVideoRecording}
            videoRecording={videoRecording}
          /> */}
            <Input
              value={newMessage}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Write a message..."
              className="flex-1 h-[50px] rounded-full border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button
            onClick={() => fileInputRef.current?.click()}
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
            disabled={
              (!newMessage.trim() &&
                attachments.length === 0 &&
                !voiceRecording.blob &&
                !videoRecording.blob) ||
              isFetchingMore
            }
          >
            <Send className="h-4 w-4 text-white" />
          </Button>
        </div>
      )}
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
