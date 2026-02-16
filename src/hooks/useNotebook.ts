"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseNotebookOptions {
  userId: string;
  moduleSlug: string;
  lessonSlug: string;
}

export function useNotebook({
  moduleSlug,
  lessonSlug,
}: UseNotebookOptions) {
  const [content, setContentState] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentKeyRef = useRef(`${moduleSlug}/${lessonSlug}`);

  // Fetch note when lesson changes
  useEffect(() => {
    const key = `${moduleSlug}/${lessonSlug}`;
    currentKeyRef.current = key;
    setIsLoading(true);
    setLastSaved(null);

    fetch(
      `/api/notebook?moduleSlug=${encodeURIComponent(moduleSlug)}&lessonSlug=${encodeURIComponent(lessonSlug)}`
    )
      .then((res) => res.json())
      .then((data) => {
        // Only update if we're still on the same lesson
        if (currentKeyRef.current === key) {
          setContentState(data.content || "");
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (currentKeyRef.current === key) {
          setContentState("");
          setIsLoading(false);
        }
      });

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [moduleSlug, lessonSlug]);

  // Debounced save
  const saveNote = useCallback(
    (newContent: string) => {
      setIsSaving(true);
      fetch("/api/notebook", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleSlug, lessonSlug, content: newContent }),
      })
        .then(() => {
          setIsSaving(false);
          setLastSaved(new Date());
        })
        .catch(() => {
          setIsSaving(false);
        });
    },
    [moduleSlug, lessonSlug]
  );

  const setContent = useCallback(
    (newContent: string) => {
      setContentState(newContent);
      setLastSaved(null);

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        saveNote(newContent);
      }, 800);
    },
    [saveNote]
  );

  return { content, setContent, isLoading, isSaving, lastSaved };
}
