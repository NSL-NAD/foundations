"use client";

import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Children, isValidElement, useRef, useEffect, useState } from "react";
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
  const proseRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // Wrap intro paragraphs (between h1 and first h2) in a two-card layout
  useEffect(() => {
    const container = proseRef.current;
    if (!container) {
      setReady(true);
      return;
    }

    const h1 = container.querySelector(":scope > h1:first-child");
    if (!h1) {
      setReady(true);
      return;
    }

    // Collect elements between h1 and first h2
    const introElements: Element[] = [];
    let sibling = h1.nextElementSibling;
    while (sibling && sibling.tagName !== "H2") {
      introElements.push(sibling);
      sibling = sibling.nextElementSibling;
    }

    if (introElements.length === 0) {
      setReady(true);
      return;
    }

    // Build the two-card wrapper
    const wrapper = document.createElement("div");
    wrapper.className =
      "not-prose mb-10 flex flex-col gap-4 md:flex-row md:items-stretch";

    // Left card — slate blue label
    const leftCard = document.createElement("div");
    leftCard.className =
      "flex items-center gap-2 rounded-card bg-primary px-5 py-4 text-white md:w-48 md:shrink-0 md:flex-col md:items-start md:justify-between md:py-5";
    leftCard.innerHTML = `
      <span class="font-heading text-xs font-semibold uppercase tracking-[0.15em] text-white/80">Section Description</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="hidden h-4 w-4 text-white/40 md:block"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
    `;

    // Right card — bordered description
    const rightCard = document.createElement("div");
    rightCard.className =
      "flex-1 rounded-card border-2 border-foreground/15 p-5 md:p-6";

    // Move intro paragraphs into the right card
    introElements.forEach((el) => rightCard.appendChild(el));

    // Remove bottom margin from last element inside card
    const lastChild = rightCard.lastElementChild;
    if (lastChild) {
      lastChild.classList.add("!mb-0");
    }

    wrapper.appendChild(leftCard);
    wrapper.appendChild(rightCard);

    // Insert wrapper after h1
    h1.after(wrapper);

    setReady(true);
  }, [mdxSource]);

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
        <div
          ref={proseRef}
          className={`prose-lesson transition-opacity duration-200 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
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
