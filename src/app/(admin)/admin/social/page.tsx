import { createClient } from "@/lib/supabase/server";
import { getPublishedPosts, getPostBySlugUnfiltered } from "@/lib/blog";
import { ShareActions } from "@/components/admin/ShareActions";
import { SocialHubNav } from "@/components/admin/SocialHubNav";
import { PlatformTab } from "@/components/admin/PlatformTab";
import { SocialComposer } from "@/components/admin/SocialComposer";
import { CategoryBadge } from "@/components/blog/CategoryBadge";
import { format, startOfWeek } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = {
  title: "Social Hub | Admin",
};

interface SocialShare {
  blog_slug: string;
  platform: "linkedin" | "x" | "instagram";
  generated_copy: string | null;
  shared_at: string | null;
}

const validTabs = ["blogs", "linkedin", "x", "instagram"] as const;
type Tab = (typeof validTabs)[number];

export default async function AdminSocialPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const activeTab: Tab = validTabs.includes(params.tab as Tab)
    ? (params.tab as Tab)
    : "blogs";

  const posts = getPublishedPosts();
  const supabase = createClient();

  const { data: shares } = await supabase
    .from("social_shares")
    .select("blog_slug, platform, generated_copy, shared_at");

  const allShares = (shares || []) as SocialShare[];

  // Fetch pending + approved ideas for platform tabs
  const { data: ideasData } = await supabase
    .from("social_ideas")
    .select("*")
    .in("status", ["pending", "approved"])
    .order("generated_at", { ascending: false });

  const allIdeas = (ideasData || []) as Array<{
    id: string;
    platform: string;
    pillar: string;
    hook: string;
    body: string;
    source: string;
    status: "pending" | "approved" | "posted" | "dismissed";
    generated_at: string;
  }>;

  // Build a lookup map: slug -> { linkedin, x, instagram }
  const shareMap = new Map<string, Record<string, SocialShare>>();
  for (const share of allShares) {
    const existing = shareMap.get(share.blog_slug) || {};
    existing[share.platform] = share;
    shareMap.set(share.blog_slug, existing);
  }

  // Count posts shared this week (across all platforms)
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const thisWeekCount = allShares.filter(
    (s) => s.shared_at && new Date(s.shared_at) >= weekStart
  ).length;

  return (
    <div className="p-6 md:p-10">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl">
          Social Hub
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {thisWeekCount > 0
            ? `${thisWeekCount} post${thisWeekCount !== 1 ? "s" : ""} scheduled this week`
            : "No posts scheduled this week"}
        </p>
      </div>

      <div className="mb-6">
        <SocialHubNav activeTab={activeTab} />
      </div>

      {activeTab === "blogs" && (
        <BlogsTab posts={posts} shareMap={shareMap} />
      )}

      {(activeTab === "linkedin" ||
        activeTab === "x" ||
        activeTab === "instagram") && (
        <>
        <SocialComposer platform={activeTab} />
        <PlatformTab
          platform={activeTab}
          posts={allShares
            .filter((s) => s.platform === activeTab && s.shared_at)
            .sort(
              (a, b) =>
                new Date(b.shared_at!).getTime() -
                new Date(a.shared_at!).getTime()
            )
            .map((s) => {
              const post = getPostBySlugUnfiltered(s.blog_slug);
              return {
                blogTitle: post?.title || s.blog_slug,
                sharedAt: s.shared_at!,
                generatedCopy: s.generated_copy || "",
              };
            })}
          ideas={allIdeas.filter((i) => i.platform === activeTab)}
        />
        </>
      )}
    </div>
  );
}

/* ── Blogs Tab (preserves original page content exactly) ── */

function BlogsTab({
  posts,
  shareMap,
}: {
  posts: ReturnType<typeof getPublishedPosts>;
  shareMap: Map<string, Record<string, SocialShare>>;
}) {
  // Count pending shares
  const pendingCount = posts.reduce((count, post) => {
    const postShares = shareMap.get(post.slug) || {};
    const sharedPlatforms = ["linkedin", "x", "instagram"].filter(
      (p) => postShares[p]?.shared_at
    );
    return count + (sharedPlatforms.length < 3 ? 1 : 0);
  }, 0);

  return (
    <>
      {pendingCount > 0 && (
        <p className="mb-4 text-sm text-muted-foreground">
          {pendingCount} blog{pendingCount > 1 ? "s" : ""} with pending shares
        </p>
      )}
      <div className="rounded-card border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-5 text-xs font-medium uppercase tracking-wider">
                Blog Post
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Date
              </TableHead>
              <TableHead className="text-center text-xs font-medium uppercase tracking-wider">
                LinkedIn
              </TableHead>
              <TableHead className="text-center text-xs font-medium uppercase tracking-wider">
                X
              </TableHead>
              <TableHead className="text-center text-xs font-medium uppercase tracking-wider">
                Instagram
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => {
              const postShares = shareMap.get(post.slug) || {};

              return (
                <TableRow key={post.slug}>
                  <TableCell className="pl-5">
                    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                      <p className="font-medium text-sm leading-tight">
                        {post.title}
                      </p>
                      <CategoryBadge
                        category={post.category}
                        className="self-start shrink-0 text-[10px] px-2 py-0.5"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(post.date), "MMM d, yyyy")}
                  </TableCell>
                  {(["linkedin", "x", "instagram"] as const).map((platform) => {
                    const share = postShares[platform];
                    return (
                      <TableCell key={platform} className="text-center">
                        <div className="flex justify-center">
                          <ShareActions
                            blogSlug={post.slug}
                            blogTitle={post.title}
                            coverImage={post.coverImage}
                            category={post.category}
                            platform={platform}
                            existingCopy={share?.generated_copy || null}
                            sharedAt={share?.shared_at || null}
                          />
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
            {posts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-sm text-muted-foreground py-8"
                >
                  No published blog posts yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
