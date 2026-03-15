"use client";

import { useState } from "react";
import { Lightbulb, Sparkles, Check, X, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
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

export function IdeaQueue({
  ideas: initialIdeas,
  platform,
}: {
  ideas: SocialIdea[];
  platform: string;
}) {
  const [ideas, setIdeas] = useState(initialIdeas);
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

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
      // Reload the page to get fresh data from the server
      window.location.reload();
    } catch (error) {
      console.error("Generate ideas error:", error);
      alert(error instanceof Error ? error.message : "Failed to generate ideas");
    } finally {
      setGenerating(false);
    }
  }

  async function handleUpdateStatus(id: string, status: "approved" | "dismissed") {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/social/ideas/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Failed to update");

      setIdeas((prev: SocialIdea[]) =>
        prev.map((idea: SocialIdea) => (idea.id === id ? { ...idea, status } : idea))
      );
    } catch (error) {
      console.error("Update idea error:", error);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-lg font-semibold">Idea Queue</h2>
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
            <h3 className="font-heading text-lg font-semibold">
              No ideas yet
            </h3>
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
          {/* Show approved ideas first, then pending */}
          {[...approvedIdeas, ...pendingIdeas].map((idea) => {
            const isExpanded = expandedId === idea.id;
            const isUpdating = updatingId === idea.id;
            const isApproved = idea.status === "approved";

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
                            pillarColors[idea.pillar] ||
                            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {idea.pillar}
                        </span>
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                            <Check className="h-3 w-3" />
                            Ready to post
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium leading-snug">
                        {idea.hook}
                      </p>
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
                            onClick={() =>
                              setExpandedId(isExpanded ? null : idea.id)
                            }
                            className="mt-1 inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {isExpanded ? (
                              <>
                                less <ChevronUp className="h-3 w-3" />
                              </>
                            ) : (
                              <>
                                more <ChevronDown className="h-3 w-3" />
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {!isApproved && (
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
                          onClick={() =>
                            handleUpdateStatus(idea.id, "dismissed")
                          }
                          disabled={isUpdating}
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
  );
}
