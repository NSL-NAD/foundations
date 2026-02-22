"use client";

import type { ReactNode } from "react";

interface CourseQuoteProps {
  children: ReactNode;
  attribution?: string;
}

/**
 * A standout quote component with brass accent lines and centered text.
 * Used for important quotes throughout the course content.
 */
export function CourseQuote({ children, attribution }: CourseQuoteProps) {
  return (
    <div className="my-12 flex flex-col items-center text-center">
      {/* Top brass accent line */}
      <div
        className="mb-6 h-[2px] w-16"
        style={{
          background:
            "linear-gradient(to right, transparent, hsl(var(--brass)), transparent)",
        }}
      />

      {/* Quote text */}
      <div className="max-w-xl px-4">
        <p className="font-heading text-lg italic leading-relaxed text-foreground/80 md:text-xl">
          {children}
        </p>
        {attribution && (
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            — {attribution}
          </p>
        )}
      </div>

      {/* Bottom brass accent line */}
      <div
        className="mt-6 h-[2px] w-16"
        style={{
          background:
            "linear-gradient(to right, transparent, hsl(var(--brass)), transparent)",
        }}
      />
    </div>
  );
}
