import type { ReactNode } from "react";

interface ToolCardProps {
  tool: string;
  image: string;
  alt: string;
  children: ReactNode;
}

export function ToolCard({ tool, image, alt, children }: ToolCardProps) {
  return (
    <div className="not-prose my-6 flex flex-col gap-3 md:flex-row md:items-stretch">
      {/* Left card — tool image with title overlay */}
      <div className="relative overflow-hidden rounded-card md:w-1/2 md:shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={alt}
          className="h-48 w-full object-cover md:h-full md:min-h-[180px]"
        />
        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-3 pt-10">
          <span className="font-heading text-lg font-bold leading-tight text-white drop-shadow-sm md:text-xl">
            {tool}
          </span>
        </div>
      </div>

      {/* Right card — description */}
      <div className="flex-1 rounded-card border border-foreground p-4 md:p-5">
        <div className="text-[0.95rem] leading-relaxed text-foreground/90 [&>p]:mb-0">
          {children}
        </div>
      </div>
    </div>
  );
}
