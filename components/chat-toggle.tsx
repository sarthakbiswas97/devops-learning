"use client";

import { useChatOpen } from "./chat-provider";

export function ChatToggle() {
  const { open, toggle } = useChatOpen();

  return (
    <button
      onClick={toggle}
      className={`text-xs transition-colors ${
        open
          ? "text-zinc-100"
          : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {open ? "Close Assistant" : "AI Assistant"}
    </button>
  );
}
