"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PlatformTab } from "@/components/admin/PlatformTab";
import { SocialComposer } from "@/components/admin/SocialComposer";
import { ShareActions } from "@/components/admin/ShareActions";
import { CategoryBadge } from "@/components/blog/CategoryBadge";
import { format, startOfWeek } from "date-fns";
import { Check, X, Pencil, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StrategyTab, type StrategySection } from "@/components/admin/StrategyTab";
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

export interface SerializedBlogIdea {
  id: string;
  hook: string;
  outline: string | null;
  pillar: string;
  source: string;
  status: "pending" | "approved" | "dismissed";
  generated_at: string;
}

const tabs = [
  { key: "strategy", label: "Strategy", icon: Sparkles },
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
  allBlogIdeas,
  allStrategySections,
  posts,
}: {
  initialTab: Tab;
  allIdeas: SerializedIdea[];
  allShares: SerializedShare[];
  allBlogIdeas: SerializedBlogIdea[];
  allStrategySections: StrategySection[];
  posts: SerializedPost[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  // Lift ideas into parent state so tab switches don't reset posted/dismissed ideas
  const [ideas, setIdeas] = useState<SerializedIdea[]>(allIdeas);
  // Track shares in state so in-session posts update the count
  const [shares, setShares] = useState<SerializedShare[]>(allShares);
  // Blog ideas state
  const [blogIdeas, setBlogIdeas] = useState<SerializedBlogIdea[]>(allBlogIdeas);

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

  function handleBlogIdeaUpdate(id: string, updates: Partial<SerializedBlogIdea>) {
    setBlogIdeas((prev) =>
      updates.status === "dismissed"
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  }

  function handleShared(blogSlug: string, platform: string, sharedAt: string) {
    setShares((prev) => {
      const idx = prev.findIndex(
        (s) => s.blog_slug === blogSlug && s.platform === platform
      );
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], shared_at: sharedAt };
        return updated;
      }
      return [
        ...prev,
        {
          blog_slug: blogSlug,
          platform: platform as SerializedShare["platform"],
          generated_copy: null,
          shared_at: sharedAt,
        },
      ];
    });
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
      {/* Week count — hide on strategy tab */}
      {activeTab !== "strategy" && (
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
      )}

      {/* Tab nav */}
      <div className="mb-6">
      <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
        {tabs.map((tab) => {
          const TabIcon = "icon" in tab ? tab.icon : null;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all gap-1.5",
                activeTab === tab.key
                  ? "bg-background text-foreground shadow-sm"
                  : "hover:text-foreground/80"
              )}
            >
              {TabIcon && <TabIcon className="h-3.5 w-3.5" />}
              {tab.label}
            </button>
          );
        })}
      </div>
      </div>

      {/* Strategy tab */}
      {activeTab === "strategy" && (
        <StrategyTab sections={allStrategySections} />
      )}

      {/* Blogs tab */}
      {activeTab === "blogs" && (
        <BlogsTabContent
          posts={posts}
          shareMap={shareMap}
          onShared={handleShared}
          blogIdeas={blogIdeas}
          onBlogIdeaUpdate={handleBlogIdeaUpdate}
        />
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

const blogPillarColors: Record<string, string> = {
  Educate: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Inspire: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Empower: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Hook: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  SEO: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
};

/* ── Blogs Tab ── */
function BlogsTabContent({
  posts,
  shareMap,
  onShared,
  blogIdeas,
  onBlogIdeaUpdate,
}: {
  posts: SerializedPost[];
  shareMap: Map<string, Record<string, SerializedShare>>;
  onShared: (blogSlug: string, platform: string, sharedAt: string) => void;
  blogIdeas: SerializedBlogIdea[];
  onBlogIdeaUpdate: (id: string, updates: Partial<SerializedBlogIdea>) => void;
}) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editHook, setEditHook] = useState("");
  const [editOutline, setEditOutline] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  const pendingIdeas = blogIdeas.filter((i) => i.status === "pending");
  const approvedIdeas = blogIdeas.filter((i) => i.status === "approved");

  async function handleStatusUpdate(id: string, status: "approved" | "dismissed") {
    setUpdatingId(id);
    onBlogIdeaUpdate(id, { status });
    try {
      const res = await fetch("/api/admin/blog/ideas/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch (error) {
      console.error("Blog idea update error:", error);
      onBlogIdeaUpdate(id, { status: "pending" });
    } finally {
      setUpdatingId(null);
    }
  }

  function startEditing(idea: SerializedBlogIdea) {
    setEditingId(idea.id);
    setEditHook(idea.hook);
    setEditOutline(idea.outline || "");
    setTimeout(() => editInputRef.current?.focus(), 0);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditHook("");
    setEditOutline("");
  }

  async function saveEdit(id: string) {
    setSavingEdit(true);
    const trimmedHook = editHook.trim();
    const trimmedOutline = editOutline.trim();
    onBlogIdeaUpdate(id, { hook: trimmedHook, outline: trimmedOutline || null });
    setEditingId(null);
    try {
      const res = await fetch("/api/admin/blog/ideas/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, hook: trimmedHook, outline: trimmedOutline }),
      });
      if (!res.ok) throw new Error("Failed to save edit");
    } catch (error) {
      console.error("Blog idea edit error:", error);
    } finally {
      setSavingEdit(false);
    }
  }

  const pendingCount = posts.reduce((count, post) => {
    const postShares = shareMap.get(post.slug) || {};
    const sharedPlatforms = ["linkedin", "x", "instagram"].filter(
      (p) => postShares[p]?.shared_at
    );
    return count + (sharedPlatforms.length < 3 ? 1 : 0);
  }, 0);

  const hasIdeas = pendingIdeas.length > 0 || approvedIdeas.length > 0;

  return (
    <>
      {/* ── Blog Idea Queue ── */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-heading text-lg font-semibold">Blog Idea Queue</h2>
          <span className="inline-flex items-center rounded-full bg-[#C4704F]/15 px-2.5 py-0.5 text-xs font-medium text-[#C4704F]">
            {pendingIdeas.length} pending
          </span>
          {approvedIdeas.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
              {approvedIdeas.length} approved
            </span>
          )}
        </div>

        {!hasIdeas ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No blog ideas yet. Ideas are generated every Sunday by the weekly cron.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="max-h-[26rem] space-y-3 overflow-y-auto pr-1">
            {[...approvedIdeas, ...pendingIdeas].map((idea) => {
              const isApproved = idea.status === "approved";
              const isUpdating = updatingId === idea.id;
              const isEditing = editingId === idea.id;

              return (
                <Card
                  key={idea.id}
                  className={
                    isApproved
                      ? "border-green-200 bg-green-50/50 dark:border-green-900/50 dark:bg-green-950/20"
                      : ""
                  }
                >
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                              blogPillarColors[idea.pillar] ||
                              "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {idea.pillar}
                          </span>
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                              <Check className="h-3 w-3" />
                              Approved
                            </span>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="space-y-2">
                            <input
                              ref={editInputRef}
                              type="text"
                              value={editHook}
                              onChange={(e) => setEditHook(e.target.value)}
                              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-sm font-medium leading-snug text-foreground focus:outline-none focus:ring-2 focus:ring-green-500/40"
                            />
                            <textarea
                              value={editOutline}
                              onChange={(e) => setEditOutline(e.target.value)}
                              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-green-500/40 resize-y"
                              rows={3}
                              placeholder="Outline / angle (optional)"
                            />
                            <div className="flex gap-1.5 justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-7 text-xs text-muted-foreground"
                                onClick={cancelEditing}
                                disabled={savingEdit}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => saveEdit(idea.id)}
                                disabled={savingEdit || !editHook.trim()}
                              >
                                {savingEdit ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-sm font-medium leading-snug">{idea.hook}</p>
                            {idea.outline && (
                              <p className="mt-1 text-xs text-muted-foreground/80">
                                {idea.outline}
                              </p>
                            )}
                            {isApproved && (
                              <button
                                type="button"
                                onClick={() => startEditing(idea)}
                                className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Pencil className="h-3 w-3" />
                                Edit
                              </button>
                            )}
                          </>
                        )}
                      </div>

                      {!isEditing && (
                        <div className="flex shrink-0 gap-1.5">
                          {!isApproved && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
                              onClick={() => handleStatusUpdate(idea.id, "approved")}
                              disabled={isUpdating}
                            >
                              <Check className="h-3.5 w-3.5" />
                              Approve
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-muted-foreground"
                            onClick={() => handleStatusUpdate(idea.id, "dismissed")}
                            disabled={isUpdating}
                            title="Dismiss idea"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Published Blog Posts ── */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-heading text-lg font-semibold">Published Posts</h2>
          {pendingCount > 0 && (
            <span className="inline-flex items-center rounded-full bg-[#C4704F]/15 px-2.5 py-0.5 text-xs font-medium text-[#C4704F]">
              {pendingCount} pending shares
            </span>
          )}
        </div>
        <div className="max-h-[26rem] overflow-y-auto rounded-card border bg-card">
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
                              onShared={onShared}
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
      </div>
    </>
  );
}
