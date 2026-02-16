interface GridPaperProps {
  opacity?: number;
  className?: string;
  size?: number;
}

export function GridPaper({
  opacity = 0.02,
  className = "",
  size = 20,
}: GridPaperProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ opacity }}
    >
      <svg
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={`grid-${size}`}
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${size} 0 L 0 0 0 ${size}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#grid-${size})`} />
      </svg>
    </div>
  );
}
