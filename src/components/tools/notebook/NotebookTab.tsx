"use client";

import { useToolsPanel } from "@/contexts/ToolsPanelContext";
import { NotebookEditor } from "./NotebookEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PenLine } from "lucide-react";
import Link from "next/link";

interface NotebookTabProps {
  userId: string;
}

export function NotebookTab({ userId }: NotebookTabProps) {
  const { moduleSlug, lessonSlug } = useToolsPanel();

  if (!moduleSlug || !lessonSlug) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <PenLine className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">Your Notebook</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Navigate to a lesson to take notes, or view all your notes below.
          </p>
        </div>
        <Link
          href="/dashboard/notebook"
          className="mt-1 text-sm font-medium text-primary hover:underline"
        >
          View All Notes →
        </Link>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4">
        <NotebookEditor
          userId={userId}
          moduleSlug={moduleSlug}
          lessonSlug={lessonSlug}
        />
      </div>
    </ScrollArea>
  );
}
