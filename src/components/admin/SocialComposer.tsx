"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, X } from "lucide-react";

const PILLARS = ["Educate", "Inspire", "Empower", "Hook/Provoke"] as const;

const platformLabels: Record<string, string> = {
  linkedin: "LinkedIn",
  x: "X",
  instagram: "Instagram",
};

interface SocialComposerProps {
  platform: "linkedin" | "x" | "instagram";
}

export function SocialComposer({ platform }: SocialComposerProps) {
  const [expanded, setExpanded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [pillar, setPillar] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false);
  const [copy, setCopy] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"input" | "preview">("input");

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/admin/social/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          prompt: prompt.trim(),
          ...(pillar ? { pillar } : {}),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to generate");
        return;
      }
      const data = await res.json();
      setCopy(data.copy);
      if (data.imageUrl) setImageUrl(data.imageUrl);
      setPhase("preview");
    } catch {
      setError("Failed to generate copy");
    } finally {
      setGenerating(false);
    }
  }

  async function handlePost() {
    setPosting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/social/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogSlug: null, platform, copy }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to post via Buffer");
        return;
      }
      // Success — reset
      handleClear();
    } catch {
      setError("Failed to post via Buffer");
    } finally {
      setPosting(false);
    }
  }

  function handleRegenerate() {
    setPhase("input");
    setCopy("");
    setImageUrl(null);
    setError("");
  }

  function handleClear() {
    setExpanded(false);
    setPrompt("");
    setPillar(null);
    setCopy("");
    setImageUrl(null);
    setError("");
    setPhase("input");
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="mb-6 inline-flex items-center gap-2 rounded-md border border-dashed border-muted-foreground/30 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
      >
        <span>✏️</span> Create a post
      </button>
    );
  }

  return (
    <div className="mb-6 rounded-lg border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold">
          {platformLabels[platform]} Composer
        </h3>
        <button
          onClick={handleClear}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {phase === "input" && (
        <div className="space-y-4">
          {/* Pillar selector */}
          <div className="flex flex-wrap gap-2">
            {PILLARS.map((p) => (
              <button
                key={p}
                onClick={() => setPillar(pillar === p ? null : p)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                  pillar === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Prompt textarea */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What do you want to post about? Describe the topic, angle, or paste a quick note..."
            rows={3}
            className="w-full resize-none rounded-md border bg-background p-3 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
          />

          {error && <p className="text-xs text-destructive">{error}</p>}

          <Button
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            size="sm"
          >
            {generating && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
            {generating ? "Generating..." : "Generate"}
          </Button>
        </div>
      )}

      {phase === "preview" && (
        <div className="space-y-4">
          {/* Instagram image preview */}
          {platform === "instagram" && imageUrl && (
            <div className="overflow-hidden rounded-md border">
              <Image
                src={imageUrl}
                alt="Instagram image preview"
                width={1080}
                height={1350}
                className="w-full max-w-xs"
                unoptimized
              />
            </div>
          )}

          {/* Editable copy */}
          <div className="relative">
            <textarea
              value={copy}
              onChange={(e) => setCopy(e.target.value)}
              className="h-48 w-full resize-none rounded-md border bg-background p-3 text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {platform === "x" && (
              <div
                className={`absolute bottom-2 right-2 rounded px-1.5 py-0.5 text-xs font-medium ${
                  copy.length > 280
                    ? "bg-red-100 text-red-700"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {copy.length}/280
              </div>
            )}
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={handlePost}
              disabled={posting || !copy.trim()}
              size="sm"
            >
              {posting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              {posting ? "Posting..." : "Post via Buffer"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={posting}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={posting}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
