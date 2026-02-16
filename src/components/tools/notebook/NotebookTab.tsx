"use client";

import { useToolsPanel } from "@/contexts/ToolsPanelContext";
import { NotebookEditor } from "./NotebookEditor";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotebookTabProps {
  userId: string;
}

export function NotebookTab({ userId }: NotebookTabProps) {
  const { moduleSlug, lessonSlug } = useToolsPanel();

  if (!moduleSlug || !lessonSlug) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
        <p>Navigate to a lesson to start taking notes.</p>
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
