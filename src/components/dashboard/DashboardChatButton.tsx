"use client";

import { useToolsPanel } from "@/contexts/ToolsPanelContext";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function DashboardChatButton() {
  const { toggle } = useToolsPanel();

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => toggle("chat")}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Open AI Chat
    </Button>
  );
}
