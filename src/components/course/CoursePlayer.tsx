"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ModuleSidebar } from "./ModuleSidebar";
import { LessonContent } from "./LessonContent";
import { LessonNavigation } from "./LessonNavigation";
import { LessonDownloads } from "./LessonDownloads";
import { SelectionBubble } from "./SelectionBubble";
import { Button } from "@/components/ui/button";
import { Menu, Check, Circle, ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToolsPanel } from "@/contexts/ToolsPanelContext";
import { useHighlights } from "@/hooks/useHighlights";
import { restoreHighlights, clearHighlights } from "@/lib/highlight-restore";
import { cn } from "@/lib/utils";
import type { CurriculumModule, CurriculumLesson } from "@/lib/course";
import { getTotalLessons } from "@/lib/course";
import type { LessonNavigation as LessonNav } from "@/types/course";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import type { AccessTier } from "@/lib/access";

interface CoursePlayerProps {
  moduleSlug: string;
  lessonSlug: string;
  lesson: CurriculumLesson;
  module: CurriculumModule;
  modules: CurriculumModule[];
  navigation: LessonNav;
  completedLessons: string[];
  mdxSource: MDXRemoteSerializeResult | null;
  accessTier?: AccessTier;
}

export function CoursePlayer({
  moduleSlug,
  lessonSlug,
  lesson,
  module: currentModule,
  modules,
  navigation,
  completedLessons,
  mdxSource,
  accessTier,
}: CoursePlayerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isOpen: toolsPanelOpen, setLessonContext } = useToolsPanel();

  // Client-side optimistic state for completed lessons
  const [localCompleted, setLocalCompleted] = useState<string[]>(completedLessons);

  // Merge server data with local state — never drop optimistic completions
  useEffect(() => {
    setLocalCompleted(prev => {
      const merged = new Set([...prev, ...completedLessons]);
      return Array.from(merged);
    });
  }, [completedLessons]);

  const isCompleted = localCompleted.includes(`${moduleSlug}/${lessonSlug}`);
  const totalLessons = getTotalLessons();

  const handleToggleComplete = useCallback((lessonKey: string, completed: boolean) => {
    setLocalCompleted(prev => {
      if (completed) {
        return prev.includes(lessonKey) ? prev : [...prev, lessonKey];
      }
      return prev.filter(k => k !== lessonKey);
    });
  }, []);

  // Persistent highlights — fetch from DB and restore on content render
  const {
    highlights,
    isLoading: highlightsLoading,
    saveHighlight,
  } = useHighlights(moduleSlug, lessonSlug);

  // Stable callback for SelectionBubble — fire-and-forget save
  const handleSaveHighlight = useCallback(
    (text: string, prefix: string, suffix: string) => {
      saveHighlight(text, prefix, suffix);
    },
    [saveHighlight]
  );

  // Restore highlights once content is rendered and highlights are loaded
  useEffect(() => {
    if (highlightsLoading || !highlights.length) return;
    const container = contentRef.current;
    if (!container) return;

    // Small delay to ensure MDX content has hydrated
    const timer = setTimeout(() => {
      restoreHighlights(container, highlights);
    }, 100);

    return () => clearTimeout(timer);
  }, [highlights, highlightsLoading, mdxSource]);

  // Clear highlights when navigating away from a lesson
  useEffect(() => {
    return () => {
      clearHighlights();
    };
  }, [moduleSlug, lessonSlug]);

  // Extract downloads from lesson metadata
  const downloads =
    "downloads" in lesson && Array.isArray(lesson.downloads)
      ? (lesson.downloads as string[])
      : [];
  const hasDownloads = downloads.length > 0;

  // Update lesson context when navigating
  useEffect(() => {
    setLessonContext(moduleSlug, lessonSlug);
  }, [moduleSlug, lessonSlug, setLessonContext]);

  return (
    <div className="flex h-[calc(100dvh-4rem)] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden flex-shrink-0 overflow-y-auto lg:block">
        <ModuleSidebar
          modules={modules}
          currentModuleSlug={moduleSlug}
          currentLessonSlug={lessonSlug}
          completedLessons={localCompleted}
          accessTier={accessTier}
        />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 left-4 z-40 h-12 w-12 rounded-full border bg-card/90 backdrop-blur shadow-md lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 border-r-0 bg-[#171C24] p-0 [&>button:first-child]:z-50 [&>button:first-child]:right-3 [&>button:first-child]:top-3 [&>button:first-child]:pointer-events-auto [&>button:first-child]:h-8 [&>button:first-child]:w-8 [&>button:first-child]:bg-transparent [&>button:first-child]:text-white/60 [&>button:first-child]:hover:text-white [&>button:first-child]:hover:bg-white/10 [&>button:first-child]:rounded-md [&>button:first-child]:border-0 [&>button:first-child]:ring-0 [&>button:first-child]:ring-offset-0 [&>button:first-child]:focus:ring-0 [&>button:first-child]:focus:ring-offset-0 [&>button:first-child]:focus:outline-none [&>button:first-child]:data-[state=open]:bg-transparent">
          <ModuleSidebar
            modules={modules}
            currentModuleSlug={moduleSlug}
            currentLessonSlug={lessonSlug}
            completedLessons={localCompleted}
            onNavigate={() => setSidebarOpen(false)}
            forceExpanded
            accessTier={accessTier}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 overflow-y-auto bg-background transition-[padding] duration-300",
          toolsPanelOpen && "lg:pr-96"
        )}
      >
        {/* Selection-to-Notebook bubble (position: fixed, renders above selection) */}
        <SelectionBubble containerRef={contentRef} onSaveHighlight={handleSaveHighlight} />
        <div className="mx-auto max-w-3xl px-6 py-8 pb-24 md:px-8 lg:pb-8">
          {/* Section header card */}
          <div className="rounded-card bg-card p-5 md:p-6">
            <div
              className={
                hasDownloads
                  ? "flex flex-col gap-5 md:flex-row md:items-stretch md:justify-between"
                  : ""
              }
            >
              <div className={cn("flex flex-col", hasDownloads && "min-w-0 flex-1")}>
                {/* Module breadcrumb */}
                <p className="mb-1 font-heading text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  {currentModule.title}
                </p>
                <h1 className="font-heading text-3xl font-bold uppercase tracking-tight md:text-4xl">
                  {("shortTitle" in lesson && lesson.shortTitle) || lesson.title}
                </h1>

                {/* Tags + completed indicator — single row */}
                <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                  {lesson.duration && (
                    <span className="rounded-full border border-foreground/20 px-2.5 py-0.5 text-xs text-muted-foreground">
                      {lesson.duration}
                    </span>
                  )}
                  <span className="rounded-full border border-foreground/20 px-2.5 py-0.5 text-xs capitalize text-muted-foreground">
                    {lesson.type}
                  </span>
                  {lesson.path !== "both" && (
                    <span className="rounded-full border border-foreground/20 px-2.5 py-0.5 text-xs text-muted-foreground">
                      {lesson.path === "drawer"
                        ? "Drawer Path"
                        : "Brief Builder Path"}
                    </span>
                  )}

                  {/* External links (tool websites, YouTube channels) */}
                  {"links" in lesson &&
                    Array.isArray(lesson.links) &&
                    (lesson.links as { label: string; url: string }[]).map(
                      (link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full border border-foreground/20 px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-brass hover:text-brass"
                        >
                          {link.label}
                          <ExternalLink className="h-2.5 w-2.5" />
                        </a>
                      )
                    )}

                  {/* Completed indicator */}
                  <span className="flex items-center gap-1.5 text-xs">
                    {isCompleted ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-brass" />
                        <span className="font-medium text-brass">Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-3.5 w-3.5 text-muted-foreground/50" />
                        <span className="text-muted-foreground/50">Not completed</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Downloads card — top right inside header card, stretches to fill height */}
              {hasDownloads && (
                <div className="flex w-full shrink-0 md:w-56">
                  <LessonDownloads
                    downloads={downloads}
                    moduleSlug={moduleSlug}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Nav arrows — below the card */}
          <div className="mt-4 mb-8 flex items-center gap-4">
            {navigation.previous ? (
              <Link
                href={`/course/${navigation.previous.moduleSlug}/${navigation.previous.lessonSlug}`}
                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3 w-3" />
                <span className="hidden sm:inline max-w-[150px] truncate">
                  {navigation.previous.title}
                </span>
                <span className="sm:hidden">Previous</span>
              </Link>
            ) : (
              <div />
            )}

            <div className="flex-1" />

            {navigation.next ? (
              <Link
                href={`/course/${navigation.next.moduleSlug}/${navigation.next.lessonSlug}`}
                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="hidden sm:inline max-w-[150px] truncate">
                  {navigation.next.title}
                </span>
                <span className="sm:hidden">Next</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* Lesson Content */}
          <div ref={contentRef}>
            <LessonContent
              mdxSource={mdxSource}
              lesson={lesson}
              moduleSlug={moduleSlug}
              lessonSlug={lessonSlug}
            />
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8">
            <LessonNavigation
              navigation={navigation}
              moduleSlug={moduleSlug}
              lessonSlug={lessonSlug}
              isCompleted={isCompleted}
              onToggleComplete={handleToggleComplete}
              completedLessons={localCompleted}
              totalLessons={totalLessons}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
