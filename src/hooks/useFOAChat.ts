"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type FormEvent,
} from "react";

interface UseFOAChatOptions {
  userId: string;
  moduleSlug: string;
  lessonSlug: string;
}

interface UsageData {
  used: number;
  limit: number;
  hasFullAccess: boolean;
}

export function useFOAChat({
  userId,
  moduleSlug,
  lessonSlug,
}: UseFOAChatOptions) {
  const [input, setInput] = useState("");
  const [usage, setUsage] = useState<UsageData>({
    used: 0,
    limit: 25,
    hasFullAccess: false,
  });
  const [usageLoading, setUsageLoading] = useState(true);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  // Fetch usage on mount
  useEffect(() => {
    setUsageLoading(true);
    fetch("/api/chat/usage")
      .then((res) => res.json())
      .then((data: UsageData) => {
        setUsage(data);
        setUsageLoading(false);
      })
      .catch(() => {
        setUsageLoading(false);
      });
  }, []);

  // Refetch usage when window regains focus (e.g. after Stripe checkout)
  useEffect(() => {
    const handleFocus = () => {
      fetch("/api/chat/usage")
        .then((res) => res.json())
        .then((data: UsageData) => {
          setUsage(data);
        })
        .catch(() => {});
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: { userId, moduleSlug, lessonSlug },
      }),
    [userId, moduleSlug, lessonSlug]
  );

  const chat = useChat({ transport });

  const handleSubmit = useCallback(
    (e?: FormEvent) => {
      e?.preventDefault();
      const text = input.trim();
      if (!text) return;
      setInput("");
      chat.sendMessage({ text });
      // Optimistically increment usage count
      if (!usage.hasFullAccess) {
        setUsage((prev) => ({ ...prev, used: prev.used + 1 }));
      }
    },
    [input, chat, usage.hasFullAccess]
  );

  // Direct send without going through input state (for suggestion chips)
  const sendText = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setInput("");
      chat.sendMessage({ text: trimmed });
      if (!usage.hasFullAccess) {
        setUsage((prev) => ({ ...prev, used: prev.used + 1 }));
      }
    },
    [chat, usage.hasFullAccess]
  );

  const isLoading = chat.status === "submitted" || chat.status === "streaming";

  // Derived usage states
  const isLocked =
    !usage.hasFullAccess && usage.used >= usage.limit && !usageLoading;
  const showNudge =
    !usage.hasFullAccess &&
    !nudgeDismissed &&
    !isLocked &&
    usage.used >= Math.floor(usage.limit * 0.5) &&
    !usageLoading;

  const dismissNudge = useCallback(() => {
    setNudgeDismissed(true);
  }, []);

  return {
    messages: chat.messages,
    input,
    setInput,
    handleSubmit,
    sendText,
    isLoading,
    error: chat.error,
    // Usage
    usage,
    usageLoading,
    isLocked,
    showNudge,
    dismissNudge,
  };
}
