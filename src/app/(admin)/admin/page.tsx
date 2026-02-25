import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Package, ArrowRight, UserPlus, Star, UserCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminPage() {
  const supabase = createClient();

  const { count: totalStudents } = await supabase
    .from("purchases")
    .select("*", { count: "exact", head: true })
    .in("product_type", ["course", "bundle"])
    .eq("status", "completed");

  const { data: revenueData } = await supabase
    .from("purchases")
    .select("amount_cents")
    .eq("status", "completed");

  const totalRevenue =
    revenueData?.reduce((sum, p) => sum + p.amount_cents, 0) || 0;

  const { count: pendingKits } = await supabase
    .from("kit_orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // New (unviewed) students count
  const { count: newStudentsCount } = await supabase
    .from("purchases")
    .select("*", { count: "exact", head: true })
    .is("admin_viewed_at", null)
    .in("product_type", ["course", "bundle"])
    .eq("status", "completed");

  // Trial users count
  const { data: trialUsersCount } = (await supabase.rpc(
    "get_trial_users_count"
  )) as { data: number };

  // Recent reviews
  const { data: reviews } = await supabase
    .from("course_reviews")
    .select("rating, review_text, created_at, profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(10);

  const { count: totalReviews } = await supabase
    .from("course_reviews")
    .select("*", { count: "exact", head: true });

  return (
    <div className="p-6 md:p-10">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage students, orders, and track metrics.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/">View Site</Link>
        </Button>
      </div>

      {/* Stats + Actions grid */}
      <div className="max-w-4xl">
        {/* Row 1: Total Students | Students | New Students */}
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          {/* Total Students — stat */}
          <div className="flex flex-col justify-between rounded-card bg-primary p-5 text-white md:min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-white/70">
                Total Students
              </span>
              <Users className="h-4 w-4 text-white/50" />
            </div>
            <div className="mt-4 font-heading text-3xl font-bold">
              {totalStudents || 0}
            </div>
          </div>

          {/* Students — action link */}
          <Link
            href="/admin/students"
            className="group flex flex-col justify-between rounded-card bg-accent p-5 text-white transition-opacity hover:opacity-90 md:min-h-[140px]"
          >
            <div>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wider">
                Students
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-white/80">
                View and manage accounts
              </p>
            </div>
            <ArrowRight className="mt-4 h-4 w-4 text-white/70 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* New Students — clickable stat */}
          <Link
            href="/admin/new-students"
            className="group col-span-2 md:col-span-1"
          >
            <div className="flex h-full flex-col justify-between rounded-card border bg-card p-5 transition-shadow hover:shadow-md md:min-h-[140px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  New Students
                </span>
                <UserPlus className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="mt-4 font-heading text-3xl font-bold">
                  {newStudentsCount || 0}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {(newStudentsCount || 0) > 0
                    ? "Click to view & mark as viewed"
                    : "All caught up"}
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Row 2: Pending Kit Orders | Kit Orders | Total Revenue */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {/* Pending Kit Orders — stat */}
          <div className="flex flex-col justify-between rounded-card bg-primary p-5 text-white md:min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-white/70">
                Pending Kit Orders
              </span>
              <Package className="h-4 w-4 text-white/50" />
            </div>
            <div className="mt-4 font-heading text-3xl font-bold">
              {pendingKits || 0}
            </div>
          </div>

          {/* Kit Orders — action link */}
          <Link
            href="/admin/orders"
            className="group flex flex-col justify-between rounded-card bg-accent p-5 text-white transition-opacity hover:opacity-90 md:min-h-[140px]"
          >
            <div>
              <h2 className="font-heading text-sm font-semibold uppercase tracking-wider">
                Kit Orders
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-white/80">
                Manage fulfillment and tracking
              </p>
            </div>
            <ArrowRight className="mt-4 h-4 w-4 text-white/70 transition-transform group-hover:translate-x-1" />
          </Link>

          {/* Trial Users — clickable stat */}
          <Link
            href="/admin/trial-users"
            className="group col-span-2 md:col-span-1"
          >
            <div className="flex h-full flex-col justify-between rounded-card border bg-card p-5 transition-shadow hover:shadow-md md:min-h-[140px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Trial Users
                </span>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <div className="mt-4 font-heading text-3xl font-bold">
                  {trialUsersCount || 0}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Click to view trial users
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Row 3: Total Revenue */}
        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
          <div className="col-span-2 flex flex-col justify-between rounded-card border bg-card p-5 md:col-span-1 md:min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Total Revenue
              </span>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-4 font-heading text-3xl font-bold">
              ${(totalRevenue / 100).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Row 3: Reviews */}
        <div className="mt-4 rounded-card border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Student Reviews
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {totalReviews || 0} total
            </span>
          </div>

          {reviews && reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((review, i) => {
                const profile = review.profiles as unknown as {
                  full_name: string | null;
                  email: string | null;
                } | null;
                return (
                  <div
                    key={i}
                    className="rounded-md border bg-background p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-3.5 w-3.5 ${
                                star <= review.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground/30"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {profile?.full_name || "Student"}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.review_text && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {review.review_text}
                      </p>
                    )}
                    {profile?.email && (
                      <p className="mt-1 text-xs text-muted-foreground/70">
                        {profile.email}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No reviews yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
