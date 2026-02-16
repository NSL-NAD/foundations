"use client";

import { useEffect, useRef } from "react";
import { ChatMessage } from "./ChatMessage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Loader2, Sparkles } from "lucide-react";
import type { UIMessage } from "ai";

function getTextContent(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("");
}

interface ChatMessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
  suggestions?: string[];
  onSuggestionClick?: (text: string) => void;
}

export function ChatMessageList({
  messages,
  isLoading,
  suggestions,
  onSuggestionClick,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    const hasLessonContext = !suggestions || suggestions.length === 0;

    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Bot className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">Architecture Assistant</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {hasLessonContext
              ? "Ask me anything about the lesson or architecture concepts."
              : "Ask me anything about the course or architecture concepts."}
          </p>
        </div>

        {/* Suggestion chips — shown when no lesson context */}
        {suggestions && suggestions.length > 0 && onSuggestionClick && (
          <div className="mt-2 flex flex-col gap-2 w-full max-w-[280px]">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSuggestionClick(suggestion)}
                className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2.5 text-left text-xs text-foreground transition-colors hover:border-primary/40 hover:bg-primary/10"
              >
                <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-1 py-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role as "user" | "assistant"}
            content={getTextContent(msg)}
          />
        ))}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
