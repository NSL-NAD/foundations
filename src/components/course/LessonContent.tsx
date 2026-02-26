"use client";

import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Children, isValidElement } from "react";
import type { ReactNode, ReactElement } from "react";
import { PlayCircle, Lightbulb, BookOpen } from "lucide-react";
import type { CurriculumLesson } from "@/lib/course";
import { DrawerPath, BriefPath } from "@/components/course/PathIndicator";
import { DownloadAllButton } from "@/components/course/DownloadAllButton";
import { CourseQuote } from "@/components/course/CourseQuote";
import { DefinitionCard } from "@/components/course/DefinitionCard";
import { ToolCard } from "@/components/course/ToolCard";
import { StarterKitButton } from "@/components/course/StarterKitButton";
import { GenerateDesignBriefButton } from "@/components/course/GenerateDesignBriefButton";
import { CourseStructure } from "@/components/course/CourseStructure";
import { StraightedgeLine } from "@/components/decorative/StraightedgeLine";

/* ── MDX component overrides ─────────────────────────────── */

function InsightBlockquote({ children }: { children?: ReactNode }) {
  return (
    <div className="my-10 rounded-lg border-l-4 p-5" style={{ borderLeftColor: "hsl(var(--brass))", background: "hsl(var(--brass) / 0.04)" }}>
      <div className="mb-2 flex items-center gap-2">
        <Lightbulb className="h-[18px] w-[18px]" style={{ color: "hsl(var(--brass))" }} />
        <span className="font-heading text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: "hsl(var(--brass))" }}>
          Key Insight
        </span>
      </div>
      <div className="prose-insight">
        {children}
      </div>
    </div>
  );
}

function SmartParagraph({ children }: { children?: ReactNode }) {
  // Detect **Label:** pattern → render as callout card
  try {
    const childArray = Children.toArray(children);
    const firstChild = childArray[0];

    if (
      isValidElement(firstChild) &&
      firstChild.type === "strong"
    ) {
      const strongContent = (firstChild.props as { children?: unknown }).children;
      if (typeof strongContent === "string" && strongContent.endsWith(":")) {
        const rest = childArray.slice(1);

        return (
          <div className="my-5 rounded-lg border border-foreground/[0.08] bg-card px-5 py-4">
            <span className="font-heading text-xs font-semibold uppercase tracking-[0.1em] text-primary">
              {strongContent}
            </span>
            <div className="prose-callout mt-1.5">
              <p>{rest}</p>
            </div>
          </div>
        );
      }
    }
  } catch {
    // Fall through to default rendering
  }

  // Default paragraph
  return <p>{children}</p>;
}

function ExternalLink(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { href, children, ...rest } = props;
  const isExternal = href && (href.startsWith("http://") || href.startsWith("https://"));
  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

const mdxComponents = {
  DrawerPath,
  BriefPath,
  DownloadAllButton,
  CourseQuote,
  CourseStructure,
  DefinitionCard,
  ToolCard,
  StarterKitButton,
  GenerateDesignBriefButton,
  hr: () => <StraightedgeLine showTicks className="my-14" />,
  blockquote: InsightBlockquote,
  p: SmartParagraph,
  a: ExternalLink,
};

/* ── Video thumbnail mapping ────────────────────────────── */

const videoThumbnails: Record<string, string> = {
  "welcome/course-overview": "/images/thumbnails/residential-home.jpg",
  "kickoff/workshop-intro": "/images/thumbnails/design-workspace.jpg",
  "module-1/what-is-architecture": "/images/thumbnails/building-facade.jpg",
  "module-2/elements-intro": "/images/thumbnails/architectural-detail.jpg",
  "module-3/drawing-tools": "/images/thumbnails/floor-plan.jpg",
  "module-4/materials-overview": "/images/thumbnails/material-textures.jpg",
  "module-5/environmental-intro": "/images/thumbnails/sustainable-home.jpg",
  "module-6/portfolio-overview": "/images/thumbnails/architectural-mockup.jpg",
  "resources/closing-remarks": "/images/thumbnails/inspiring-architecture.jpg",
};

interface LessonContentProps {
  mdxSource: MDXRemoteSerializeResult | null;
  lesson: CurriculumLesson;
  moduleSlug: string;
  lessonSlug: string;
}

/**
 * Wraps MDX children so that elements between the hidden h1 and the first h2
 * are rendered inside a two-card intro layout — all in React, no DOM mutation.
 */
function IntroWrapper({ children }: { children?: ReactNode }) {
  const childArray = Children.toArray(children);

  // Find the first h1 (sr-only via CSS) and first h2
  let h1Index = -1;
  let h2Index = -1;

  childArray.forEach((child, i) => {
    if (!isValidElement(child)) return;
    const el = child as ReactElement<{ className?: string }>;
    // MDXRemote renders headings as plain HTML elements
    if (el.type === "h1" && h1Index === -1) h1Index = i;
    if (el.type === "h2" && h2Index === -1) h2Index = i;
  });

  // No h1 or h1 is immediately followed by h2 (or nothing between) — render as-is
  if (h1Index === -1) return <>{children}</>;

  const introStart = h1Index + 1;
  const introEnd = h2Index === -1 ? childArray.length : h2Index;

  // No intro elements between h1 and first h2
  if (introStart >= introEnd) return <>{children}</>;

  const before = childArray.slice(0, introStart); // just the h1
  const introElements = childArray.slice(introStart, introEnd);
  const after = childArray.slice(introEnd);

  return (
    <>
      {before}
      <div className="not-prose mb-10 flex flex-col gap-4 md:flex-row md:items-stretch">
        {/* Left card — slate blue label */}
        <div className="flex items-center gap-2 rounded-card bg-primary px-5 py-4 text-white md:w-48 md:shrink-0 md:flex-col md:items-start md:justify-between md:py-5">
          <span className="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
            Section Description
          </span>
          <BookOpen className="hidden h-4 w-4 text-white/40 md:block" />
        </div>
        {/* Right card — bordered description */}
        <div className="prose-lesson flex-1 rounded-card border border-foreground p-5 md:p-6 [&>*:last-child]:!mb-0">
          {introElements}
        </div>
      </div>
      {after}
    </>
  );
}

export function LessonContent({ mdxSource, lesson, moduleSlug, lessonSlug }: LessonContentProps) {
  const thumbnailSrc = videoThumbnails[`${moduleSlug}/${lessonSlug}`];

  return (
    <div>
      {/* Video placeholder for video lessons */}
      {lesson.type === "video" && (
        <div className="relative mb-8 flex aspect-video items-center justify-center overflow-hidden rounded-card ring-1 ring-brass/20">
          {/* Background image or fallback */}
          {thumbnailSrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnailSrc}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[#171C24]/60" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[#171C24]" />
          )}
          <div className="relative text-center">
            <PlayCircle className="mx-auto h-12 w-12 text-white/70" />
            <p className="mt-2 text-sm text-white/70">
              Video content coming soon
            </p>
          </div>
        </div>
      )}

      {/* MDX Content or placeholder */}
      {mdxSource ? (
        <div className="prose-lesson">
          <IntroWrapper>
            <MDXRemote {...mdxSource} components={mdxComponents} />
          </IntroWrapper>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            Lesson content is being prepared. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
