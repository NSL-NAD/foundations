"use client";

import { useState, useEffect, useCallback } from "react";

export interface StoredHighlight {
  id: string;
  highlighted_text: string;
  prefix_context: string;
  suffix_context: string;
}

interface UseHighlightsReturn {
  highlights: StoredHighlight[];
  isLoading: boolean;
  saveHighlight: (
    text: string,
    prefix: string,
    suffix: string
  ) => Promise<string | null>;
  removeHighlight: (id: string) => Promise<void>;
}

export function useHighlights(
  moduleSlug: string,
  lessonSlug: string
): UseHighlightsReturn {
  const [highlights, setHighlights] = useState<StoredHighlight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch highlights for this lesson on mount / slug change
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    async function fetchHighlights() {
      try {
        const res = await fetch(
          `/api/highlights?moduleSlug=${encodeURIComponent(moduleSlug)}&lessonSlug=${encodeURIComponent(lessonSlug)}`
        );
        if (!res.ok) {
          // User might not be logged in or other error — just return empty
          setHighlights([]);
          return;
        }
        const data = await res.json();
        if (!cancelled) {
          setHighlights(data.highlights || []);
        }
      } catch {
        if (!cancelled) {
          setHighlights([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchHighlights();
    return () => {
      cancelled = true;
    };
  }, [moduleSlug, lessonSlug]);

  const saveHighlight = useCallback(
    async (
      text: string,
      prefix: string,
      suffix: string
    ): Promise<string | null> => {
      try {
        const res = await fetch("/api/highlights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            moduleSlug,
            lessonSlug,
            highlightedText: text,
            prefixContext: prefix,
            suffixContext: suffix,
          }),
        });

        if (!res.ok) return null;

        const data = await res.json();
        const id = data.id as string;

        // Add to local state
        setHighlights((prev) => [
          ...prev,
          {
            id,
            highlighted_text: text,
            prefix_context: prefix,
            suffix_context: suffix,
          },
        ]);

        return id;
      } catch {
        return null;
      }
    },
    [moduleSlug, lessonSlug]
  );

  const removeHighlight = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/highlights?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setHighlights((prev) => prev.filter((h) => h.id !== id));
      }
    } catch {
      // Silently fail — highlight stays in UI
    }
  }, []);

  return { highlights, isLoading, saveHighlight, removeHighlight };
}
