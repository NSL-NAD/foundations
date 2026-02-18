"use client";

import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Children, isValidElement } from "react";
import type { ReactNode } from "react";
import { PlayCircle, Lightbulb } from "lucide-react";
import type { CurriculumLesson } from "@/lib/course";
import { DrawerPath, BriefPath } from "@/components/course/PathIndicator";
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

const mdxComponents = {
  DrawerPath,
  BriefPath,
  hr: () => <StraightedgeLine showTicks className="my-14" />,
  blockquote: InsightBlockquote,
  p: SmartParagraph,
};

interface LessonContentProps {
  mdxSource: MDXRemoteSerializeResult | null;
  lesson: CurriculumLesson;
  moduleSlug: string;
}

export function LessonContent({ mdxSource, lesson }: LessonContentProps) {
  return (
    <div>
      {/* Video placeholder for video lessons */}
      {lesson.type === "video" && (
        <div className="mb-8 flex aspect-video items-center justify-center rounded-card bg-[#171C24] ring-1 ring-brass/20">
          <div className="text-center">
            <PlayCircle className="mx-auto h-12 w-12 text-white/50" />
            <p className="mt-2 text-sm text-white/50">
              Video content coming soon
            </p>
          </div>
        </div>
      )}

      {/* MDX Content or placeholder */}
      {mdxSource ? (
        <div className="prose-lesson">
          <MDXRemote {...mdxSource} components={mdxComponents} />
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
