"use client";

import { useRef } from "react";
import {
  useNotebookFiles,
  ACCEPTED_EXTENSIONS,
  type NotebookFile,
} from "@/hooks/useNotebookFiles";
import { Upload, Loader2, X, FileText, Image as ImageIcon } from "lucide-react";

interface NotebookFileUploadProps {
  userId: string;
  moduleSlug: string | null;
  lessonSlug: string | null;
  /** Compact layout for side panel (default) vs expanded for full page */
  compact?: boolean;
}

export function NotebookFileUpload({
  userId,
  moduleSlug,
  lessonSlug,
  compact = true,
}: NotebookFileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { files, isLoading, isUploading, uploadFile, deleteFile } =
    useNotebookFiles({ userId, moduleSlug, lessonSlug });

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    for (const file of selected) {
      await uploadFile(file);
    }
    // Reset input so the same file can be re-selected
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload button — pill style matching "View All Notes" */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
      >
        {isUploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Upload className="h-3.5 w-3.5" />
        )}
        Upload Files
      </button>

      {/* Uploaded files grid */}
      {!isLoading && files.length > 0 && (
        <div
          className={
            compact
              ? "mt-3 grid grid-cols-3 gap-2"
              : "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
          }
        >
          {files.map((file) => (
            <FileThumb
              key={file.id}
              file={file}
              compact={compact}
              onDelete={() => deleteFile(file.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Upload button only — no file grid. Used inline (e.g. in button rows). */
export function NotebookUploadButton({
  userId,
  moduleSlug,
  lessonSlug,
}: {
  userId: string;
  moduleSlug: string | null;
  lessonSlug: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isUploading, uploadFile } = useNotebookFiles({
    userId,
    moduleSlug,
    lessonSlug,
  });

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    for (const file of selected) {
      await uploadFile(file);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS}
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-foreground hover:text-background disabled:opacity-50"
      >
        {isUploading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Upload className="h-3.5 w-3.5" />
        )}
        Upload Files
      </button>
    </>
  );
}

function FileThumb({
  file,
  compact,
  onDelete,
}: {
  file: NotebookFile;
  compact: boolean;
  onDelete: () => void;
}) {
  const isImage = file.file_type.startsWith("image/");
  const size = compact ? "h-20 w-full" : "h-28 w-full";

  return (
    <div className="group relative">
      <div
        className={`${size} overflow-hidden rounded-md border bg-muted/30`}
      >
        {isImage && file.signedUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={file.signedUrl}
            alt={file.file_name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1 p-2">
            {file.file_type === "application/pdf" ? (
              <FileText className="h-6 w-6 text-red-400" />
            ) : file.file_type.includes("wordprocessingml") ? (
              <FileText className="h-6 w-6 text-blue-400" />
            ) : (
              <ImageIcon className="h-6 w-6 text-muted-foreground" />
            )}
            <span className="max-w-full truncate text-[10px] text-muted-foreground">
              {file.file_name}
            </span>
          </div>
        )}
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={onDelete}
        className="absolute -right-1 -top-1 rounded-full bg-background/90 p-0.5 shadow opacity-0 transition-opacity group-hover:opacity-100"
      >
        <X className="h-3 w-3 text-muted-foreground" />
      </button>

      {/* Filename tooltip on hover */}
      {compact && (
        <p className="mt-0.5 max-w-full truncate text-[10px] text-muted-foreground">
          {file.file_name}
        </p>
      )}
    </div>
  );
}
