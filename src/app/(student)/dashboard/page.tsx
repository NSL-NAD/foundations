import { createClient } from "@/lib/supabase/server";
import { getModules, getTotalLessons, getLessonPath, getFirstLesson } from "@/lib/course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, BookOpen, Trophy } from "lucide-react";
import Link from "next/link";

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

  const modules = getModules();
  const totalLessons = getTotalLessons();
  const completedCount = progressRecords?.length || 0;
  const completionPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const displayName =
    profile?.full_name || profile?.email?.split("@")[0] || "Student";

  const firstLesson = getFirstLesson();

  return (
    <div className="container py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {displayName}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Continue your architecture learning journey.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Course Progress
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercent}%</div>
            <Progress value={completionPercent} className="mt-2" />
            <p className="mt-2 text-xs text-muted-foreground">
              {completedCount} of {totalLessons} lessons completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lessons Completed
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="mt-2 text-xs text-muted-foreground">
              {totalLessons - completedCount} remaining
            </p>
          </CardContent>
        </Card>

        <Card className="flex flex-col justify-center">
          <CardContent className="pt-6">
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
          </CardContent>
        </Card>
      </div>

      {/* Module List */}
      <h2 className="mb-4 text-xl font-semibold">Course Modules</h2>
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
              className="group flex items-center justify-between rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
            >
              <div className="flex-1">
                <h3 className="font-medium group-hover:text-primary">
                  {mod.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {moduleCompleted}/{mod.lessons.length} lessons complete
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden w-24 sm:block">
                  <Progress value={percent} className="h-2" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {percent}%
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
