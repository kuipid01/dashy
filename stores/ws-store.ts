// stores/useWebSocketStore.ts
import { create } from "zustand";

type WebSocketStore = {
  ws: WebSocket | null;
  setWs: (ws: WebSocket) => void;
};

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  ws: null,
  setWs: (ws) => set({ ws }),
}));
