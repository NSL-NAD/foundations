"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Lightbulb, Sparkles, Check, X, ChevronDown, ChevronUp, Loader2, Send, Linkedin, Instagram, Pencil, RefreshCw, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
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

const PLATFORM_CHAR_LIMITS: Record<string, number> = {
  linkedin: 1200,
  x: 280,
  instagram: 2200,
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
  const [ideas, setIdeas] = useState(initialIdeas);
  const [generating, setGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [postingId, setPostingId] = useState<string | null>(null);
  const [postedId, setPostedId] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const editTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Instagram image generation state (per-idea)
  const [generatingImageId, setGeneratingImageId] = useState<string | null>(null);
  const [ideaImages, setIdeaImages] = useState<Record<string, string>>({});
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePromptFeedback, setImagePromptFeedback] = useState<Record<string, string>>({});
  const [expandedImage, setExpandedImage] = useState<string | null>(null);

  // Close lightbox on Escape
  const handleEscKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setExpandedImage(null);
  }, []);
  useEffect(() => {
    if (expandedImage) {
      document.addEventListener("keydown", handleEscKey);
      return () => document.removeEventListener("keydown", handleEscKey);
    }
  }, [expandedImage, handleEscKey]);

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
      setIdeas((prev) => [...newIdeas, ...prev]);
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
      console.error("Update idea error:", error);
      setIdeas((prev: SocialIdea[]) =>
        prev.map((idea: SocialIdea) => (idea.id === id ? { ...idea, status: "pending" } : idea))
      );
      onIdeaUpdate?.(id, "pending");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleGenerateImage(idea: SocialIdea, feedbackText?: string) {
    setGeneratingImageId(idea.id);
    setImageError(null);
    try {
      const res = await fetch("/api/admin/social/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ copy: idea.body, platform: "instagram", feedback: feedbackText || "" }),
      });
      if (!res.ok) {
        const err = await res.json();
        setImageError(err.error || "Failed to generate image");
        return;
      }
      const data = await res.json();
      setIdeaImages((prev) => ({ ...prev, [idea.id]: data.imageUrl }));
    } catch {
      setImageError("Failed to generate image");
    } finally {
      setGeneratingImageId(null);
    }
  }

  async function handlePostIdea(idea: SocialIdea) {
    const imageUrl = ideaImages[idea.id];

    // For Instagram, require an image
    if (platform === "instagram" && !imageUrl) {
      // Trigger image generation first
      await handleGenerateImage(idea);
      return;
    }

    setPostingId(idea.id);
    setPostError(null);
    try {
      const res = await fetch("/api/admin/social/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogSlug: null,
          platform,
          copy: idea.body,
          ...(imageUrl ? { imageUrl } : {}),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setPostError(err.error || "Failed to schedule");
        return;
      }
      await fetch("/api/admin/social/ideas/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: idea.id, status: "posted" }),
      });
      setIdeas((prev) => prev.filter((i) => i.id !== idea.id));
      onIdeaUpdate?.(idea.id, "posted");
      setPostedId(idea.id);
      setTimeout(() => setPostedId(null), 2500);
    } catch {
      setPostError("Failed to schedule");
    } finally {
      setPostingId(null);
    }
  }

  function startEditing(idea: SocialIdea) {
    setEditingId(idea.id);
    setEditBody(idea.body);
    setExpandedId(idea.id);
    setTimeout(() => editTextareaRef.current?.focus(), 0);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditBody("");
  }

  async function saveEdit(id: string) {
    setSavingEdit(true);
    const trimmed = editBody.trim();
    setIdeas((prev) =>
      prev.map((idea) => (idea.id === id ? { ...idea, body: trimmed } : idea))
    );
    setEditingId(null);
    // Clear any previously generated image since copy changed
    setIdeaImages((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    try {
      const res = await fetch("/api/admin/social/ideas/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, body: trimmed }),
      });
      if (!res.ok) throw new Error("Failed to save edit");
    } catch (error) {
      console.error("Save edit error:", error);
      const original = initialIdeas.find((i) => i.id === id);
      if (original) {
        setIdeas((prev) =>
          prev.map((idea) => (idea.id === id ? { ...idea, body: original.body } : idea))
        );
      }
    } finally {
      setSavingEdit(false);
    }
  }

  const charLimit = PLATFORM_CHAR_LIMITS[platform];
  const isInstagram = platform === "instagram";

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-lg font-semibold">Idea Queue</h2>
          <span className="inline-flex items-center rounded-full bg-[#C4704F]/15 px-2.5 py-0.5 text-xs font-medium text-[#C4704F]">
            {pendingIdeas.length} queued
          </span>
          {approvedIdeas.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-green-500/15 px-2.5 py-0.5 text-xs font-medium text-green-600 dark:text-green-400">
              {approvedIdeas.length} approved
            </span>
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
          {[...approvedIdeas, ...pendingIdeas].map((idea) => {
            const isExpanded = expandedId === idea.id;
            const isUpdating = updatingId === idea.id;
            const isApproved = idea.status === "approved";
            const isPosted = postedId === idea.id;
            const hasImage = !!ideaImages[idea.id];
            const isGeneratingImage = generatingImageId === idea.id;

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
                  {/* IG Approved: 3-column layout */}
                  {isApproved && isInstagram ? (
                    <>
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
                        {!isPosted && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                            <Check className="h-3 w-3" />
                            Ready to post
                          </span>
                        )}
                        {isPosted && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
                            <Check className="h-3 w-3" />
                            Scheduled!
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {/* LEFT COLUMN: copy */}
                        <div className="min-w-0">
                          <p className="text-sm font-medium leading-snug">{idea.hook}</p>
                          <div className="mt-2">
                            {editingId === idea.id ? (
                              <div className="space-y-2">
                                <textarea
                                  ref={editTextareaRef}
                                  value={editBody}
                                  onChange={(e) => setEditBody(e.target.value)}
                                  className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-green-500/40 resize-y"
                                  rows={5}
                                />
                                <div className="flex items-center justify-between">
                                  {charLimit && (
                                    <span className={`text-[10px] ${editBody.length > charLimit ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                                      {charLimit - editBody.length} chars remaining
                                    </span>
                                  )}
                                  <div className="flex gap-1.5 ml-auto">
                                    <Button size="sm" variant="ghost" className="h-7 text-xs text-muted-foreground" onClick={cancelEditing} disabled={savingEdit}>
                                      Cancel
                                    </Button>
                                    <Button size="sm" className="h-7 text-xs" onClick={() => saveEdit(idea.id)} disabled={savingEdit || !editBody.trim() || (!!charLimit && editBody.length > charLimit)}>
                                      {savingEdit ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="text-xs text-muted-foreground/80 whitespace-pre-line">
                                  {isExpanded
                                    ? idea.body
                                    : idea.body.length > 100
                                      ? idea.body.slice(0, 100) + "…"
                                      : idea.body}
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                  {idea.body.length > 100 && (
                                    <button
                                      type="button"
                                      onClick={() => setExpandedId(isExpanded ? null : idea.id)}
                                      className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                      {isExpanded ? <>less <ChevronUp className="h-3 w-3" /></> : <>more <ChevronDown className="h-3 w-3" /></>}
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => startEditing(idea)}
                                    className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    <Pencil className="h-3 w-3" />
                                    Edit
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        {/* CENTER COLUMN: image */}
                        <div className="flex items-start justify-center">
                          {hasImage ? (
                            <button
                              type="button"
                              onClick={() => setExpandedImage(ideaImages[idea.id])}
                              className="overflow-hidden rounded-md border cursor-pointer hover:opacity-90 transition-opacity w-1/2"
                            >
                              <Image
                                src={ideaImages[idea.id]}
                                alt="Generated Instagram image"
                                width={540}
                                height={675}
                                className="w-full"
                                style={{ aspectRatio: "1080/1350" }}
                                unoptimized
                              />
                            </button>
                          ) : isGeneratingImage ? (
                            <div className="flex w-1/2 flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 p-6" style={{ aspectRatio: "1080/1350" }}>
                              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                              <span className="mt-2 text-xs text-muted-foreground">Generating image…</span>
                            </div>
                          ) : (
                            <div className="flex w-1/2 flex-col items-center justify-center rounded-md border border-dashed border-muted-foreground/25 bg-muted/20 p-6" style={{ aspectRatio: "1080/1350" }}>
                              <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                              <span className="mt-2 text-[10px] text-muted-foreground/50">No image yet</span>
                            </div>
                          )}
                          {imageError && generatingImageId === null && !hasImage && (
                            <p className="mt-2 text-xs text-destructive">{imageError}</p>
                          )}
                        </div>

                        {/* RIGHT COLUMN: buttons + feedback */}
                        <div className="flex flex-col gap-2">
                          {!hasImage ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateImage(idea, imagePromptFeedback[idea.id])}
                              disabled={isGeneratingImage || postingId === idea.id}
                              className="w-full h-8 gap-1.5"
                            >
                              {isGeneratingImage ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImageIcon className="h-3.5 w-3.5" />}
                              {isGeneratingImage ? "Generating…" : "Generate Image"}
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateImage(idea, imagePromptFeedback[idea.id])}
                              disabled={isGeneratingImage || postingId === idea.id}
                              className="w-full h-8 gap-1.5"
                            >
                              {isGeneratingImage ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
                              Regenerate
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => handlePostIdea(idea)}
                            disabled={postingId === idea.id || isPosted || isGeneratingImage || !hasImage}
                            className="w-full h-8 gap-1.5"
                            title={!hasImage ? "Generate an image first" : undefined}
                          >
                            {postingId === idea.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                            {postingId === idea.id ? "Scheduling..." : "Schedule"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 text-muted-foreground w-full"
                            onClick={() => handleUpdateStatus(idea.id, "dismissed")}
                            disabled={isUpdating}
                            title="Dismiss idea"
                          >
                            <X className="h-3.5 w-3.5" />
                            Dismiss
                          </Button>

                          {/* Image feedback textarea */}
                          <div className="mt-1">
                            <label className="text-[10px] font-medium text-muted-foreground">Image feedback</label>
                            <textarea
                              value={imagePromptFeedback[idea.id] || ""}
                              onChange={(e) => setImagePromptFeedback((prev) => ({ ...prev, [idea.id]: e.target.value }))}
                              placeholder="e.g. warmer tones, more natural light, less furniture…"
                              rows={3}
                              className="mt-1 w-full rounded-md border border-foreground/15 bg-background px-2.5 py-1.5 text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-green-500/40 resize-y"
                            />
                          </div>
                        </div>
                      </div>
                      {postError && postingId === null && (
                        <p className="text-xs text-destructive mt-2">{postError}</p>
                      )}
                    </>
                  ) : (
                  /* Non-IG or non-approved: original layout */
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
                            Scheduled!
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-medium leading-snug">{idea.hook}</p>
                      <div className="mt-2">
                        {editingId === idea.id ? (
                          <div className="space-y-2">
                            <textarea
                              ref={editTextareaRef}
                              value={editBody}
                              onChange={(e) => setEditBody(e.target.value)}
                              className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-xs leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-green-500/40 resize-y"
                              rows={5}
                            />
                            <div className="flex items-center justify-between">
                              {charLimit && (
                                <span className={`text-[10px] ${editBody.length > charLimit ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                                  {charLimit - editBody.length} chars remaining
                                </span>
                              )}
                              <div className="flex gap-1.5 ml-auto">
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
                                  disabled={savingEdit || !editBody.trim() || (!!charLimit && editBody.length > charLimit)}
                                >
                                  {savingEdit ? <Loader2 className="h-3 w-3 animate-spin" /> : "Save"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs text-muted-foreground/80 whitespace-pre-line">
                              {isExpanded
                                ? idea.body
                                : idea.body.length > 100
                                  ? idea.body.slice(0, 100) + "…"
                                  : idea.body}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              {idea.body.length > 100 && (
                                <button
                                  type="button"
                                  onClick={() => setExpandedId(isExpanded ? null : idea.id)}
                                  className="inline-flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  {isExpanded ? (
                                    <>less <ChevronUp className="h-3 w-3" /></>
                                  ) : (
                                    <>more <ChevronDown className="h-3 w-3" /></>
                                  )}
                                </button>
                              )}
                              {isApproved && (
                                <button
                                  type="button"
                                  onClick={() => startEditing(idea)}
                                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Pencil className="h-3 w-3" />
                                  Edit
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {isApproved ? (
                      <div className="flex shrink-0 flex-col gap-1.5">
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => handlePostIdea(idea)}
                            disabled={postingId === idea.id || isPosted || isGeneratingImage}
                            className="h-8 gap-1.5"
                          >
                            {postingId === idea.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Send className="h-3.5 w-3.5" />
                            )}
                            {postingId === idea.id ? "Scheduling..." : "Schedule"}
                          </Button>
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
                  )}
                  {!(isApproved && isInstagram) && postError && postingId === null && (
                    <p className="text-xs text-destructive mt-2">{postError}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lightbox modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setExpandedImage(null)}
        >
          <button
            type="button"
            onClick={() => setExpandedImage(null)}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <img
            src={expandedImage}
            alt="Expanded Instagram image"
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
