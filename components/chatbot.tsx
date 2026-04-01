"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { useChatOpen } from "./chat-provider";

const transport = new TextStreamChatTransport({ api: "/api/chat" });

export function Chatbot() {
  const { open, toggle } = useChatOpen();
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, setMessages } = useChat({
    transport,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = status === "streaming" || status === "submitted";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  const getText = (msg: (typeof messages)[number]) =>
    msg.parts
      .filter((p): p is Extract<typeof p, { type: "text" }> => p.type === "text")
      .map((p) => p.text)
      .join("");

  return (
    <div
      className={`fixed top-14 right-0 bottom-0 z-40 w-80 lg:w-96 border-l border-zinc-800 bg-zinc-950 flex flex-col transition-transform duration-200 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-zinc-800 shrink-0">
        <span className="text-sm font-medium text-zinc-200">Assistant</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([])}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={toggle}
            className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
            aria-label="Close assistant"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <p className="text-sm text-zinc-500">Ask anything about the docs.</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-lg px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-zinc-800 text-zinc-200"
                  : "bg-zinc-800/60 text-zinc-300"
              }`}
            >
              {msg.role === "user" ? (
                <div className="whitespace-pre-wrap break-words">
                  {getText(msg)}
                </div>
              ) : (
                <div className="chat-markdown break-words">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      code: ({ children, className }) => {
                        const isBlock = className?.includes("language-");
                        if (isBlock) {
                          return <code className={className}>{children}</code>;
                        }
                        return (
                          <code className="bg-zinc-700/50 px-1 py-0.5 rounded text-xs font-mono text-zinc-200">
                            {children}
                          </code>
                        );
                      },
                      pre: ({ children }) => (
                        <pre className="bg-zinc-900 border border-zinc-700 rounded-md p-2 overflow-x-auto my-2 text-xs">
                          {children}
                        </pre>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-4 mb-2 space-y-0.5">{children}</ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-4 mb-2 space-y-0.5">{children}</ol>
                      ),
                      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                      a: ({ href, children }) => (
                        <a href={href} className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                          {children}
                        </a>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-zinc-100">{children}</strong>
                      ),
                      h1: ({ children }) => <p className="font-semibold text-zinc-100 mb-1">{children}</p>,
                      h2: ({ children }) => <p className="font-semibold text-zinc-100 mb-1">{children}</p>,
                      h3: ({ children }) => <p className="font-semibold text-zinc-200 mb-1">{children}</p>,
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-2 border-zinc-600 pl-2 text-zinc-400 my-2">
                          {children}
                        </blockquote>
                      ),
                    }}
                  >
                    {getText(msg)}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-zinc-800/60 rounded-lg px-3 py-2">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-zinc-800 shrink-0">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-700"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <svg className="h-4 w-4 text-zinc-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
