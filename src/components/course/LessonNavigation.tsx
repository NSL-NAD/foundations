"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { CelebrationModal } from "@/components/course/CelebrationModal";
import type { LessonNavigation as LessonNav } from "@/types/course";

interface LessonNavigationProps {
  navigation: LessonNav;
  moduleSlug: string;
  lessonSlug: string;
  isCompleted: boolean;
  onToggleComplete: (lessonKey: string, completed: boolean) => void;
  completedLessons: string[];
  totalLessons: number;
}

export function LessonNavigation({
  navigation,
  moduleSlug,
  lessonSlug,
  isCompleted,
  onToggleComplete,
  completedLessons,
  totalLessons,
}: LessonNavigationProps) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);
  const [showCelebration, setShowCelebration] = useState(false);
  const router = useRouter();

  // Keep local state in sync with server prop when it changes
  useEffect(() => {
    setCompleted(isCompleted);
  }, [isCompleted]);

  async function handleMarkComplete() {
    setLoading(true);
    const newCompleted = !completed;
    const lessonKey = `${moduleSlug}/${lessonSlug}`;

    // Optimistic update — sidebar + header update immediately
    setCompleted(newCompleted);
    onToggleComplete(lessonKey, newCompleted);

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonSlug,
          moduleSlug,
          completed: newCompleted,
        }),
      });

      if (res.ok) {
        // Check if this is the certificate lesson and ALL lessons are now complete
        const isCertificateLesson =
          moduleSlug === "resources" && lessonSlug === "certificate";
        const allNowComplete =
          newCompleted && completedLessons.length + 1 >= totalLessons;

        if (isCertificateLesson && allNowComplete) {
          // Show celebration modal instead of navigating
          router.refresh();
          setShowCelebration(true);
        } else if (newCompleted && navigation.next) {
          // Navigate to next lesson — sidebar already updated optimistically
          router.push(
            `/course/${navigation.next.moduleSlug}/${navigation.next.lessonSlug}`
          );
          // Force revalidation so server data catches up with optimistic state
          router.refresh();
        } else {
          // Toggling incomplete or no next lesson — refresh server data
          router.refresh();
        }
      } else {
        // Revert on failure
        setCompleted(!newCompleted);
        onToggleComplete(lessonKey, !newCompleted);
      }
    } catch {
      // Revert on error
      setCompleted(!newCompleted);
      onToggleComplete(lessonKey, !newCompleted);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Mobile: button on top, nav row below */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="flex justify-center">
          <Button
            onClick={handleMarkComplete}
            disabled={loading}
            variant={completed ? "outline" : "default"}
            size="lg"
            className={
              completed
                ? "min-w-[200px] border-brass text-brass hover:bg-brass hover:text-white"
                : "min-w-[200px] border-0 bg-brass text-white hover:bg-brass/90"
            }
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : completed ? (
              <Check className="mr-2 h-4 w-4" />
            ) : null}
            {completed ? "Completed" : "Mark as Complete"}
          </Button>
        </div>

        <div className="flex items-center justify-between gap-4">
          {navigation.previous ? (
            <Button asChild variant="ghost" className="gap-2">
              <Link
                href={`/course/${navigation.previous.moduleSlug}/${navigation.previous.lessonSlug}`}
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Link>
            </Button>
          ) : (
            <div />
          )}

          {navigation.next ? (
            <Button asChild variant="ghost" className="gap-2">
              <Link
                href={`/course/${navigation.next.moduleSlug}/${navigation.next.lessonSlug}`}
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Desktop: single row — prev left, button center, next right */}
      <div className="hidden md:flex md:items-center md:justify-between md:gap-4">
        {navigation.previous ? (
          <Button asChild variant="ghost" className="gap-2 min-w-0 flex-shrink">
            <Link
              href={`/course/${navigation.previous.moduleSlug}/${navigation.previous.lessonSlug}`}
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              <span className="truncate max-w-[180px]">
                {navigation.previous.title}
              </span>
            </Link>
          </Button>
        ) : (
          <div className="min-w-[120px]" />
        )}

        <Button
          onClick={handleMarkComplete}
          disabled={loading}
          variant={completed ? "outline" : "default"}
          size="lg"
          className={
            completed
              ? "min-w-[200px] shrink-0 border-brass text-brass hover:bg-brass hover:text-white"
              : "min-w-[200px] shrink-0 border-0 bg-brass text-white hover:bg-brass/90"
          }
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : completed ? (
            <Check className="mr-2 h-4 w-4" />
          ) : null}
          {completed ? "Completed" : "Mark as Complete"}
        </Button>

        {navigation.next ? (
          <Button asChild variant="ghost" className="gap-2 min-w-0 flex-shrink">
            <Link
              href={`/course/${navigation.next.moduleSlug}/${navigation.next.lessonSlug}`}
            >
              <span className="truncate max-w-[180px]">
                {navigation.next.title}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </Button>
        ) : (
          <div className="min-w-[120px]" />
        )}
      </div>

      {/* Celebration modal — shown when student completes the entire course */}
      <CelebrationModal
        open={showCelebration}
        onOpenChange={setShowCelebration}
      />
    </>
  );
}
