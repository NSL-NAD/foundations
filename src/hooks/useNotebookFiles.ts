"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export interface NotebookFile {
  id: string;
  user_id: string;
  module_slug: string | null;
  lesson_slug: string | null;
  file_name: string;
  storage_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  signedUrl: string | null;
}

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_FILES_PER_LESSON = 5;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "text/csv",
  "text/html",
];

export const ACCEPTED_EXTENSIONS =
  ".jpg,.jpeg,.png,.gif,.webp,.pdf,.docx,.txt,.csv,.html";

interface UseNotebookFilesOptions {
  userId: string;
  moduleSlug: string | null;
  lessonSlug: string | null;
}

export function useNotebookFiles({
  userId,
  moduleSlug,
  lessonSlug,
}: UseNotebookFilesOptions) {
  const [files, setFiles] = useState<NotebookFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const currentKeyRef = useRef(`${moduleSlug}/${lessonSlug}`);

  const fetchFiles = useCallback(async () => {
    const key = `${moduleSlug}/${lessonSlug}`;
    currentKeyRef.current = key;

    try {
      const params = new URLSearchParams();
      if (moduleSlug) params.set("moduleSlug", moduleSlug);
      if (lessonSlug) params.set("lessonSlug", lessonSlug);

      const res = await fetch(`/api/notebook/files?${params.toString()}`);
      const data = await res.json();

      if (currentKeyRef.current === key) {
        setFiles(data.files || []);
      }
    } catch {
      if (currentKeyRef.current === key) {
        setFiles([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [moduleSlug, lessonSlug]);

  // Fetch files when lesson changes
  useEffect(() => {
    setIsLoading(true);
    fetchFiles();
  }, [fetchFiles]);

  const uploadFile = useCallback(
    async (file: File) => {
      // Validate file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error("Unsupported file type. Please upload images, PDFs, or documents.");
        return null;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error("File must be under 25MB");
        return null;
      }

      // Validate file count
      const currentCount = files.filter(
        (f) => f.module_slug === moduleSlug && f.lesson_slug === lessonSlug
      ).length;
      if (currentCount >= MAX_FILES_PER_LESSON) {
        toast.error(`Maximum ${MAX_FILES_PER_LESSON} files per lesson`);
        return null;
      }

      setIsUploading(true);
      try {
        const supabase = createClient();
        const ext = file.name.split(".").pop() || "bin";
        const folder = moduleSlug || "general";
        const storagePath = `${userId}/${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("notebook-files")
          .upload(storagePath, file);

        if (uploadError) throw uploadError;

        // Save metadata via API
        const res = await fetch("/api/notebook/files", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            moduleSlug: moduleSlug || null,
            lessonSlug: lessonSlug || null,
            fileName: file.name,
            storagePath,
            fileType: file.type,
            fileSize: file.size,
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to save file");
        }

        toast.success(`Uploaded ${file.name}`);
        await fetchFiles(); // Refresh the list to get signed URLs
        return true;
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Failed to upload file. Please try again.");
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [userId, moduleSlug, lessonSlug, files, fetchFiles]
  );

  const deleteFile = useCallback(
    async (fileId: string) => {
      try {
        const res = await fetch(`/api/notebook/files/${fileId}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Failed to delete");

        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        toast.success("File deleted");
      } catch {
        toast.error("Failed to delete file");
      }
    },
    []
  );

  return {
    files,
    isLoading,
    isUploading,
    uploadFile,
    deleteFile,
    refetch: fetchFiles,
  };
}
