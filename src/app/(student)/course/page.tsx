import { createClient } from "@/lib/supabase/server";
import { getModules, getFirstLesson, getLessonPath } from "@/lib/course";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Check, PlayCircle, FileText, PenTool, ListChecks, PenLine, MessageCircle } from "lucide-react";
import Link from "next/link";
import { DashboardChatButton } from "@/components/dashboard/DashboardChatButton";

export const metadata = {
  title: "Course Overview",
};

const typeIcons: Record<string, typeof FileText> = {
  video: PlayCircle,
  text: FileText,
  exercise: PenTool,
  checklist: ListChecks,
};

export default async function CoursePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: progressRecords } = await supabase
    .from("lesson_progress")
    .select("lesson_slug, module_slug, completed")
    .eq("user_id", user!.id)
    .eq("completed", true);

  // Count notes
  const { count: noteCount } = await supabase
    .from("notebook_entries")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .neq("content", "");

  const completedSet = new Set(
    progressRecords?.map((p) => `${p.module_slug}/${p.lesson_slug}`) || []
  );

  const modules = getModules();
  const firstLesson = getFirstLesson();
  const totalCompleted = completedSet.size;
  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const overallPercent =
    totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold uppercase tracking-tight md:text-4xl">
            Course Overview
          </h1>
          <p className="mt-1 text-muted-foreground">
            {totalCompleted} of {totalLessons} lessons completed ({overallPercent}%)
          </p>
          <Progress value={overallPercent} className="mt-2 h-2 w-64" />
        </div>
        <Button asChild size="lg">
          <Link
            href={getLessonPath(firstLesson.moduleSlug, firstLesson.lessonSlug)}
          >
            {totalCompleted === 0 ? "Start Course" : "Continue Learning"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Tools */}
      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-card border bg-card p-6">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              My Notes
            </span>
            <PenLine className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="font-heading text-3xl font-bold">{noteCount || 0}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            {noteCount ? "notes across your lessons" : "Start taking notes in any lesson"}
          </p>
          <Button asChild variant="outline" size="sm" className="mt-3 w-full">
            <Link href="/dashboard/notebook">
              View All Notes
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="rounded-card border bg-card p-6">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              AI Assistant
            </span>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">Ask anything</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Search the course, review concepts, or get help
          </p>
          <div className="mt-3">
            <DashboardChatButton />
          </div>
        </div>
      </div>

      {/* Modules — 2-col on md */}
      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((mod) => {
          const moduleCompleted = mod.lessons.filter((l) =>
            completedSet.has(`${mod.slug}/${l.slug}`)
          ).length;
          const modulePercent =
            mod.lessons.length > 0
              ? Math.round((moduleCompleted / mod.lessons.length) * 100)
              : 0;

          return (
            <div key={mod.slug} className="rounded-card border bg-card">
              {/* Module header */}
              <div className="border-b p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-sm font-semibold uppercase tracking-wide">
                      {mod.title}
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {mod.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-[10px]">
                    {moduleCompleted}/{mod.lessons.length}
                  </Badge>
                </div>
                <Progress value={modulePercent} className="mt-3 h-1.5" />
              </div>

              {/* Lesson list — show ~5 rows, scroll the rest */}
              <div className="relative overflow-hidden rounded-b-card">
                <ul className="lesson-scroll divide-y overflow-y-auto max-h-[210px]">
                  {mod.lessons.map((lesson, lessonIdx) => {
                    const isComplete = completedSet.has(
                      `${mod.slug}/${lesson.slug}`
                    );
                    const Icon = typeIcons[lesson.type] || FileText;
                    const isLast = lessonIdx === mod.lessons.length - 1;

                    return (
                      <li key={lesson.slug}>
                        <Link
                          href={getLessonPath(mod.slug, lesson.slug)}
                          className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-accent/10 hover:text-accent ${
                            isLast ? "rounded-b-card" : ""
                          }`}
                        >
                          {isComplete ? (
                            <Check className="h-4 w-4 shrink-0 text-primary" />
                          ) : (
                            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                          )}
                          <span
                            className={
                              isComplete ? "text-muted-foreground" : ""
                            }
                          >
                            {lesson.title}
                          </span>
                          <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                            {lesson.duration}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {/* Fade indicator when there are more than 4 rows to scroll */}
                {mod.lessons.length > 4 && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 rounded-b-card bg-gradient-to-t from-card via-card/60 to-transparent" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
