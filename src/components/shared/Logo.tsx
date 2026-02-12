import Link from "next/link";

interface LogoProps {
  className?: string;
  linkTo?: string;
}

export function Logo({ className = "", linkTo = "/" }: LogoProps) {
  const logo = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-sm border-2 border-foreground">
        <span className="font-heading text-lg font-bold leading-none">
          FA
        </span>
      </div>
      <div className="hidden sm:block">
        <p className="font-heading text-sm font-semibold leading-tight">
          Foundations of
        </p>
        <p className="font-heading text-sm font-semibold leading-tight">
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
