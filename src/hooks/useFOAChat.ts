"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useCallback, useMemo, type FormEvent } from "react";

interface UseFOAChatOptions {
  userId: string;
  moduleSlug: string;
  lessonSlug: string;
}

export function useFOAChat({
  userId,
  moduleSlug,
  lessonSlug,
}: UseFOAChatOptions) {
  const [input, setInput] = useState("");

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
    },
    [input, chat]
  );

  const isLoading = chat.status === "submitted" || chat.status === "streaming";

  return {
    messages: chat.messages,
    input,
    setInput,
    handleSubmit,
    isLoading,
    error: chat.error,
  };
}
