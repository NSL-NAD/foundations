"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Check, Circle, PlayCircle, FileText, PenTool, ListChecks, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import type { CurriculumModule } from "@/lib/course";

interface ModuleSidebarProps {
  modules: CurriculumModule[];
  currentModuleSlug: string;
  currentLessonSlug: string;
  completedLessons: string[];
  onNavigate?: () => void;
}

const typeIcons: Record<string, typeof FileText> = {
  video: PlayCircle,
  text: FileText,
  exercise: PenTool,
  checklist: ListChecks,
  download: Download,
};

export function ModuleSidebar({
  modules,
  currentModuleSlug,
  currentLessonSlug,
  completedLessons,
  onNavigate,
}: ModuleSidebarProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set([currentModuleSlug])
  );

  function toggleModule(slug: string) {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Course Content</h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {modules.map((mod) => {
          const isExpanded = expandedModules.has(mod.slug);
          const moduleCompleted = mod.lessons.filter((l) =>
            completedLessons.includes(`${mod.slug}/${l.slug}`)
          ).length;
          const modulePercent =
            mod.lessons.length > 0
              ? Math.round((moduleCompleted / mod.lessons.length) * 100)
              : 0;

          return (
            <div key={mod.slug} className="mb-1">
              <button
                onClick={() => toggleModule(mod.slug)}
                className={cn(
                  "flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-accent",
                  mod.slug === currentModuleSlug && "bg-accent/50"
                )}
              >
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    !isExpanded && "-rotate-90"
                  )}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{mod.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Progress value={modulePercent} className="h-1 flex-1" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {moduleCompleted}/{mod.lessons.length}
                    </span>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <ul className="pb-1">
                  {mod.lessons.map((lesson) => {
                    const isActive =
                      mod.slug === currentModuleSlug &&
                      lesson.slug === currentLessonSlug;
                    const isLessonCompleted = completedLessons.includes(
                      `${mod.slug}/${lesson.slug}`
                    );
                    const Icon = typeIcons[lesson.type] || FileText;

                    return (
                      <li key={lesson.slug}>
                        <Link
                          href={`/course/${mod.slug}/${lesson.slug}`}
                          onClick={onNavigate}
                          className={cn(
                            "flex items-center gap-2 py-2 pl-10 pr-4 text-sm transition-colors hover:bg-accent",
                            isActive &&
                              "bg-primary/10 font-medium text-primary border-l-2 border-primary",
                            !isActive && "text-muted-foreground"
                          )}
                        >
                          {isLessonCompleted ? (
                            <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                          ) : isActive ? (
                            <Circle className="h-3.5 w-3.5 shrink-0 fill-primary text-primary" />
                          ) : (
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
