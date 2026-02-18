"use client";

import { PenTool, FileText } from "lucide-react";
import type { ReactNode } from "react";

interface PathCardProps {
  children: ReactNode;
}

export function DrawerPath({ children }: PathCardProps) {
  return (
    <div className="my-8 rounded-lg border-l-4 border-l-primary bg-primary/[0.04] p-5 dark:bg-primary/[0.08]">
      <div className="mb-3 flex items-center gap-2">
        <PenTool className="h-[18px] w-[18px] text-primary" />
        <span className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          Drawer Path
        </span>
      </div>
      <div className="prose-path">{children}</div>
    </div>
  );
}

export function BriefPath({ children }: PathCardProps) {
  return (
    <div className="my-8 rounded-lg border-l-4 border-l-accent bg-accent/[0.04] p-5 dark:bg-accent/[0.08]">
      <div className="mb-3 flex items-center gap-2">
        <FileText className="h-[18px] w-[18px] text-accent" />
        <span className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-accent">
          Brief Builder Path
        </span>
      </div>
      <div className="prose-path">{children}</div>
    </div>
  );
}
