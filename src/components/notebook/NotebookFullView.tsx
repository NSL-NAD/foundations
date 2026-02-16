"use client";

import { useState } from "react";
import Link from "next/link";
import { NotebookEditor } from "@/components/tools/notebook/NotebookEditor";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  PenLine,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteItem {
  moduleSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  lessonPath: string;
  content: string;
  updatedAt: string;
}

interface ModuleNotes {
  slug: string;
  title: string;
  notes: NoteItem[];
}

interface NotebookFullViewProps {
  notesByModule: ModuleNotes[];
  totalNotes: number;
  userId: string;
}

export function NotebookFullView({
  notesByModule,
  totalNotes,
  userId,
}: NotebookFullViewProps) {
  // Track which modules are expanded
  const [expandedModules, setExpandedModules] = useState<Set<string>>(() => {
    // Auto-expand modules that have notes
    const withNotes = new Set<string>();
    notesByModule.forEach((m) => {
      if (m.notes.length > 0) withNotes.add(m.slug);
    });
    return withNotes;
  });

  // Track which note is being edited
  const [editingNote, setEditingNote] = useState<string | null>(null);

  const toggleModule = (slug: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const modulesWithNotes = notesByModule.filter((m) => m.notes.length > 0);
  const modulesWithoutNotes = notesByModule.filter(
    (m) => m.notes.length === 0
  );

  return (
    <div className="container max-w-3xl py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">My Notes</h1>
        <p className="mt-1 text-muted-foreground">
          {totalNotes === 0
            ? "Start taking notes in any lesson to see them here."
            : `${totalNotes} note${totalNotes !== 1 ? "s" : ""} across your course`}
        </p>
      </div>

      {/* Empty state */}
      {totalNotes === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <PenLine className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="mt-4 text-sm font-medium">No notes yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Open any lesson and click the notebook icon to start taking notes.
          </p>
          <Button asChild variant="outline" className="mt-4" size="sm">
            <Link href="/course">Go to Course</Link>
          </Button>
        </div>
      )}

      {/* Modules with notes */}
      {modulesWithNotes.length > 0 && (
        <div className="space-y-3">
          {modulesWithNotes.map((mod) => (
            <div key={mod.slug} className="rounded-lg border bg-card">
              {/* Module header */}
              <button
                onClick={() => toggleModule(mod.slug)}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  {expandedModules.has(mod.slug) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <h2 className="font-medium">{mod.title}</h2>
                    <p className="text-xs text-muted-foreground">
                      {mod.notes.length} note
                      {mod.notes.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </button>

              {/* Notes list */}
              {expandedModules.has(mod.slug) && (
                <div className="border-t">
                  {mod.notes.map((note) => {
                    const noteKey = `${note.moduleSlug}/${note.lessonSlug}`;
                    const isEditing = editingNote === noteKey;

                    return (
                      <div
                        key={noteKey}
                        className="border-b last:border-b-0"
                      >
                        {/* Note header */}
                        <div className="flex items-center justify-between px-4 py-3">
                          <button
                            onClick={() =>
                              setEditingNote(isEditing ? null : noteKey)
                            }
                            className="flex items-center gap-2 text-left text-sm hover:text-primary"
                          >
                            <PenLine className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className={cn("font-medium", isEditing && "text-primary")}>
                              {note.lessonTitle}
                            </span>
                          </button>
                          <Link
                            href={note.lessonPath}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                          >
                            Go to lesson
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>

                        {/* Expanded editor */}
                        {isEditing && (
                          <div className="border-t bg-muted/30 px-4 py-4">
                            <NotebookEditor
                              userId={userId}
                              moduleSlug={note.moduleSlug}
                              lessonSlug={note.lessonSlug}
                            />
                          </div>
                        )}

                        {/* Preview when collapsed */}
                        {!isEditing && (
                          <div
                            className="cursor-pointer px-4 pb-3 text-xs text-muted-foreground line-clamp-2"
                            onClick={() => setEditingNote(noteKey)}
                          >
                            {note.content.slice(0, 200)}
                            {note.content.length > 200 && "..."}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modules without notes */}
      {modulesWithoutNotes.length > 0 && totalNotes > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            No notes yet
          </p>
          <div className="space-y-1">
            {modulesWithoutNotes.map((mod) => (
              <div
                key={mod.slug}
                className="flex items-center gap-3 rounded-lg border border-dashed px-4 py-3 text-sm text-muted-foreground"
              >
                <PenLine className="h-3.5 w-3.5" />
                {mod.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
