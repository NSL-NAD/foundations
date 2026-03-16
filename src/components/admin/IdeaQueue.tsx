"use client";

import React, { useState } from "react";
import { Lightbulb, Sparkles, Check, X, ChevronDown, ChevronUp, Loader2, Send, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface SocialIdea {
  id: string;
  platform: string;
  pillar: string;
  hook: string;
  body: string;
  source: string;
  status: "pending" | "approved" | "posted" | "dismissed";
  generated_at: string;
}

const pillarColors: Record<string, string> = {
  Educate: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Inspire: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  Empower: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  "Hook/Provoke": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  SEO: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
};

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const platformIcons: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string }> = {
  linkedin: { icon: Linkedin, color: "text-[#0077B5]" },
  x: { icon: XIcon, color: "text-foreground" },
  instagram: { icon: Instagram, color: "text-[#E4405F]" },
};

export function IdeaQueue({
  ideas: initialIdeas,
  platform,
  onIdeaUpdate,
  onIdeasGenerated,
}: {
  ideas: SocialIdea[];
  platform: string;
  onIdeaUpdate?: (id: string, status: SocialIdea["status"]) => void;
  onIdeasGenerated?: (newIdeas: SocialIdea[]) => void;
}) {
  // Local state is source of truth for optimistic updates.
  // Do NOT sync back from initialIdeas after mount — that causes posted ideas to reappear.
  // Tab switches force a remount via key={activeTab} in the parent, which reinitialises state.
  const [ideas, setIdeas] = useState(initialIdeas);
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [postingId, setPostingId] = useState<string | null>(null);
  const [postedId, setPostedId] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  const pendingIdeas = ideas.filter((i: SocialIdea) => i.status === "pending");
  const approvedIdeas = ideas.filter((i: SocialIdea) => i.status === "approved");

  async function handleGenerate() {
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/social/ideas/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to generate ideas");
      }
      const data = await res.json();
      const newIdeas: SocialIdea[] = data.ideas || [];
      // Add new ideas to local state
      setIdeas((prev) => [...newIdeas, ...prev]);
      // Also bubble up to parent so they survive tab switches
      onIdeasGenerated?.(newIdeas);
    } catch (error) {
      console.error("Generate ideas error:", error);
      alert(error instanceof Error ? error.message : "Failed to generate ideas");
    } finally {
      setGenerating(false);
    }
  }

  async function handleUpdateStatus(id: string, status: "approved" | "dismissed") {
    setUpdatingId(id);
    // Optimistic update — local + parent
    setIdeas((prev: SocialIdea[]) =>
      prev.map((idea: SocialIdea) => (idea.id === id ? { ...idea, status } : idea))
    );
    onIdeaUpdate?.(id, status);
    try {
      const res = await fetch("/api/admin/social/ideas/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update");
    } catch (error) {
      // Revert on failure
      console.error("Update idea error:", error);
      setIdeas((prev: SocialIdea[]) =>
        prev.map((idea: SocialIdea) => (idea.id === id ? { ...idea, status: "pending" } : idea))
      );
      onIdeaUpdate?.(id, "pending");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handlePostIdea(idea: SocialIdea) {
    setPostingId(idea.id);
    setPostError(null);
    try {
      const res = await fetch("/api/admin/social/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogSlug: null, platform, copy: idea.body }),
      });
      if (!res.ok) {
        const err = await res.json();
        setPostError(err.error || "Failed to post via Buffer");
        return;
      }
      // Mark idea as posted in DB
      await fetch("/api/admin/social/ideas/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idea.id, status: "posted" }),
      });
      // Remove from local + parent state immediately
      setIdeas((prev) => prev.filter((i) => i.id !== idea.id));
      onIdeaUpdate?.(idea.id, "posted");
      setPostedId(idea.id);
      setTimeout(() => setPostedId(null), 2500);
    } catch {
      setPostError("Failed to post via Buffer");
    } finally {
      setPostingId(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-lg font-semibold">Idea Queue</h2>
          <span className="text-xs text-muted-foreground">
            ·  {pendingIdeas.length + approvedIdeas.length} ideas in queue
          </span>
          {approvedIdeas.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {approvedIdeas.length} approved
            </Badge>
          )}
        </div>
        <Button
          size="sm"
          onClick={handleGenerate}
          disabled={generating}
        >
          {generating ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Generate Ideas
            </>
          )}
        </Button>
      </div>

      {pendingIdeas.length === 0 && approvedIdeas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-muted p-3">
              <Lightbulb className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-heading text-lg font-semibold">No ideas yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Generate AI-powered content ideas based on trending topics in home
              design and architecture.
            </p>
            <Button className="mt-4" onClick={handleGenerate} disabled={generating}>
              {generating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Researching & generating…
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate Ideas
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {/* Approved first, then pending */}
          {[...approvedIdeas, ...pendingIdeas].map((idea) => {
            const isExpanded = expandedId === idea.id;
            const isUpdating = updatingId === idea.id;
            const isApproved = idea.status === "approved";
            const isPosted = postedId === idea.id;

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
                        {platformIcons[platform] && (() => {
                          const { icon: PlatformIcon, color } = platformIcons[platform];
                          return <PlatformIcon className={`h-4 w-4 shrink-0 ${color}`} />;
                        })()}
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            pillarColors[idea.pillar] ||
                            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {idea.pillar}
                        </span>
                        {isApproved && !isPosted && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                            <Check className="h-3 w-3" />
                            Ready to post
                          </span>
                        )}
                        {isPosted && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                            <Check className="h-3 w-3" />
                            Posted to Buffer!
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium leading-snug">{idea.hook}</p>
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground/80 whitespace-pre-line">
                          {isExpanded
                            ? idea.body
                            : idea.body.length > 100
                              ? idea.body.slice(0, 100) + "…"
                              : idea.body}
                        </p>
                        {idea.body.length > 100 && (
                          <button
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : idea.id)}
                            className="mt-1 inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {isExpanded ? (
                              <>less <ChevronUp className="h-3 w-3" /></>
                            ) : (
                              <>more <ChevronDown className="h-3 w-3" /></>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {isApproved ? (
                      <div className="flex shrink-0 gap-1.5">
                        <Button
                          size="sm"
                          onClick={() => handlePostIdea(idea)}
                          disabled={postingId === idea.id || isPosted}
                          className="h-8 gap-1.5"
                        >
                          {postingId === idea.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="h-3.5 w-3.5" />
                          )}
                          {postingId === idea.id ? "Posting..." : "Post via Buffer"}
                        </Button>
                        {/* Dismiss option for approved ideas */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-muted-foreground"
                          onClick={() => handleUpdateStatus(idea.id, "dismissed")}
                          disabled={isUpdating}
                          title="Dismiss idea"
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex shrink-0 gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-950"
                          onClick={() => handleUpdateStatus(idea.id, "approved")}
                          disabled={isUpdating}
                        >
                          <Check className="h-3.5 w-3.5" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 text-muted-foreground"
                          onClick={() => handleUpdateStatus(idea.id, "dismissed")}
                          disabled={isUpdating}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {postError && postingId === null && (
                    <p className="text-xs text-destructive mt-2">{postError}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
