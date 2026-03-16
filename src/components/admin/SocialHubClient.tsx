"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PlatformTab } from "@/components/admin/PlatformTab";
import { SocialComposer } from "@/components/admin/SocialComposer";
import { ShareActions } from "@/components/admin/ShareActions";
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

export interface SerializedShare {
  blog_slug: string;
  platform: "linkedin" | "x" | "instagram";
  generated_copy: string | null;
  shared_at: string | null;
}

export interface SerializedIdea {
  id: string;
  platform: string;
  pillar: string;
  hook: string;
  body: string;
  source: string;
  status: "pending" | "approved" | "posted" | "dismissed";
  generated_at: string;
}

export interface SerializedPost {
  slug: string;
  title: string;
  date: string;
  category: string;
  coverImage: string | null;
}

const tabs = [
  { key: "blogs", label: "Blogs" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "x", label: "X" },
  { key: "instagram", label: "Instagram" },
] as const;

type Tab = (typeof tabs)[number]["key"];

export function SocialHubClient({
  initialTab,
  allIdeas,
  allShares,
  posts,
}: {
  initialTab: Tab;
  allIdeas: SerializedIdea[];
  allShares: SerializedShare[];
  posts: SerializedPost[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  // Lift ideas into parent state so tab switches don't reset posted/dismissed ideas
  const [ideas, setIdeas] = useState<SerializedIdea[]>(allIdeas);
  // Track shares in state so in-session posts update the count
  const [shares, setShares] = useState<SerializedShare[]>(allShares);

  function handleIdeaUpdate(id: string, status: SerializedIdea["status"]) {
    setIdeas((prev) =>
      status === "posted" || status === "dismissed"
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
  }

  function handleIdeasGenerated(newIdeas: SerializedIdea[]) {
    setIdeas((prev) => [...newIdeas, ...prev]);
  }

  function handleTabChange(tab: Tab) {
    setActiveTab(tab);
    // Update URL for shareability without triggering server re-render
    router.replace(`/admin/social?tab=${tab}`, { scroll: false });
  }

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const thisWeekCount = shares.filter(
    (s) =>
      s.shared_at &&
      new Date(s.shared_at) >= weekStart &&
      (activeTab === "blogs" || s.platform === activeTab)
  ).length;
  const totalPlatformCount =
    activeTab !== "blogs"
      ? shares.filter((s) => s.shared_at && s.platform === activeTab).length
      : 0;

  // Build shareMap for BlogsTab
  const shareMap = new Map<string, Record<string, SerializedShare>>();
  for (const share of shares) {
    const existing = shareMap.get(share.blog_slug) || {};
    existing[share.platform] = share;
    shareMap.set(share.blog_slug, existing);
  }

  // Filter data for current platform tab
  const platformShares =
    activeTab !== "blogs"
      ? shares
          .filter((s) => s.platform === activeTab && s.shared_at)
          .sort(
            (a, b) =>
              new Date(b.shared_at!).getTime() - new Date(a.shared_at!).getTime()
          )
          .slice(0, 3)
          .map((s) => {
            const isComposer = s.blog_slug.startsWith("composer-");
            const post = isComposer ? null : posts.find((p) => p.slug === s.blog_slug);
            return {
              blogTitle: isComposer ? "Composer post" : (post?.title || s.blog_slug),
              isComposer,
              sharedAt: s.shared_at!,
              generatedCopy: s.generated_copy || "",
            };
          })
      : [];

  const platformIdeas =
    activeTab !== "blogs"
      ? ideas.filter((i) => i.platform === activeTab)
      : [];

  return (
    <div>
      {/* Week count */}
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        {activeTab === "blogs"
          ? thisWeekCount > 0
            ? `${thisWeekCount} post${thisWeekCount !== 1 ? "s" : ""} shared this week`
            : "No posts shared this week"
          : totalPlatformCount > 0
            ? `${totalPlatformCount} post${totalPlatformCount !== 1 ? "s" : ""} shared` +
              (thisWeekCount > 0 ? ` · ${thisWeekCount} this week` : "")
            : "No posts shared yet"}
      </p>

      {/* Tab nav */}
      <div className="mb-6">
      <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabChange(tab.key)}
            className={cn(
              "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all",
              activeTab === tab.key
                ? "bg-background text-foreground shadow-sm"
                : "hover:text-foreground/80"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      </div>

      {/* Blogs tab */}
      {activeTab === "blogs" && (
        <BlogsTabContent posts={posts} shareMap={shareMap} />
      )}

      {/* Platform tabs */}
      {(activeTab === "linkedin" || activeTab === "x" || activeTab === "instagram") && (
        <>
          <SocialComposer platform={activeTab} />
          <PlatformTab
            key={activeTab}
            platform={activeTab}
            posts={platformShares}
            ideas={platformIdeas}
            onIdeaUpdate={handleIdeaUpdate}
            onIdeasGenerated={handleIdeasGenerated}
          />
        </>
      )}
    </div>
  );
}

/* ── Blogs Tab ── */
function BlogsTabContent({
  posts,
  shareMap,
}: {
  posts: SerializedPost[];
  shareMap: Map<string, Record<string, SerializedShare>>;
}) {
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
                      <p className="font-medium text-sm leading-tight">{post.title}</p>
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
                            coverImage={post.coverImage || ""}
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
