"use client";

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
  Twitter,
  Instagram,
  Check,
  Copy,
  RefreshCw,
  Download,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface ShareActionsProps {
  blogSlug: string;
  blogTitle: string;
  blogUrl: string;
  coverImage: string;
  platform: "linkedin" | "x" | "instagram";
  existingCopy: string | null;
  sharedAt: string | null;
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
    icon: Twitter,
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
  blogUrl,
  coverImage,
  platform,
  existingCopy,
  sharedAt,
}: ShareActionsProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState(existingCopy || "");
  const [copied, setCopied] = useState(false);
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
    setLoading(true);
    setCopy("");
    try {
      // Clear cached copy first
      await fetch("/api/admin/social/mark-shared", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blogSlug, platform, clearCopy: true }),
      });

      // Re-generate fresh copy
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
      setLoading(false);
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
      const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(blogUrl)}`;
      window.open(shareUrl, "_blank");
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
        <DialogContent className="max-w-lg">
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
            {/* Generated copy */}
            <div className="relative">
              <textarea
                readOnly
                value={copy}
                className="h-48 w-full resize-none rounded-md border bg-muted/50 p-3 text-sm leading-relaxed focus:outline-none"
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
                disabled={loading}
                className="gap-1.5"
              >
                {loading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                Regenerate
              </Button>
            </div>

            {/* Mark as shared */}
            <Button
              onClick={handleMarkShared}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Check className="mr-2 h-4 w-4" />
              Mark as Shared
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
