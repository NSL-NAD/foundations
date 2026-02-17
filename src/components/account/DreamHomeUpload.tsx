"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface DreamHomeUploadProps {
  userId: string;
  existingSubmission: {
    image_urls: string[];
    description: string;
  } | null;
}

export function DreamHomeUpload({
  userId,
  existingSubmission,
}: DreamHomeUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  if (existingSubmission) {
    return (
      <div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {existingSubmission.image_urls.map((url, i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden rounded-card border"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Dream home ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        {existingSubmission.description && (
          <p className="mt-3 text-sm text-muted-foreground">
            {existingSubmission.description}
          </p>
        )}
        <p className="mt-2 text-xs text-muted-foreground">
          Submission received — thank you for sharing!
        </p>
      </div>
    );
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    const total = files.length + selected.length;

    if (total > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    for (const file of selected) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are accepted");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Each image must be under 10MB");
        return;
      }
    }

    const newFiles = [...files, ...selected];
    setFiles(newFiles);

    // Generate previews
    const newPreviews = [...previews];
    selected.forEach((file) => {
      newPreviews.push(URL.createObjectURL(file));
    });
    setPreviews(newPreviews);
  }

  function removeFile(index: number) {
    const newFiles = files.filter((_, i) => i !== index);
    URL.revokeObjectURL(previews[index]);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setPreviews(newPreviews);
  }

  async function handleSubmit() {
    if (files.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setUploading(true);
    try {
      const supabase = createClient();
      const imageUrls: string[] = [];

      for (const file of files) {
        const ext = file.name.split(".").pop() || "jpg";
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from("dream-home-images")
          .upload(fileName, file);

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from("dream-home-images").getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      const res = await fetch("/api/account/dream-home", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrls, description }),
      });

      if (!res.ok) throw new Error("Failed to save submission");

      toast("Dream home images submitted!");
      router.refresh();
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload images. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {previews.map((url, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-card border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Preview ${i + 1}`}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute right-1 top-1 rounded-full bg-background/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {files.length < 5 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-card border-2 border-dashed p-8 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          {files.length === 0 ? (
            <>
              <ImageIcon className="h-5 w-5" />
              Upload images of your completed home/space
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Add more images ({files.length}/5)
            </>
          )}
        </button>
      )}

      <div className="space-y-2">
        <Label htmlFor="dream-home-desc">Description (optional)</Label>
        <Textarea
          id="dream-home-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us about your space..."
          className="min-h-[60px] resize-y"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={uploading || files.length === 0}
        size="sm"
      >
        {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Submit Images
      </Button>
    </div>
  );
}
