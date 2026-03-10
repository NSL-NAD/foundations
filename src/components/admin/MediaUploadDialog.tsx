"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  Loader2,
  Image as ImageIcon,
  Video,
  Images,
  AlertCircle,
} from "lucide-react";

interface MediaUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleSlug: string;
  lessonSlug: string;
  uploadType: "image" | "video" | "carousel";
  onUploadComplete: (url: string, type: "image" | "video") => void;
}

const typeConfig = {
  image: {
    label: "Upload Image",
    description: "Upload an image to insert into your lesson.",
    icon: ImageIcon,
    accept: "image/jpeg,image/png,image/webp,image/gif",
    maxSize: "5MB",
  },
  video: {
    label: "Upload Video",
    description: "Upload an MP4 or WebM video file.",
    icon: Video,
    accept: "video/mp4,video/webm",
    maxSize: "100MB",
  },
  carousel: {
    label: "Upload Carousel Image",
    description:
      "Upload an image for the carousel. You can add more images by editing the MDX directly.",
    icon: Images,
    accept: "image/jpeg,image/png,image/webp,image/gif",
    maxSize: "5MB",
  },
};

export function MediaUploadDialog({
  open,
  onOpenChange,
  moduleSlug,
  lessonSlug,
  uploadType,
  onUploadComplete,
}: MediaUploadDialogProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const config = typeConfig[uploadType];
  const Icon = config.icon;

  async function handleUpload(file: File) {
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("moduleSlug", moduleSlug);
      formData.append("lessonSlug", lessonSlug);

      const res = await fetch("/api/admin/editor/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onUploadComplete(data.url, data.type);
      } else {
        const data = await res.json();
        setError(data.error || "Upload failed");
      }
    } catch {
      setError("Network error — check your connection");
    } finally {
      setUploading(false);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {config.label}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-foreground/20 hover:border-foreground/40"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Uploading...
                </p>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag & drop a file here, or click to browse
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  Max size: {config.maxSize}
                </p>
              </>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept={config.accept}
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-md border border-red-500/20 bg-red-500/5 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          {/* Browse button */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            Browse Files
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
