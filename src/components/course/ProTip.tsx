import type { ReactNode } from "react";
import { Compass } from "lucide-react";

interface ProTipProps {
  title?: string;
  children: ReactNode;
}

export function ProTip({ title = "Recommendation", children }: ProTipProps) {
  return (
    <div className="not-prose my-8 rounded-card border border-primary/20 bg-primary/[0.03] p-5 md:p-6">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
          <Compass className="h-3.5 w-3.5 text-primary" />
        </div>
        <span className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-primary">
          {title}
        </span>
      </div>
      <div className="text-sm leading-relaxed text-foreground/80 [&_strong]:text-foreground [&_ul]:mt-2 [&_ul]:space-y-1.5 [&_li]:text-foreground/80 [&_p]:mb-2 [&_p:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}
