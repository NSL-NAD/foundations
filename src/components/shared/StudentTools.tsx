"use client";

import { ToolsFAB } from "@/components/tools/ToolsFAB";
import { ToolsPanel } from "@/components/tools/ToolsPanel";

interface StudentToolsProps {
  userId: string;
  email?: string;
}

export function StudentTools({ userId, email }: StudentToolsProps) {
  return (
    <>
      <ToolsFAB />
      <ToolsPanel userId={userId} email={email} />
    </>
  );
}
