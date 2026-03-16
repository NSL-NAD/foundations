"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, RefreshCw, X, Check, ImageIcon } from "lucide-react";

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
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [pillar, setPillar] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [posting, setPosting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copy, setCopy] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [phase, setPhase] = useState<"input" | "preview">("input");

  const isInstagram = platform === "instagram";

  async function generateImage(copyText: string) {
    setGeneratingImage(true);
    setImageError(null);
    try {
      const res = await fetch("/api/admin/social/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ copy: copyText, platform: "instagram" }),
      });
      if (!res.ok) {
        const err = await res.json();
        setImageError(err.error || "Failed to generate image");
        return;
      }
      const data = await res.json();
      setImageUrl(data.imageUrl);
    } catch {
      setImageError("Failed to generate image");
    } finally {
      setGeneratingImage(false);
    }
  }

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
      setPhase("preview");

      // Auto-trigger fal.ai image generation for Instagram
      if (isInstagram) {
        generateImage(data.copy);
      }
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
        body: JSON.stringify({
          blogSlug: null,
          platform,
          copy,
          ...(imageUrl ? { imageUrl } : {}),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to schedule");
        return;
      }
      setPosting(false);
      setSuccess(true);
      setTimeout(() => {
        handleClear();
        router.refresh();
      }, 2000);
      return;
    } catch {
      setError("Failed to schedule");
    } finally {
      setPosting(false);
    }
  }

  function handleRegenerate() {
    setPhase("input");
    setCopy("");
    setImageUrl(null);
    setImageError(null);
    setError("");
  }

  function handleClear() {
    setExpanded(false);
    setPrompt("");
    setPillar(null);
    setCopy("");
    setImageUrl(null);
    setImageError(null);
    setError("");
    setPhase("input");
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="mb-6 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
      >
        <Pencil className="h-4 w-4" /> Create a post
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
          {isInstagram && imageUrl && (
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

          {/* Instagram image loading state */}
          {isInstagram && generatingImage && (
            <div className="flex items-center gap-2 rounded-md border border-dashed p-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating image…
            </div>
          )}

          {/* Instagram image error */}
          {isInstagram && imageError && (
            <div className="flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-xs text-destructive">{imageError}</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => generateImage(copy)}
                disabled={generatingImage}
                className="h-7 gap-1.5 text-xs"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </Button>
            </div>
          )}

          {/* Instagram regenerate image button */}
          {isInstagram && imageUrl && !generatingImage && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateImage(copy)}
              className="gap-1.5"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              Regenerate Image
            </Button>
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
              disabled={posting || success || !copy.trim() || (isInstagram && !imageUrl) || generatingImage}
              size="sm"
              className={success ? "bg-green-600 hover:bg-green-600" : ""}
              title={isInstagram && !imageUrl ? "Image required for Instagram" : undefined}
            >
              {posting && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
              {success && <Check className="mr-2 h-3.5 w-3.5" />}
              {posting ? "Scheduling..." : success ? "Scheduled!" : "Schedule"}
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
