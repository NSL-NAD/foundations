"use client";

import { useToolsPanel } from "@/contexts/ToolsPanelContext";
import { ToolsTabBar } from "./ToolsTabBar";
import { NotebookTab } from "./notebook/NotebookTab";
import { ChatTab } from "./chat/ChatTab";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function ToolsPanel({
  userId,
  email,
}: {
  userId: string;
  email?: string;
}) {
  const { isOpen, activeTab, close } = useToolsPanel();

  // Track if we're on mobile (below lg breakpoint = 1024px)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  const panelContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between pr-2">
        <div className="flex-1">
          <ToolsTabBar />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0"
          onClick={close}
          aria-label="Close panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        {activeTab === "notebook" ? (
          <NotebookTab userId={userId} />
        ) : (
          <ChatTab userId={userId} email={email} />
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: fixed right panel */}
      <aside
        className={cn(
          "fixed right-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-96 border-l bg-card transition-transform duration-300 lg:block",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {panelContent}
      </aside>

      {/* Mobile: bottom sheet (only open on mobile to avoid overlay on desktop) */}
      <Sheet open={isOpen && isMobile} onOpenChange={(open) => !open && close()}>
        <SheetContent
          side="bottom"
          className="h-[85vh] rounded-t-xl p-0 pb-[env(safe-area-inset-bottom)] [&>button:first-child]:hidden"
        >
          <div className="mx-auto mb-2 mt-2 h-1 w-12 rounded-full bg-muted-foreground/30" />
          {panelContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
