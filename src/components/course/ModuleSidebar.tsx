"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronDown,
  Check,
  Circle,
  PlayCircle,
  FileText,
  PenTool,
  ListChecks,
  Download,
  Pin,
  PinOff,
  Lock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { isModuleAccessible, isLessonAccessible, moduleHasTrialLessons } from "@/lib/access";
import type { AccessTier } from "@/lib/access";
import type { CurriculumModule } from "@/lib/course";

interface ModuleSidebarProps {
  modules: CurriculumModule[];
  currentModuleSlug: string;
  currentLessonSlug: string;
  completedLessons: string[];
  onNavigate?: () => void;
  forceExpanded?: boolean;
  accessTier?: AccessTier;
  email?: string;
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
  forceExpanded = false,
  accessTier,
  email,
}: ModuleSidebarProps) {
  const isTrial = accessTier === "trial";
  const router = useRouter();
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set([currentModuleSlug])
  );
  const [pinned, setPinned] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("course-sidebar-pinned") === "true";
  });

  // Persist pin state to localStorage so it survives navigation
  useEffect(() => {
    localStorage.setItem("course-sidebar-pinned", String(pinned));
  }, [pinned]);

  // Persist sidebar scroll position across navigations
  const navRef = useRef<HTMLElement>(null);

  const handleLessonClick = useCallback(() => {
    if (navRef.current) {
      sessionStorage.setItem("sidebar-scroll", String(navRef.current.scrollTop));
    }
    onNavigate?.();
  }, [onNavigate]);

  useEffect(() => {
    const saved = sessionStorage.getItem("sidebar-scroll");
    if (saved && navRef.current) {
      navRef.current.scrollTop = parseInt(saved, 10);
    }
  }, [currentLessonSlug]);

  // When forceExpanded (mobile sheet), treat as always pinned/expanded
  const isExpanded = forceExpanded || pinned;

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
    <div
      className={cn(
        "group flex h-full flex-col bg-[#171C24] text-white transition-all duration-300 ease-in-out",
        isExpanded ? "w-80" : "w-16 hover:w-80"
      )}
    >
      {/* Header */}
      <div className="relative flex h-14 items-center border-b border-white/10 px-4">
        {/* Collapsed monogram */}
        <span
          className={cn(
            "font-heading text-lg font-bold tracking-wide text-brass transition-opacity duration-200",
            isExpanded
              ? "opacity-0 absolute"
              : "opacity-100 group-hover:opacity-0"
          )}
        >
          FA
        </span>
        {/* Expanded title */}
        <span
          className={cn(
            "font-heading whitespace-nowrap text-sm font-semibold uppercase tracking-[0.15em] transition-opacity duration-200",
            isExpanded
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100"
          )}
        >
          Course Content
        </span>
      </div>

      {/* Module list */}
      <nav ref={navRef} className="flex-1 overflow-y-auto py-2">
        {modules.map((mod, modIndex) => {
          const accessible = isModuleAccessible(mod.slug, accessTier ?? "full");
          const hasTrialLesson = !accessible && moduleHasTrialLessons(mod.slug);
          const isModuleOpen = expandedModules.has(mod.slug);
          const moduleCompleted = mod.lessons.filter((l) =>
            completedLessons.includes(`${mod.slug}/${l.slug}`)
          ).length;
          const modulePercent =
            mod.lessons.length > 0
              ? Math.round((moduleCompleted / mod.lessons.length) * 100)
              : 0;
          const moduleNumber = String(modIndex + 1).padStart(2, "0");

          return (
            <div key={mod.slug} className="mb-1">
              <button
                onClick={() => toggleModule(mod.slug)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5",
                  mod.slug === currentModuleSlug && "bg-white/10",
                  !accessible && !hasTrialLesson && "opacity-50"
                )}
              >
                {/* Collapsed sidebar: module number */}
                <span
                  className={cn(
                    "font-heading shrink-0 text-xs font-bold tracking-wider text-white/60 transition-opacity duration-200",
                    isExpanded
                      ? "hidden"
                      : "inline group-hover:hidden"
                  )}
                >
                  {moduleNumber}
                </span>

                {/* Expanded sidebar: chevron + full title */}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 text-white/40 transition-transform duration-200",
                    !isModuleOpen && "-rotate-90",
                    isExpanded
                      ? "inline-flex"
                      : "hidden group-hover:inline-flex"
                  )}
                />
                <div
                  className={cn(
                    "min-w-0 flex-1 transition-opacity duration-200",
                    isExpanded
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  )}
                >
                  <p className="truncate font-medium text-white/90">
                    {mod.title}
                  </p>
                  {accessible ? (
                    <div className="mt-1 flex items-center gap-2">
                      <Progress
                        value={modulePercent}
                        className="h-1 flex-1 bg-white/10 [&>div]:bg-brass"
                      />
                      <span className="whitespace-nowrap text-xs text-white/40">
                        {moduleCompleted}/{mod.lessons.length}
                      </span>
                    </div>
                  ) : hasTrialLesson ? (
                    <div className="mt-1 flex items-center gap-1.5">
                      <Lock className="h-3 w-3 text-white/30" />
                      <span className="text-xs text-white/30">Preview available</span>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center gap-1.5">
                      <Lock className="h-3 w-3 text-white/30" />
                      <span className="text-xs text-white/30">Locked</span>
                    </div>
                  )}
                </div>
              </button>

              {isModuleOpen && (
                <ul className="pb-1">
                  {mod.lessons.map((lesson) => {
                    const isActive =
                      mod.slug === currentModuleSlug &&
                      lesson.slug === currentLessonSlug;
                    const isLessonCompleted = completedLessons.includes(
                      `${mod.slug}/${lesson.slug}`
                    );
                    const Icon = typeIcons[lesson.type] || FileText;
                    const lessonAccessible = isLessonAccessible(
                      mod.slug,
                      accessTier ?? "full",
                      lesson.slug
                    );

                    // Locked lesson — visible but not clickable
                    if (!lessonAccessible) {
                      return (
                        <li key={lesson.slug}>
                          <div className="flex cursor-not-allowed items-center gap-2 py-2 pl-10 pr-4 text-sm text-white/25">
                            <Lock className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{lesson.title}</span>
                          </div>
                        </li>
                      );
                    }

                    return (
                      <li key={lesson.slug}>
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => {
                            handleLessonClick();
                            router.push(`/course/${mod.slug}/${lesson.slug}`);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              handleLessonClick();
                              router.push(`/course/${mod.slug}/${lesson.slug}`);
                            }
                          }}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 py-2 pl-10 pr-4 text-sm transition-colors hover:bg-white/5",
                            isActive && "bg-white/10 font-medium text-white",
                            !isActive && "text-white/50"
                          )}
                        >
                          {isLessonCompleted ? (
                            <Check className="h-3.5 w-3.5 shrink-0 text-brass" />
                          ) : isActive ? (
                            <Circle className="h-3.5 w-3.5 shrink-0 fill-brass text-brass" />
                          ) : (
                            <Icon className="h-3.5 w-3.5 shrink-0 text-white/30" />
                          )}
                          <span className="truncate">{lesson.title}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </nav>

      {/* Upgrade CTA for trial users */}
      {isTrial && (
        <div
          className={cn(
            "border-t border-white/10 p-3 transition-opacity duration-200",
            isExpanded ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )}
        >
          <div
            role="button"
            tabIndex={0}
            onClick={async () => {
              if (upgradeLoading) return;
              setUpgradeLoading(true);
              try {
                const res = await fetch("/api/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ productType: "course", email }),
                });
                const data = await res.json();
                if (data.checkoutUrl) {
                  window.location.href = data.checkoutUrl;
                } else {
                  setUpgradeLoading(false);
                }
              } catch {
                setUpgradeLoading(false);
              }
            }}
            onKeyDown={async (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                if (upgradeLoading) return;
                setUpgradeLoading(true);
                try {
                  const res = await fetch("/api/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productType: "course", email }),
                  });
                  const data = await res.json();
                  if (data.checkoutUrl) {
                    window.location.href = data.checkoutUrl;
                  } else {
                    setUpgradeLoading(false);
                  }
                } catch {
                  setUpgradeLoading(false);
                }
              }
            }}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-xs text-brass transition-colors hover:bg-white/5"
          >
            {upgradeLoading ? (
              <Loader2 className="h-3 w-3 shrink-0 animate-spin" />
            ) : (
              <Lock className="h-3 w-3 shrink-0" />
            )}
            <span className="whitespace-nowrap">
              {upgradeLoading ? "Redirecting..." : "Upgrade to Full Course"}
            </span>
          </div>
        </div>
      )}

      {/* Pin button — hidden on mobile (forceExpanded) */}
      {!forceExpanded && (
        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => setPinned(!pinned)}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white/80",
              pinned ? "justify-start" : "group-hover:justify-start"
            )}
            title={pinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            {pinned ? (
              <>
                <PinOff className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap text-xs">Unpin</span>
              </>
            ) : (
              <>
                <Pin className="h-4 w-4 shrink-0" />
                <span className="whitespace-nowrap text-xs opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Pin
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
