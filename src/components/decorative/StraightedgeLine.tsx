import { cn } from "@/lib/utils";

interface StraightedgeLineProps {
  className?: string;
  showTicks?: boolean;
}

export function StraightedgeLine({
  className,
  showTicks = false,
}: StraightedgeLineProps) {
  if (!showTicks) {
    return (
      <hr
        className={cn("border-t border-border", className)}
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className={cn("flex items-center gap-0", className)}
      aria-hidden="true"
    >
      {/* Left tick */}
      <div className="h-2 w-px bg-border" />
      {/* Line */}
      <div className="flex-1 border-t border-border" />
      {/* Right tick */}
      <div className="h-2 w-px bg-border" />
    </div>
  );
}
