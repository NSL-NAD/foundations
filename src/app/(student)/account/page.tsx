import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AvatarUpload } from "@/components/account/AvatarUpload";
import { CourseProgressMeter } from "@/components/account/CourseProgressMeter";
import { CourseCertificate } from "@/components/account/CourseCertificate";
import { DesignBriefLink } from "@/components/account/DesignBriefLink";
import { DreamHomeUpload } from "@/components/account/DreamHomeUpload";
import { CourseReview } from "@/components/account/CourseReview";
import { ShareInvite } from "@/components/account/ShareInvite";
import { ContactFOADialog } from "@/components/account/ContactFOADialog";
import { getTotalLessons } from "@/lib/course";

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
    <div className="container max-w-2xl py-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Account</h1>

      {/* Profile */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Course Progress */}
      <div className="mb-6">
        <CourseProgressMeter
          percent={overallPercent}
          completed={completed}
          total={totalLessons}
        />
      </div>

      {/* Certificate (only when 100% complete) */}
      {isComplete && (
        <div className="mb-6">
          <CourseCertificate
            isComplete={isComplete}
            studentName={profile?.full_name || "Student"}
            completionDate={completionDate}
          />
        </div>
      )}

      {/* Design Brief */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Design Brief</CardTitle>
        </CardHeader>
        <CardContent>
          <DesignBriefLink
            hasResponses={(briefResponseCount || 0) > 0}
            responseCount={briefResponseCount || 0}
          />
        </CardContent>
      </Card>

      {/* Dream Home Upload */}
      <Card className="mb-6">
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

      {/* Course Review */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Course Review</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseReview existingReview={existingReview} />
        </CardContent>
      </Card>

      {/* Share + Contact */}
      <Card className="mb-6">
        <CardContent className="flex flex-wrap items-center gap-3 pt-6">
          <ShareInvite />
          <ContactFOADialog />
        </CardContent>
      </Card>

      {/* Purchase History */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase History</CardTitle>
        </CardHeader>
        <CardContent>
          {purchases && purchases.length > 0 ? (
            <div className="space-y-3">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-medium capitalize">
                      {purchase.product_type === "bundle"
                        ? "Course + Starter Kit"
                        : purchase.product_type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(purchase.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
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
        </CardContent>
      </Card>
    </div>
  );
}
