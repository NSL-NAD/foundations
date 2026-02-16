"use client";

import { useState, useEffect } from "react";
import { ModuleSidebar } from "./ModuleSidebar";
import { LessonContent } from "./LessonContent";
import { LessonNavigation } from "./LessonNavigation";
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

  // Update lesson context when navigating
  useEffect(() => {
    setLessonContext(moduleSlug, lessonSlug);
  }, [moduleSlug, lessonSlug, setLessonContext]);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
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
            variant="ghost"
            size="icon"
            className="fixed bottom-4 left-4 z-40 rounded-full border lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <ModuleSidebar
            modules={modules}
            currentModuleSlug={moduleSlug}
            currentLessonSlug={lessonSlug}
            completedLessons={completedLessons}
            onNavigate={() => setSidebarOpen(false)}
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
        <div className="mx-auto max-w-3xl px-6 py-8 md:px-8">
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
