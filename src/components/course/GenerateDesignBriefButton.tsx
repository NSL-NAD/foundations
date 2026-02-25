"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Loader2, Lock } from "lucide-react";
import { DesignBriefWizard } from "@/components/account/DesignBriefWizard";

/**
 * Self-contained button for embedding the Design Brief Wizard.
 *
 * variant="card"   — Bold card for MDX lesson content (default)
 * variant="button"  — Compact pill button for the Notebook header
 */
export function GenerateDesignBriefButton({
  variant = "card",
}: {
  variant?: "card" | "button";
}) {
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("Student");
  const [notebookEntryCount, setNotebookEntryCount] = useState(0);
  const [uploadCount, setUploadCount] = useState(0);
  const [module6Complete, setModule6Complete] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        // Check Module 6 completion first
        const progressRes = await fetch("/api/user/progress");
        if (progressRes.ok) {
          const progressData = await progressRes.json();
          setModule6Complete(progressData.module6Complete);
        }

        // Fetch notebook entries count (notes with actual content)
        const notesRes = await fetch("/api/notebook/all");
        if (notesRes.ok) {
          const notesData = await notesRes.json();
          const notes = (notesData.notes || []).filter(
            (n: { content?: string }) =>
              n.content && n.content.replace(/<[^>]*>/g, "").trim().length > 0
          );
          setNotebookEntryCount(notes.length);
        }

        // Fetch uploaded files count
        const filesRes = await fetch("/api/notebook/files");
        if (filesRes.ok) {
          const filesData = await filesRes.json();
          setUploadCount((filesData.files || []).length);
        }

        // Fetch profile name from account data
        const accountRes = await fetch("/api/user/purchases");
        if (accountRes.ok) {
          const accountData = await accountRes.json();
          if (accountData.name) {
            setStudentName(accountData.name);
          }
        }
      } catch {
        // Fail silently — wizard will work with defaults
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const totalContent = notebookEntryCount + uploadCount;

  /* -------------------------------------------------- */
  /* Compact pill button for notebook header             */
  /* -------------------------------------------------- */
  if (variant === "button") {
    if (loading) return null; // Don't show a loader in the header
    if (!module6Complete) return null; // Hide until Module 6 is complete

    return (
      <DesignBriefWizard
        studentName={studentName}
        notebookEntryCount={notebookEntryCount}
        uploadCount={uploadCount}
        existingBriefDate={null}
        triggerClassName="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors hover:bg-foreground hover:text-background"
        triggerLabel="Generate Brief"
      />
    );
  }

  /* -------------------------------------------------- */
  /* Bold card for MDX lesson content (default)          */
  /* -------------------------------------------------- */
  if (loading) {
    return (
      <div className="not-prose flex items-center justify-center rounded-card border border-foreground/10 bg-card p-6">
        <Loader2 className="mr-2 h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  // Module 6 not complete — show locked message
  if (!module6Complete) {
    return (
      <div className="not-prose flex items-center gap-3 rounded-card border border-foreground/10 bg-card p-6">
        <Lock className="h-5 w-5 shrink-0 text-muted-foreground/50" />
        <div>
          <p className="font-heading text-sm font-semibold uppercase">
            Design Brief Locked
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Complete Module 6: Portfolio Project to unlock your personalized Design Brief.
          </p>
        </div>
      </div>
    );
  }

  // Build description text based on what the student has
  let description: string;
  if (totalContent > 0) {
    const parts: string[] = [];
    if (notebookEntryCount > 0) {
      parts.push(
        `${notebookEntryCount} notebook ${notebookEntryCount === 1 ? "entry" : "entries"}`
      );
    }
    if (uploadCount > 0) {
      parts.push(
        `${uploadCount} ${uploadCount === 1 ? "upload" : "uploads"}`
      );
    }
    description = `${parts.join(" and ")} found. Your personalized Design Brief is ready to generate.`;
  } else {
    description =
      "Customize your palette, typography, and title, then let us compile your notes into a professional Design Brief.";
  }

  return (
    <div className="not-prose relative my-8 overflow-hidden rounded-card bg-primary p-6 text-primary-foreground">
      {/* Gradient orbs — same AI-forward palette as wizard */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#5F7F96]/35 blur-[60px]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[#B8593B]/30 blur-[55px]" />
      <div className="pointer-events-none absolute -top-8 right-8 h-48 w-48 rounded-full bg-[#C4A44E]/25 blur-[50px]" />
      <div className="pointer-events-none absolute bottom-4 left-1/3 h-56 w-56 rounded-full bg-[#6B3FA0]/15 blur-[55px]" />

      {/* Content */}
      <div className="relative">
        {/* Top row: icon left, label right */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/15">
            <ClipboardList className="h-4.5 w-4.5 text-primary-foreground" />
          </div>
          <span className="text-xs font-medium uppercase tracking-widest text-primary-foreground/60">
            Design Brief
          </span>
        </div>

        {/* Use <p> instead of <h3> to avoid .prose-lesson h3 brass border */}
        <p className="mb-1 font-heading text-lg font-semibold text-white">
          Generate Your Design Brief
        </p>
        <p className="mb-5 max-w-md text-sm text-primary-foreground/70">
          {description}
        </p>

        {/* Wizard trigger — brass hover */}
        <DesignBriefWizard
          studentName={studentName}
          notebookEntryCount={notebookEntryCount}
          uploadCount={uploadCount}
          existingBriefDate={null}
          triggerClassName="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 bg-primary-foreground px-6 py-2.5 text-xs font-medium uppercase tracking-wider text-primary transition-colors hover:border-[#C4A44E] hover:bg-[#C4A44E] hover:text-white"
        />
      </div>
    </div>
  );
}
