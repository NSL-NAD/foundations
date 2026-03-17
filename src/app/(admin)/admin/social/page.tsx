import { createClient } from "@/lib/supabase/server";
import { getPublishedPosts } from "@/lib/blog";
import { SocialHubClient } from "@/components/admin/SocialHubClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Social Hub | Admin",
};

import type { StrategySection } from "@/components/admin/StrategyTab";

const validTabs = ["strategy", "blogs", "linkedin", "x", "instagram"] as const;

const DEFAULT_STRATEGY_SECTIONS: StrategySection[] = [
  { id: "default-1", section_key: "seo-audit", section_number: 1, title: "Technical SEO Audit", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-2", section_key: "keyword-universe", section_number: 2, title: "Keyword Universe", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-3", section_key: "competitive", section_number: 3, title: "Competitive Landscape", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-4", section_key: "audience", section_number: 4, title: "Audience Definition", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-5", section_key: "customer-journey", section_number: 5, title: "Customer Journey", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-6", section_key: "platform-strategy", section_number: 6, title: "Platform Strategy", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-7", section_key: "paid-acquisition", section_number: 7, title: "Paid Acquisition Strategy", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-8", section_key: "partnerships", section_number: 8, title: "Partnerships and Outreach", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
  { id: "default-9", section_key: "content-calendar", section_number: 9, title: "Content Calendar Foundation", content: {}, summary: null, researched_at: null, status: "pending", created_at: "", updated_at: "" },
];
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

  // Fetch strategy sections
  const { data: strategyData } = await supabase
    .from("strategy_sections")
    .select("*")
    .order("section_number");

  const allStrategySections: StrategySection[] =
    strategyData && strategyData.length > 0
      ? (strategyData as StrategySection[])
      : DEFAULT_STRATEGY_SECTIONS;

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
        allStrategySections={allStrategySections}
        posts={posts}
      />
    </div>
  );
}
