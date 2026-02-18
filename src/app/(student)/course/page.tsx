import { createClient } from "@/lib/supabase/server";
import { getModules, getFirstLesson, getLessonPath } from "@/lib/course";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, PlayCircle, FileText, PenTool, ListChecks, PenLine, MessageCircle, BookOpen, Trophy, ClipboardList, Award } from "lucide-react";
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
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold uppercase tracking-tight md:text-4xl">
          Course Overview
        </h1>
        <Button asChild size="lg" className="mt-4">
          <Link
            href={getLessonPath(firstLesson.moduleSlug, firstLesson.lessonSlug)}
          >
            {totalCompleted === 0 ? "Start Course" : "Continue Learning"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats & Tools — single row on desktop, 2x2 on mobile */}
      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="flex flex-col rounded-card border-accent-foreground/10 bg-accent text-accent-foreground p-6">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-accent-foreground/70">
              Course Progress
            </span>
            <BookOpen className="h-4 w-4 text-accent-foreground/70" />
          </div>
          <div className="font-heading text-3xl font-bold">{overallPercent}%</div>
          <div className="mt-auto pt-3">
            <Progress value={overallPercent} className="h-2 bg-accent-foreground/20 [&>div]:bg-accent-foreground" />
            <p className="mt-2 text-xs text-accent-foreground/70">
              {totalCompleted} of {totalLessons} lessons completed
            </p>
          </div>
        </div>

        <div className="flex flex-col rounded-card border-accent-foreground/10 bg-accent text-accent-foreground p-6">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-accent-foreground/70">
              Lessons Completed
            </span>
            <Trophy className="h-4 w-4 text-accent-foreground/70" />
          </div>
          <div className="font-heading text-3xl font-bold">{totalCompleted}</div>
          <p className="mt-auto pt-3 text-xs text-accent-foreground/70">
            {totalLessons - totalCompleted} remaining
          </p>
        </div>

        <div className="flex flex-col rounded-card border-accent-foreground/10 bg-accent text-accent-foreground p-6">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-accent-foreground/70">
              My Notebook
            </span>
            <PenLine className="h-4 w-4 text-accent-foreground/70" />
          </div>
          <div className="font-heading text-3xl font-bold">{noteCount || 0}</div>
          <p className="mt-1 flex-1 text-xs text-accent-foreground/70">
            {noteCount ? "notes across your lessons" : "Start taking notes in any lesson"}
          </p>
          <div className="mt-3">
            <Button asChild size="sm" variant="secondary" className="bg-accent-foreground text-foreground hover:bg-accent-foreground/90">
              <Link href="/dashboard/notebook">
                View All Notes
                <ArrowRight className="ml-1.5 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col rounded-card border-accent-foreground/10 bg-accent text-accent-foreground p-6">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-accent-foreground/70">
              AI Assistant
            </span>
            <MessageCircle className="h-4 w-4 text-accent-foreground/70" />
          </div>
          <div className="font-heading text-3xl font-bold">Ask anything</div>
          <p className="mt-1 flex-1 text-xs text-accent-foreground/70">
            Search the course, review concepts, or get help
          </p>
          <div className="mt-3">
            <DashboardChatButton />
          </div>
        </div>
      </div>

      {/* Modules — 2-col on md */}
      <div className="grid gap-4 md:grid-cols-2">
        {modules.map((mod, modIdx) => {
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
                  <div className="flex items-start gap-3">
                    <span className="shrink-0 font-heading text-2xl font-bold text-primary/50">
                      {String(modIdx + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h2 className="font-heading text-sm font-semibold uppercase tracking-wide">
                        {mod.title}
                      </h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {mod.description}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 font-heading text-2xl font-bold text-accent/40">
                    {modulePercent}%
                  </span>
                </div>
                <Progress value={modulePercent} className="mt-3 h-1.5" />
              </div>

              {/* Lesson list — show ~5 rows, scroll the rest */}
              <div className="overflow-hidden rounded-b-card">
                <ul className="lesson-scroll divide-y max-h-[210px] overflow-y-auto">
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
                          className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-accent/10 ${
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
              </div>
            </div>
          );
        })}

          {/* Info cards — Design Brief & Certificate */}
          <div className="flex flex-col rounded-card bg-primary text-primary-foreground p-6 min-h-[200px]">
            <ClipboardList className="h-5 w-5 text-primary-foreground/50" />
            <h2 className="mt-3 font-heading text-2xl font-bold uppercase tracking-tight">
              Design Brief
            </h2>
            <p className="mt-auto text-xs text-primary-foreground/70">
              As you progress through each module, your answers and decisions compile into a personalized Design Brief — a complete reference document for your dream home.
            </p>
          </div>

          <div className="flex flex-col rounded-card bg-accent text-accent-foreground p-6 min-h-[200px]">
            <Award className="h-5 w-5 text-accent-foreground/50" />
            <h2 className="mt-3 font-heading text-2xl font-bold uppercase tracking-tight">
              Certificate
            </h2>
            <p className="mt-auto text-xs text-accent-foreground/70">
              Complete all lessons to unlock a downloadable PDF Certificate of Completion — proof of your architectural foundations knowledge.
            </p>
          </div>
      </div>
    </div>
  );
}
