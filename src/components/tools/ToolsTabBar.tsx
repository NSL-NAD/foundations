"use client";

import { useToolsPanel, type ToolsTab } from "@/contexts/ToolsPanelContext";
import { PenLine, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const allTabs: { id: ToolsTab; label: string; icon: typeof PenLine }[] = [
  { id: "notebook", label: "Notebook", icon: PenLine },
  { id: "chat", label: "AI Chat", icon: MessageCircle },
];

export function ToolsTabBar() {
  const { activeTab, setActiveTab, moduleSlug, lessonSlug } = useToolsPanel();
  const isInLesson = !!moduleSlug && !!lessonSlug;

  // Only show the notebook tab when inside a lesson
  const tabs = isInLesson ? allTabs : allTabs.filter((t) => t.id !== "notebook");

  return (
    <div className="flex border-b bg-card">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors",
              isActive
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
