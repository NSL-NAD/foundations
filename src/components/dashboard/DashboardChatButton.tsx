"use client";

import { useToolsPanel } from "@/contexts/ToolsPanelContext";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function DashboardChatButton() {
  const { toggle } = useToolsPanel();

  return (
    <Button
      size="sm"
      className="bg-foreground text-background hover:bg-foreground/90"
      onClick={() => toggle("chat")}
    >
      Open AI Chat
      <MessageCircle className="ml-1.5 h-3 w-3" />
    </Button>
  );
}
