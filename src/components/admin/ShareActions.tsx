"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Linkedin,
  Instagram,
  Check,
  Copy,
  RefreshCw,
  Download,
  ExternalLink,
  Loader2,
} from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface ShareActionsProps {
  blogSlug: string;
  blogTitle: string;
  coverImage: string;
  category: string;
  platform: "linkedin" | "x" | "instagram";
  existingCopy: string | null;
  sharedAt: string | null;
  onShared?: (blogSlug: string, platform: string, sharedAt: string) => void;
}

const platformConfig = {
  linkedin: {
    label: "LinkedIn",
    icon: Linkedin,
    color: "text-[#0077B5]",
    bgColor: "bg-[#0077B5]/10",
  },
  x: {
    label: "X",
    icon: XIcon,
    color: "text-foreground",
    bgColor: "bg-foreground/10",
  },
  instagram: {
    label: "Instagram",
    icon: Instagram,
    color: "text-[#E4405F]",
    bgColor: "bg-[#E4405F]/10",
  },
};

export function ShareActions({
  blogSlug,
  blogTitle,
  coverImage,
  category,
  platform,
  existingCopy,
  sharedAt,
  onShared,
}: ShareActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [posting, setPosting] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [copy, setCopy] = useState(existingCopy || "");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const config = platformConfig[platform];
  const Icon = config.icon;

  async function handleGenerate(regenerate = false) {
    if (copy && !regenerate) {
      setOpen(true);
      return;
    }

    setLoading(true);
    try {
      // If regenerating, we need to clear the cached copy first
      const url = regenerate
        ? "/api/admin/social/generate"
        : "/api/admin/social/generate";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          blogSlug,
          platform,
          ...(regenerate ? { regenerate: true } : {}),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCopy(data.copy);
        setOpen(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate() {
    setRegenerating(true);
    setCopy("");
    try {
      await fetch("/api/admin/social/mark-shared", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogSlug, platform, clearCopy: true }),
      });

      const res = await fetch("/api/admin/social/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogSlug, platform }),
      });

      if (res.ok) {
        const data = await res.json();
        setCopy(data.copy);
      }
    } finally {
      setRegenerating(false);
    }
  }

  async function handleMarkShared() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/social/mark-shared", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogSlug, platform }),
      });

      if (res.ok) {
        setOpen(false);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  async function handlePostToBuffer() {
    setPosting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/social/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogSlug, platform, copy }),
      });
      if (res.ok) {
        onShared?.(blogSlug, platform, new Date().toISOString());
        setOpen(false);
        router.refresh();
      } else {
        const err = await res.json();
        setError(err.error || "Failed to post via Buffer");
      }
    } finally {
      setPosting(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(copy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleOpenPlatform() {
    if (platform === "x") {
      const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(copy)}`;
      window.open(intentUrl, "_blank");
    } else if (platform === "linkedin") {
      window.open("https://www.linkedin.com/company/foa-course/", "_blank");
    } else if (platform === "instagram") {
      window.open("https://www.instagram.com/", "_blank");
    }
  }

  async function handleDownloadImage() {
    try {
      const res = await fetch(coverImage);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${blogSlug}-cover.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open image in new tab
      window.open(coverImage, "_blank");
    }
  }

  // Shared state — show checkmark
  if (sharedAt) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10">
          <Check className="h-3.5 w-3.5 text-emerald-600" />
        </div>
        <span className="text-xs text-muted-foreground">
          {new Date(sharedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Trigger button */}
      {copy ? (
        <Badge
          variant="outline"
          className="cursor-pointer gap-1 hover:bg-muted"
          onClick={() => setOpen(true)}
        >
          <Icon className={`h-3 w-3 ${config.color}`} />
          Ready
        </Badge>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2"
          onClick={() => handleGenerate()}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Icon className={`h-3.5 w-3.5 ${config.color}`} />
          )}
          <span className="text-xs">Share</span>
        </Button>
      )}

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${config.color}`} />
              {config.label} Post
            </DialogTitle>
            <DialogDescription>
              {blogTitle}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Instagram image preview */}
            {platform === "instagram" && (
              <div className="rounded-md overflow-hidden border">
                <Image
                  src={`/api/og/instagram?title=${encodeURIComponent(blogTitle)}&category=${encodeURIComponent(category)}`}
                  alt="Instagram image preview"
                  width={1080}
                  height={1350}
                  className="w-full"
                  unoptimized
                />
              </div>
            )}

            {/* Generated copy */}
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

            {/* LinkedIn note */}
            {platform === "linkedin" && (
              <p className="text-xs text-muted-foreground">
                Copy the text above, then paste it into LinkedIn — the blog link
                will already be attached.
              </p>
            )}

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "Copied" : "Copy Text"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenPlatform}
                className="gap-1.5"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open {config.label}
              </Button>

              {platform === "instagram" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadImage}
                  className="gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download Image
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerate}
                disabled={regenerating || posting}
                className="gap-1.5"
              >
                {regenerating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                Regenerate
              </Button>
            </div>

            {/* Post via Buffer */}
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
            <Button
              onClick={handlePostToBuffer}
              disabled={posting || regenerating}
              className="w-full"
            >
              {posting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {posting ? "Scheduling..." : "Schedule"}
            </Button>

            {/* Mark as manually shared */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkShared}
              disabled={loading || posting}
              className="w-full text-muted-foreground"
            >
              Mark as manually shared instead
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
