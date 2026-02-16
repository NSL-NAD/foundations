"use client";

import { useNotebook } from "@/hooks/useNotebook";
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
              <Check className="h-3 w-3 text-green-600" />
              <span>Saved</span>
            </>
          ) : null}
        </div>
      </div>
      <textarea
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
