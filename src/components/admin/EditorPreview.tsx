"use client";

import { useState, useEffect, useRef } from "react";
import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Loader2 } from "lucide-react";

// Import the same components used in LessonContent
import { DrawerPath, BriefPath } from "@/components/course/PathIndicator";
import { DownloadAllButton } from "@/components/course/DownloadAllButton";
import { CourseQuote } from "@/components/course/CourseQuote";
import { DefinitionCard } from "@/components/course/DefinitionCard";
import { ToolCard } from "@/components/course/ToolCard";
import { StarterKitButton } from "@/components/course/StarterKitButton";
import { GenerateDesignBriefButton } from "@/components/course/GenerateDesignBriefButton";
import { CourseStructure } from "@/components/course/CourseStructure";
import { VideoBlock } from "@/components/course/VideoBlock";
import { ImageCarousel } from "@/components/course/ImageCarousel";
import { StraightedgeLine } from "@/components/decorative/StraightedgeLine";

const previewComponents = {
  DrawerPath,
  BriefPath,
  DownloadAllButton,
  CourseQuote,
  CourseStructure,
  DefinitionCard,
  ToolCard,
  StarterKitButton,
  GenerateDesignBriefButton,
  VideoBlock,
  ImageCarousel,
  hr: () => <StraightedgeLine showTicks className="my-14" />,
};

interface EditorPreviewProps {
  content: string;
}

export function EditorPreview({ content }: EditorPreviewProps) {
  const [serialized, setSerialized] =
    useState<MDXRemoteSerializeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!content.trim()) {
      setSerialized(null);
      setError("");
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/admin/editor/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        if (res.ok) {
          const data = await res.json();
          setSerialized(data.serialized);
        } else {
          const data = await res.json();
          setError(data.error || "Preview failed");
        }
      } catch {
        setError("Failed to load preview");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [content]);

  return (
    <div className="px-6 py-8">
      <div className="mb-4 flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Preview
        </span>
        {loading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
      </div>

      {error ? (
        <div className="rounded-md border border-red-500/20 bg-red-500/5 p-4">
          <p className="text-sm text-red-500">{error}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Check your MDX syntax for errors.
          </p>
        </div>
      ) : serialized ? (
        <div className="prose-lesson">
          <MDXRemote {...serialized} components={previewComponents} />
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Start typing to see a preview...
        </p>
      )}
    </div>
  );
}
