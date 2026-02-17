"use client";

import { useToolsPanel } from "@/contexts/ToolsPanelContext";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function DashboardChatButton() {
  const { toggle } = useToolsPanel();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto w-auto justify-start p-0 text-xs text-muted-foreground hover:text-foreground"
      onClick={() => toggle("chat")}
    >
      Open AI Chat
      <MessageCircle className="ml-1.5 h-3 w-3" />
    </Button>
  );
}
