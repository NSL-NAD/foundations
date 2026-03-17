import { createClient } from "@/lib/supabase/server";
import { getPublishedPosts } from "@/lib/blog";
import { SocialHubClient } from "@/components/admin/SocialHubClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Social Hub | Admin",
};

const validTabs = ["blogs", "linkedin", "x", "instagram"] as const;
type Tab = (typeof validTabs)[number];

export default async function AdminSocialPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const initialTab: Tab = validTabs.includes(params.tab as Tab)
    ? (params.tab as Tab)
    : "blogs";

  const supabase = createClient();

  // Fetch all shares
  const { data: sharesData } = await supabase
    .from("social_shares")
    .select("blog_slug, platform, generated_copy, shared_at");

  // Fetch all pending + approved ideas (all platforms)
  const { data: ideasData } = await supabase
    .from("social_ideas")
    .select("*")
    .in("status", ["pending", "approved"])
    .order("generated_at", { ascending: false });

  // Fetch pending + approved blog ideas
  const { data: blogIdeasData } = await supabase
    .from("blog_ideas")
    .select("*")
    .in("status", ["pending", "approved"])
    .order("generated_at", { ascending: false });

  // Serialize blog posts (strip non-plain fields)
  const rawPosts = getPublishedPosts();
  const posts = rawPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    category: p.category,
    coverImage: p.coverImage ?? null,
  }));

  return (
    <div className="p-6 md:p-10">
      <div className="mb-0">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl">
          Social Hub
        </h1>
      </div>

      <SocialHubClient
        initialTab={initialTab}
        allIdeas={(ideasData || []) as Parameters<typeof SocialHubClient>[0]["allIdeas"]}
        allShares={(sharesData || []) as Parameters<typeof SocialHubClient>[0]["allShares"]}
        allBlogIdeas={(blogIdeasData || []) as Parameters<typeof SocialHubClient>[0]["allBlogIdeas"]}
        posts={posts}
      />
    </div>
  );
}
