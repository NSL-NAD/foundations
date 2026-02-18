"use client";

import { useState, useEffect } from "react";
import { ModuleSidebar } from "./ModuleSidebar";
import { LessonContent } from "./LessonContent";
import { LessonNavigation } from "./LessonNavigation";
import { LessonDownloads } from "./LessonDownloads";
import { StraightedgeLine } from "@/components/decorative/StraightedgeLine";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToolsPanel } from "@/contexts/ToolsPanelContext";
import { cn } from "@/lib/utils";
import type { CurriculumModule, CurriculumLesson } from "@/lib/course";
import type { LessonNavigation as LessonNav } from "@/types/course";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";

interface CoursePlayerProps {
  moduleSlug: string;
  lessonSlug: string;
  lesson: CurriculumLesson;
  module: CurriculumModule;
  modules: CurriculumModule[];
  navigation: LessonNav;
  completedLessons: string[];
  mdxSource: MDXRemoteSerializeResult | null;
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
}: CoursePlayerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isCompleted = completedLessons.includes(`${moduleSlug}/${lessonSlug}`);
  const { isOpen: toolsPanelOpen, setLessonContext } = useToolsPanel();

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
          completedLessons={completedLessons}
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
            completedLessons={completedLessons}
            onNavigate={() => setSidebarOpen(false)}
            forceExpanded
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
        <div className="mx-auto max-w-3xl px-6 py-8 pb-24 md:px-8 lg:pb-8">
          {/* Lesson header with optional downloads */}
          <div
            className={
              hasDownloads
                ? "flex flex-col gap-6 md:flex-row md:items-start md:justify-between"
                : ""
            }
          >
            <div className={hasDownloads ? "min-w-0 flex-1" : ""}>
              {/* Module breadcrumb */}
              <p className="mb-1 font-heading text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {currentModule.title}
              </p>
              <h1 className="font-heading text-3xl font-bold uppercase tracking-tight md:text-4xl">
                {lesson.title}
              </h1>
              <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
                {lesson.duration && <span>{lesson.duration}</span>}
                <span className="capitalize">{lesson.type}</span>
                {lesson.path !== "both" && (
                  <span className="rounded bg-secondary px-2 py-0.5 text-xs">
                    {lesson.path === "drawer"
                      ? "Drawer Path"
                      : "Brief Builder Path"}
                  </span>
                )}
              </div>
            </div>

            {/* Downloads card — top right */}
            {hasDownloads && (
              <div className="w-full shrink-0 md:w-56">
                <LessonDownloads
                  downloads={downloads}
                  moduleSlug={moduleSlug}
                />
              </div>
            )}
          </div>

          <StraightedgeLine showTicks className="mt-6 mb-8" />

          {/* Lesson Content */}
          <div>
            <LessonContent
              mdxSource={mdxSource}
              lesson={lesson}
              moduleSlug={moduleSlug}
            />
          </div>

          {/* Navigation */}
          <div className="mt-12 border-t pt-8">
            <LessonNavigation
              navigation={navigation}
              moduleSlug={moduleSlug}
              lessonSlug={lessonSlug}
              isCompleted={isCompleted}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
