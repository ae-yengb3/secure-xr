"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/lib/hook";
import { wsManager } from "@/lib/utils/websocket";

export default function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (token && !wsManager.isWebSocketConnected()) {
      wsManager.connect(token).catch(console.error);
    }

    return () => {
      // Don't disconnect on unmount to maintain connection across pages
    };
  }, [token]);

  return <>{children}</>;
}