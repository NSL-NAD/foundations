"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import type { LessonNavigation as LessonNav } from "@/types/course";

interface LessonNavigationProps {
  navigation: LessonNav;
  moduleSlug: string;
  lessonSlug: string;
  isCompleted: boolean;
}

export function LessonNavigation({
  navigation,
  moduleSlug,
  lessonSlug,
  isCompleted,
}: LessonNavigationProps) {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(isCompleted);
  const router = useRouter();

  async function handleMarkComplete() {
    setLoading(true);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lessonSlug,
          moduleSlug,
          completed: !completed,
        }),
      });

      if (res.ok) {
        setCompleted(!completed);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Mark Complete */}
      <div className="flex justify-center">
        <Button
          onClick={handleMarkComplete}
          disabled={loading}
          variant={completed ? "outline" : "default"}
          size="lg"
          className="min-w-[200px]"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : completed ? (
            <Check className="mr-2 h-4 w-4" />
          ) : null}
          {completed ? "Completed" : "Mark as Complete"}
        </Button>
      </div>

      {/* Prev / Next */}
      <div className="flex items-center justify-between gap-4">
        {navigation.previous ? (
          <Button asChild variant="ghost" className="gap-2">
            <Link
              href={`/course/${navigation.previous.moduleSlug}/${navigation.previous.lessonSlug}`}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">
                {navigation.previous.title}
              </span>
              <span className="sm:hidden">Previous</span>
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
              <span className="hidden sm:inline">
                {navigation.next.title}
              </span>
              <span className="sm:hidden">Next</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
