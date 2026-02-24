"use client";

import { useToolsPanel } from "@/contexts/ToolsPanelContext";
import { PenLine, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ToolsFAB() {
  const { isOpen, toggle, moduleSlug, lessonSlug } = useToolsPanel();
  const isInLesson = !!moduleSlug && !!lessonSlug;

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-40 flex flex-col gap-2",
        isOpen && "lg:hidden"
      )}
    >
      <Button
        variant="default"
        size="icon"
        className="h-12 w-12 rounded-full"
        onClick={() => toggle("chat")}
        aria-label="Toggle AI Chat"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
      {isInLesson && (
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 rounded-full bg-card border"
          onClick={() => toggle("notebook")}
          aria-label="Toggle Notebook"
        >
          <PenLine className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
