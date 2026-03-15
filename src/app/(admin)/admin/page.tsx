import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Package, ArrowRight, UserPlus, Star, UserCheck, Share2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/blog";
import { ShareActions } from "@/components/admin/ShareActions";
import { CategoryBadge } from "@/components/blog/CategoryBadge";

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
    .order("created_at", { ascending: false });

  const { count: totalReviews } = await supabase
    .from("course_reviews")
    .select("*", { count: "exact", head: true });

  // Latest blog + social shares
  const latestPost = getPublishedPosts()[0] || null;
  const { data: latestShares } = latestPost
    ? await supabase
        .from("social_shares")
        .select("blog_slug, platform, generated_copy, shared_at")
        .eq("blog_slug", latestPost.slug)
    : { data: [] };

  const latestShareMap: Record<string, { generated_copy: string | null; shared_at: string | null }> = {};
  for (const s of latestShares || []) {
    latestShareMap[s.platform] = {
      generated_copy: s.generated_copy,
      shared_at: s.shared_at,
    };
  }

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
        <div className="flex items-center gap-2">
          <form action="/api/auth/signout" method="POST">
            <Button variant="outline" size="sm" type="submit">
              Sign Out
            </Button>
          </form>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">View Site</Link>
          </Button>
        </div>
      </div>

      {/* Stats + Reviews layout */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        {/* Left: Stats + Actions grid */}
        <div className="flex-1 max-w-4xl">
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

          {/* Row 2: Pending Kit Orders | Kit Orders | Trial Users */}
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

          {/* Row 3: Total Revenue + Latest Blog */}
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

            {/* Latest Blog Card */}
            {latestPost && (
              <div className="col-span-2 md:col-span-1 rounded-card border bg-card overflow-hidden">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={latestPost.coverImage}
                    alt={latestPost.coverImageAlt || latestPost.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        Latest Blog
                      </span>
                    </div>
                    <Link
                      href="/admin/social"
                      className="text-[10px] text-primary hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  <Link
                    href="/admin/social"
                    className="block font-medium text-sm leading-tight hover:text-primary transition-colors"
                  >
                    {latestPost.title}
                  </Link>
                  <div className="mt-1 flex items-center gap-2">
                    <CategoryBadge
                      category={latestPost.category}
                      className="text-[10px] px-2 py-0.5"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(latestPost.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    {(["linkedin", "x", "instagram"] as const).map((platform) => (
                      <ShareActions
                        key={platform}
                        blogSlug={latestPost.slug}
                        blogTitle={latestPost.title}
                        coverImage={latestPost.coverImage}
                        platform={platform}
                        category={latestPost.category}
                        existingCopy={latestShareMap[platform]?.generated_copy || null}
                        sharedAt={latestShareMap[platform]?.shared_at || null}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Student Reviews — gradient card (light base) */}
        <div className="relative w-full overflow-hidden rounded-card border bg-background md:w-80 md:self-stretch">
          {/* Gradient orbs */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#5F7F96]/20 blur-[60px]" />
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#B8593B]/15 blur-[55px]" />
          <div className="pointer-events-none absolute -top-8 right-8 h-48 w-48 rounded-full bg-[#C4A44E]/15 blur-[50px]" />
          <div className="pointer-events-none absolute bottom-4 left-1/3 h-56 w-56 rounded-full bg-[#6B3FA0]/10 blur-[55px]" />

          {/* Content */}
          <div className="relative flex h-full flex-col p-5">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
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

            {/* Scrollable review list */}
            {reviews && reviews.length > 0 ? (
              <div className="flex-1 space-y-2.5 overflow-y-auto md:max-h-[400px]">
                {reviews.map((review, i) => {
                  const profile = review.profiles as unknown as {
                    full_name: string | null;
                    email: string | null;
                  } | null;
                  return (
                    <div
                      key={i}
                      className="rounded-md border bg-card/80 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= review.rating
                                    ? "fill-[#C4A44E] text-[#C4A44E]"
                                    : "text-muted-foreground/20"
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
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                          {review.review_text}
                        </p>
                      )}
                      {profile?.email && (
                        <p className="mt-1 text-xs text-muted-foreground/50">
                          {profile.email}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
