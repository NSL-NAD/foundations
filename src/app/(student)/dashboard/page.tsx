import { createClient } from "@/lib/supabase/server";
import { getModules, getTotalLessons, getLessonPath, getFirstLesson } from "@/lib/course";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, BookOpen, Trophy, PenLine, MessageCircle } from "lucide-react";
import Link from "next/link";
import { DashboardChatButton } from "@/components/dashboard/DashboardChatButton";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user!.id)
    .single();

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

  const modules = getModules();
  const totalLessons = getTotalLessons();
  const completedCount = progressRecords?.length || 0;
  const completionPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const displayName =
    profile?.full_name || profile?.email?.split("@")[0] || "Student";

  const firstLesson = getFirstLesson();

  return (
    <div className="container py-10 md:py-14">
      {/* Welcome */}
      <div className="mb-10">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl">
          Welcome back, {displayName}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Continue your architecture learning journey.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="mb-10 grid gap-4 md:grid-cols-3">
        <div className="rounded-card border bg-card p-6">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Course Progress
            </span>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="font-heading text-3xl font-bold">{completionPercent}%</div>
          <Progress value={completionPercent} className="mt-3" />
          <p className="mt-2 text-xs text-muted-foreground">
            {completedCount} of {totalLessons} lessons completed
          </p>
        </div>

        <div className="rounded-card border bg-card p-6">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Lessons Completed
            </span>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="font-heading text-3xl font-bold">{completedCount}</div>
          <p className="mt-2 text-xs text-muted-foreground">
            {totalLessons - completedCount} remaining
          </p>
        </div>

        <div className="flex flex-col justify-center rounded-card border bg-card p-6">
          <Button asChild className="w-full" size="lg">
            <Link
              href={
                completedCount === 0
                  ? getLessonPath(firstLesson.moduleSlug, firstLesson.lessonSlug)
                  : "/course"
              }
            >
              {completedCount === 0 ? "Start Learning" : "Continue Learning"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Tools */}
      <div className="mb-10 grid gap-4 md:grid-cols-2">
        <div className="rounded-card border bg-card p-6">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              My Notes
            </span>
            <PenLine className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="font-heading text-3xl font-bold">{noteCount || 0}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            {noteCount ? "notes across your lessons" : "Start taking notes in any lesson"}
          </p>
          <Button asChild variant="outline" size="sm" className="mt-4 w-full">
            <Link href="/dashboard/notebook">
              View All Notes
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="rounded-card border bg-card p-6">
          <div className="flex items-center justify-between pb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              AI Assistant
            </span>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="font-heading text-sm font-semibold uppercase">Ask anything</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Search the course, review concepts, or get help
          </p>
          <div className="mt-4">
            <DashboardChatButton />
          </div>
        </div>
      </div>

      {/* Module List */}
      <h2 className="mb-4 font-heading text-lg font-semibold uppercase tracking-wide">
        Course Modules
      </h2>
      <div className="grid gap-3">
        {modules.map((mod) => {
          const moduleCompleted =
            progressRecords?.filter((p) => p.module_slug === mod.slug)
              .length || 0;
          const percent =
            mod.lessons.length > 0
              ? Math.round((moduleCompleted / mod.lessons.length) * 100)
              : 0;
          const firstModuleLesson = mod.lessons[0];

          return (
            <Link
              key={mod.slug}
              href={getLessonPath(mod.slug, firstModuleLesson.slug)}
              className="group flex items-center justify-between rounded-card border bg-card p-5 transition-all hover:border-foreground/20"
            >
              <div className="flex-1">
                <h3 className="font-heading text-sm font-semibold uppercase tracking-wide group-hover:text-primary">
                  {mod.title}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {moduleCompleted}/{mod.lessons.length} lessons complete
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden w-24 sm:block">
                  <Progress value={percent} className="h-2" />
                </div>
                <span className="text-sm font-medium text-muted-foreground">
                  {percent}%
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
