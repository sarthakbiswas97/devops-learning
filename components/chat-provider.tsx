"use client";

import { createContext, useContext, useState } from "react";

const ChatContext = createContext<{
  open: boolean;
  toggle: () => void;
}>({ open: false, toggle: () => {} });

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ChatContext.Provider value={{ open, toggle: () => setOpen((o) => !o) }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatOpen() {
  return useContext(ChatContext);
}
