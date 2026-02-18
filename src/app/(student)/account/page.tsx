import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AvatarUpload } from "@/components/account/AvatarUpload";
import { CourseCertificateButton } from "@/components/account/CourseCertificate";
import { DreamHomeUpload } from "@/components/account/DreamHomeUpload";
import { CourseReview } from "@/components/account/CourseReview";
import { ShareInvite } from "@/components/account/ShareInvite";
import { ContactFOADialog } from "@/components/account/ContactFOADialog";
import { getTotalLessons, getFirstLesson, getLessonPath } from "@/lib/course";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Award, Lock, ArrowRight, ClipboardList } from "lucide-react";

export const metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: purchases } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  // Course progress
  const { count: completedLessons } = await supabase
    .from("lesson_progress")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .eq("completed", true);

  const totalLessons = getTotalLessons();
  const completed = completedLessons || 0;
  const overallPercent =
    totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  const isComplete = completed >= totalLessons && totalLessons > 0;
  const firstLesson = getFirstLesson();

  // Last completion date (for certificate)
  let completionDate = "";
  if (isComplete) {
    const { data: lastCompletion } = await supabase
      .from("lesson_progress")
      .select("completed_at")
      .eq("user_id", user!.id)
      .eq("completed", true)
      .order("completed_at", { ascending: false })
      .limit(1)
      .single();

    completionDate = lastCompletion?.completed_at
      ? new Date(lastCompletion.completed_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
  }

  // Design brief responses
  const { count: briefResponseCount } = await supabase
    .from("design_brief_responses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user!.id);

  // Existing course review
  const { data: existingReview } = await supabase
    .from("course_reviews")
    .select("rating, review_text")
    .eq("user_id", user!.id)
    .single();

  // Existing dream home submission
  const { data: existingSubmission } = await supabase
    .from("dream_home_submissions")
    .select("image_urls, description")
    .eq("user_id", user!.id)
    .single();

  return (
    <div className="p-6 md:p-8">
      <h1 className="mb-8 font-heading text-3xl font-bold uppercase tracking-tight md:text-4xl">
        Account
      </h1>

      {/* Row 1: Profile + Course Review + Course Progress */}
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
        {/* Profile — half width, includes purchase history & actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Left: avatar + info */}
              <div className="space-y-4">
                <div className="pb-2">
                  <AvatarUpload
                    userId={user!.id}
                    currentAvatarUrl={profile?.avatar_url ?? null}
                    fullName={profile?.full_name ?? null}
                    email={profile?.email ?? ""}
                  />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{profile?.full_name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member since</p>
                  <p className="font-medium">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Right: purchase history + share/contact */}
              <div className="flex flex-col">
                <p className="mb-3 text-sm font-semibold">Purchase History</p>
                {purchases && purchases.length > 0 ? (
                  <div className="space-y-3">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div>
                          <p className="text-sm font-medium capitalize">
                            {purchase.product_type === "bundle"
                              ? "Course + Starter Kit"
                              : purchase.product_type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(purchase.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            ${(purchase.amount_cents / 100).toFixed(2)}
                          </span>
                          <Badge
                            variant={
                              purchase.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {purchase.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No purchases yet.</p>
                )}
                <div className="mt-auto flex items-center justify-end gap-2 pt-4">
                  <ShareInvite />
                  <ContactFOADialog />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Review */}
        <Card className="flex flex-col transition-colors hover:border-foreground/20">
          <CardHeader>
            <CardTitle>Course Review</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            <CourseReview existingReview={existingReview} />
          </CardContent>
        </Card>

        {/* Course Progress — terracotta stat card */}
        <div className="flex flex-col rounded-card bg-accent text-accent-foreground p-6">
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
              {completed} of {totalLessons} lessons completed
            </p>
          </div>
        </div>
      </div>

      {/* Row 2: Design Brief + Certificate + Dream Home */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Design Brief */}
        <div className="group flex flex-col rounded-card bg-foreground p-6 text-background transition-all duration-300 hover:bg-transparent hover:text-foreground hover:ring-2 hover:ring-foreground">
          <ClipboardList className="h-6 w-6 text-background/50 transition-colors duration-300 group-hover:text-foreground/50" />
          <p className="mt-2 font-heading text-sm font-semibold uppercase tracking-wide">
            Design Brief
          </p>
          <p className="mt-1 text-xs text-background/70 transition-colors duration-300 group-hover:text-foreground/70">
            {(briefResponseCount || 0) > 0
              ? `${briefResponseCount} responses recorded — view your personalized brief`
              : "Complete lessons to start building your personalized Design Brief"}
          </p>
          <div className="mt-auto pt-4">
            <Button asChild size="sm" className="rounded-full border border-background bg-background px-6 text-xs font-medium uppercase tracking-wider text-foreground transition-all duration-300 hover:border-brass hover:bg-brass hover:text-white group-hover:border-foreground group-hover:bg-foreground group-hover:text-background group-hover:hover:border-brass group-hover:hover:bg-brass group-hover:hover:text-white">
              <Link href={getLessonPath(firstLesson.moduleSlug, firstLesson.lessonSlug)}>
                Continue Learning
                <ArrowRight className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Certificate — always visible */}
        {isComplete ? (
          <div className="flex flex-col rounded-card border border-primary/20 bg-primary/5 p-6">
            <Award className="h-6 w-6 text-primary" />
            <p className="mt-2 font-heading text-sm font-semibold uppercase tracking-wide">
              Course Complete!
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Download your certificate of completion
            </p>
            <div className="mt-auto pt-4">
              <CourseCertificateButton
                studentName={profile?.full_name || "Student"}
                completionDate={completionDate}
              />
            </div>
          </div>
        ) : (
          <div className="group flex flex-col rounded-card bg-foreground p-6 text-background transition-all duration-300 hover:bg-transparent hover:text-foreground hover:ring-2 hover:ring-foreground">
            <Lock className="h-6 w-6 text-background/50 transition-colors duration-300 group-hover:text-foreground/50" />
            <p className="mt-2 font-heading text-sm font-semibold uppercase tracking-wide">
              Certificate
            </p>
            <p className="mt-1 text-xs text-background/70 transition-colors duration-300 group-hover:text-foreground/70">
              Complete all lessons to unlock your PDF Certificate of Completion
            </p>
            <div className="mt-auto pt-4">
              <Button asChild size="sm" className="rounded-full border border-background bg-background px-6 text-xs font-medium uppercase tracking-wider text-foreground transition-all duration-300 hover:border-brass hover:bg-brass hover:text-white group-hover:border-foreground group-hover:bg-foreground group-hover:text-background group-hover:hover:border-brass group-hover:hover:bg-brass group-hover:hover:text-white">
                <Link href={getLessonPath(firstLesson.moduleSlug, firstLesson.lessonSlug)}>
                  Continue Learning
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* Dream Home / Space */}
        <Card>
          <CardHeader>
            <CardTitle>Dream Home / Space</CardTitle>
          </CardHeader>
          <CardContent>
            <DreamHomeUpload
              userId={user!.id}
              existingSubmission={existingSubmission}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
