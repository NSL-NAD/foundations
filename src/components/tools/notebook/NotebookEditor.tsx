"use client";

import { useEffect, useRef } from "react";
import { useNotebook } from "@/hooks/useNotebook";
import { useToolsPanel } from "@/contexts/ToolsPanelContext";
import { Loader2, Check } from "lucide-react";

interface NotebookEditorProps {
  userId: string;
  moduleSlug: string;
  lessonSlug: string;
}

export function NotebookEditor({
  userId,
  moduleSlug,
  lessonSlug,
}: NotebookEditorProps) {
  const { content, setContent, isLoading, isSaving, lastSaved } = useNotebook({
    userId,
    moduleSlug,
    lessonSlug,
  });
  const { pendingClip, clearPendingClip } = useToolsPanel();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Consume pending clip from highlight-to-notebook feature
  useEffect(() => {
    if (!pendingClip || isLoading) return;

    const currentContent = textareaRef.current?.value ?? content;
    const separator = currentContent.trim() ? "\n\n---\n\n" : "";
    const quotedClip = `> ${pendingClip.replace(/\n/g, "\n> ")}`;
    const newContent = currentContent + separator + quotedClip + "\n\n";
    setContent(newContent);
    clearPendingClip();

    // Scroll textarea to bottom and place cursor at end
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        textareaRef.current.focus();
        textareaRef.current.selectionStart = newContent.length;
        textareaRef.current.selectionEnd = newContent.length;
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingClip, isLoading]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Notes for this lesson
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {isSaving ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </>
          ) : lastSaved ? (
            <>
              <Check className="h-3 w-3 text-primary" />
              <span>Saved</span>
            </>
          ) : null}
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Take notes on this lesson..."
        disabled={isLoading}
        className="min-h-[300px] w-full resize-y rounded-md border bg-background p-3 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
      />
      {content.length > 0 && (
        <p className="text-right text-xs text-muted-foreground">
          {content.split(/\s+/).filter(Boolean).length} words
        </p>
      )}
    </div>
  );
}
