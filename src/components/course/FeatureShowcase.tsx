"use client";

import type { ReactNode } from "react";
import { Bot, BookOpen, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  bot: Bot,
  "book-open": BookOpen,
};

interface FeatureShowcaseProps {
  icon?: string;
  title: string;
  tagline?: string;
  children: ReactNode;
}

export function FeatureShowcase({
  icon = "bot",
  title,
  tagline,
  children,
}: FeatureShowcaseProps) {
  const Icon = iconMap[icon] || Bot;

  return (
    <div className="not-prose relative my-10 overflow-hidden rounded-card bg-primary p-6 text-primary-foreground md:p-8">
      {/* Gradient orbs — AI-forward palette */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#5F7F96]/35 blur-[60px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#B8593B]/30 blur-[55px]" />
      <div className="pointer-events-none absolute -top-8 right-8 h-48 w-48 rounded-full bg-[#C4A44E]/25 blur-[50px]" />
      <div className="pointer-events-none absolute bottom-4 left-1/3 h-56 w-56 rounded-full bg-[#6B3FA0]/15 blur-[55px]" />

      {/* Content */}
      <div className="relative">
        {/* Icon + label */}
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/15">
            <Icon className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-bold uppercase tracking-tight text-primary-foreground md:text-xl">
              {title}
            </h3>
            {tagline && (
              <p className="text-sm text-primary-foreground/70">{tagline}</p>
            )}
          </div>
        </div>

        {/* Children rendered as feature content */}
        <div className="space-y-3 text-sm leading-relaxed text-primary-foreground/90 [&_strong]:text-primary-foreground [&_ul]:space-y-2 [&_li]:flex [&_li]:gap-2.5 [&_li]:items-start">
          {children}
        </div>
      </div>
    </div>
  );
}
