"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, type FormEvent, type KeyboardEvent } from "react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  disabled,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSubmit(e as unknown as FormEvent);
      }
    }
  };

  // Auto-resize textarea
  const handleChange = (value: string) => {
    setInput(value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex items-end gap-2 border-t bg-card p-4"
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about architecture..."
        rows={1}
        disabled={isLoading || disabled}
        className="flex-1 resize-none rounded-lg border bg-background px-3 py-2.5 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
      />
      <Button
        type="submit"
        size="icon"
        disabled={!input.trim() || isLoading || disabled}
        className="h-10 w-10 shrink-0 rounded-lg"
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
