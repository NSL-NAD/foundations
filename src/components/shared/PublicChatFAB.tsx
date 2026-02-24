"use client";

import { useState, useCallback, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessageList } from "@/components/tools/chat/ChatMessageList";
import { ChatInput } from "@/components/tools/chat/ChatInput";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "What will I learn in this course?",
  "Who is this course for?",
  "What's included in the starter kit?",
];

const transport = new DefaultChatTransport({ api: "/api/chat/public" });

export function PublicChatFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [rateLimited, setRateLimited] = useState(false);

  const chat = useChat({
    transport,
    onError: (err) => {
      if (err.message?.includes("429") || err.message?.includes("rate_limited")) {
        setRateLimited(true);
      }
    },
  });

  const isLoading = chat.status === "submitted" || chat.status === "streaming";

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const text = input.trim();
      if (!text || rateLimited) return;
      setInput("");
      chat.sendMessage({ text });
    },
    [input, chat, rateLimited]
  );

  const sendText = useCallback(
    (text: string) => {
      if (rateLimited) return;
      setInput("");
      chat.sendMessage({ text: text.trim() });
    },
    [chat, rateLimited]
  );

  const suggestions = chat.messages.length === 0 ? SUGGESTIONS : undefined;

  return (
    <>
      {/* Chat panel — fixed above the FAB */}
      <div
        className={cn(
          "fixed bottom-20 right-4 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-xl border bg-card shadow-xl transition-all duration-200",
          isOpen
            ? "h-[500px] max-h-[70vh] scale-100 opacity-100"
            : "pointer-events-none h-0 scale-95 opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Course Assistant</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Message list */}
        <div className="min-h-0 flex-1 overflow-hidden">
          <ChatMessageList
            messages={chat.messages}
            isLoading={isLoading}
            suggestions={suggestions}
            onSuggestionClick={sendText}
          />
        </div>

        {/* Rate limit banner */}
        {rateLimited && (
          <div className="shrink-0 border-t bg-muted/50 px-4 py-3 text-center">
            <p className="text-xs font-medium text-muted-foreground">
              You&apos;ve reached the free message limit.
            </p>
            <a
              href="/#pricing"
              className="mt-1 inline-block text-xs font-semibold text-primary hover:underline"
            >
              Sign up to keep chatting →
            </a>
          </div>
        )}

        {/* Input */}
        {!rateLimited && (
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </div>

      {/* FAB button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle course chat"
        >
          {isOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <MessageCircle className="h-5 w-5" />
          )}
        </Button>
      </div>
    </>
  );
}
