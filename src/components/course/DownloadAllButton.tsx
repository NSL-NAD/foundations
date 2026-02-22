"use client";

import { useState } from "react";
import { FolderDown, Loader2 } from "lucide-react";

export function DownloadAllButton() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  async function handleDownload() {
    setIsDownloading(true);
    setError("");

    try {
      const res = await fetch("/api/downloads/all");

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error || "Download failed. Please try again.");
        return;
      }

      // Create a blob and trigger download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "foundations-of-architecture-resources.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setError("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="not-prose my-6">
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="inline-flex items-center gap-2.5 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium uppercase tracking-wider transition-colors hover:bg-foreground hover:text-background disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDownloading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FolderDown className="h-4 w-4" />
        )}
        {isDownloading ? "Preparing Download..." : "Download All Resources"}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
