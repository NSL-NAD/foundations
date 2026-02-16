"use client";

import { useToolsPanel } from "@/contexts/ToolsPanelContext";
import { ChatMessageList } from "./ChatMessageList";
import { ChatInput } from "./ChatInput";
import { ChatUpgradeBanner } from "./ChatUpgradeBanner";
import { useFOAChat } from "@/hooks/useFOAChat";

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

  return (
    <div className="flex h-full flex-col">
      {/* Usage indicator */}
      {!usageLoading && (
        <div className="flex items-center justify-between border-b px-4 py-2">
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

      <div className="flex-1 overflow-hidden">
        <ChatMessageList messages={messages} isLoading={isLoading} />
      </div>

      {error && (
        <div className="px-4 py-2 text-xs text-destructive">
          Something went wrong. Please try again.
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
