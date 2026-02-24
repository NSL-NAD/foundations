"use client";

import { useMemo } from "react";
import { useToolsPanel } from "@/contexts/ToolsPanelContext";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { ChatUpgradeBanner } from "./ChatUpgradeBanner";
import { useFOAChat } from "@/hooks/useFOAChat";

const DASHBOARD_SUGGESTIONS = [
  "Take me to the part of the course that talks about...",
  "What are the main topics covered in this course?",
  "Help me review what I've learned so far",
];

interface ChatTabProps {
  userId: string;
  email?: string;
}

export function ChatTab({ userId, email }: ChatTabProps) {
  const { moduleSlug, lessonSlug } = useToolsPanel();
  const {
    messages,
    input,
    setInput,
    handleSubmit,
    sendText,
    isLoading,
    error,
    usage,
    usageLoading,
    isLocked,
    showNudge,
    dismissNudge,
  } = useFOAChat({
    userId,
    moduleSlug,
    lessonSlug,
  });

  // Show suggestions only when no lesson context (Dashboard / Course index)
  const suggestions = useMemo(
    () => (!moduleSlug ? DASHBOARD_SUGGESTIONS : undefined),
    [moduleSlug]
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Usage indicator */}
      {!usageLoading && (
        <div className="flex shrink-0 items-center justify-between border-b px-4 py-2">
          <span className="text-[11px] text-muted-foreground">
            {usage.hasFullAccess ? (
              <span className="font-medium text-primary">✦ Unlimited</span>
            ) : (
              <>
                {usage.used}/{usage.limit} free messages
              </>
            )}
          </span>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-hidden">
        <ChatMessageList
          messages={messages}
          isLoading={isLoading}
          suggestions={suggestions}
          onSuggestionClick={sendText}
        />
      </div>

      {error && (
        <div className="shrink-0 px-4 py-2 text-xs text-destructive">
          {error.message || "Something went wrong. Please try again."}
        </div>
      )}

      {/* Nudge banner — shown at 50% and 75% usage */}
      {showNudge && (
        <ChatUpgradeBanner
          variant="nudge"
          used={usage.used}
          limit={usage.limit}
          onDismiss={dismissNudge}
          email={email}
        />
      )}

      {/* Locked state — replaces input at 100% usage */}
      {isLocked ? (
        <ChatUpgradeBanner
          variant="locked"
          used={usage.used}
          limit={usage.limit}
          email={email}
        />
      ) : (
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          disabled={isLocked}
        />
      )}
    </div>
  );
}
