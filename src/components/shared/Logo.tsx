import Link from "next/link";

interface LogoProps {
  className?: string;
  linkTo?: string;
  inverted?: boolean;
}

export function Logo({ className = "", linkTo = "/", inverted = false }: LogoProps) {
  const textColor = inverted ? "text-white" : "text-foreground";

  const logo = (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Geometric FA monogram */}
      <div className={`flex h-9 w-9 items-center justify-center rounded border-2 ${inverted ? "border-white" : "border-foreground"}`}>
        <span className={`font-heading text-sm font-semibold tracking-widest ${textColor}`}>
          FA
        </span>
      </div>
      <div className={`hidden sm:block ${textColor}`}>
        <p className="font-heading text-[11px] font-medium uppercase tracking-[0.2em] leading-tight">
          Foundations of
        </p>
        <p className="font-heading text-[11px] font-medium uppercase tracking-[0.2em] leading-tight">
          Architecture
        </p>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link href={linkTo} aria-label="Foundations of Architecture - Home">
        {logo}
      </Link>
    );
  }

  return logo;
}
