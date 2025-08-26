"use client";
import { useWebSocketStore } from "@/stores/ws-store";
import { useEffect, useRef } from "react";

export const WebSocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { setWs } = useWebSocketStore();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:4000/v1/api/chat-ws/ws`);
    wsRef.current = ws;
    setWs(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  return children;
};
