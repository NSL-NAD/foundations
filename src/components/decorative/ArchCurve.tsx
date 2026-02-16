import { cn } from "@/lib/utils";

interface ArchCurveProps {
  className?: string;
  /** Which corner the arc originates from */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Size of the arc in pixels */
  size?: number;
}

export function ArchCurve({
  className,
  position = "bottom-right",
  size = 300,
}: ArchCurveProps) {
  const paths: Record<string, string> = {
    "top-left": `M 0 ${size} Q 0 0 ${size} 0`,
    "top-right": `M 0 0 Q ${size} 0 ${size} ${size}`,
    "bottom-left": `M ${size} ${size} Q 0 ${size} 0 0`,
    "bottom-right": `M 0 ${size} Q ${size} ${size} ${size} 0`,
  };

  const positionClasses: Record<string, string> = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
  };

  return (
    <div
      className={cn(
        "pointer-events-none absolute",
        positionClasses[position],
        className
      )}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={paths[position]}
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.08"
        />
      </svg>
    </div>
  );
}
