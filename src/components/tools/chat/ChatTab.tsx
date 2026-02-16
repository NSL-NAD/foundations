"use client";

import { useToolsPanel } from "@/contexts/ToolsPanelContext";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { useFOAChat } from "@/hooks/useFOAChat";

interface ChatTabProps {
  userId: string;
}

export function ChatTab({ userId }: ChatTabProps) {
  const { moduleSlug, lessonSlug } = useToolsPanel();
  const { messages, input, setInput, handleSubmit, isLoading, error } =
    useFOAChat({
      userId,
      moduleSlug,
      lessonSlug,
    });

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <ChatMessageList messages={messages} isLoading={isLoading} />
      </div>
      {error && (
        <div className="px-4 py-2 text-xs text-destructive">
          Something went wrong. Please try again.
        </div>
      )}
      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
