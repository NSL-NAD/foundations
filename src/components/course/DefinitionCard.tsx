import type { ReactNode } from "react";

interface DefinitionCardProps {
  element: string;
  children: ReactNode;
}

export function DefinitionCard({ element, children }: DefinitionCardProps) {
  return (
    <div className="not-prose my-6 flex flex-col gap-3 md:flex-row md:items-stretch">
      {/* Left card — terracotta label */}
      <div
        className="flex flex-col justify-between rounded-card px-4 py-3 md:w-44 md:shrink-0 md:py-4"
        style={{ background: "hsl(var(--accent))" }}
      >
        <span className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
          Definition
        </span>
        <span className="mt-1 font-heading text-xl font-bold leading-tight text-white md:text-2xl">
          {element}
        </span>
      </div>

      {/* Right card — bordered definition */}
      <div className="flex-1 rounded-card border border-foreground p-4 md:p-5">
        <div className="text-[0.95rem] leading-relaxed text-foreground/90">
          {children}
        </div>
      </div>
    </div>
  );
}
