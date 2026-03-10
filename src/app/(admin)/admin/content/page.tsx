"use client";

import { useState } from "react";
import { getModules } from "@/lib/course";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pencil,
  FileText,
  Video,
  ListChecks,
  BookOpen,
  Plus,
  Minus,
} from "lucide-react";

const typeIcons: Record<string, typeof FileText> = {
  text: FileText,
  video: Video,
  exercise: ListChecks,
  checklist: ListChecks,
};

export default function ContentPage() {
  const modules = getModules();
  const totalLessons = modules.reduce((sum, m) => sum + m.lessons.length, 0);

  // All modules expanded by default
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(modules.map((m) => m.slug))
  );

  function toggleModule(slug: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  }

  function expandAll() {
    setExpanded(new Set(modules.map((m) => m.slug)));
  }

  function collapseAll() {
    setExpanded(new Set());
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold uppercase tracking-tight">
            Content
          </h1>
          <p className="text-sm text-muted-foreground">
            {modules.length} modules, {totalLessons} lessons
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Expand all
          </button>
          <span className="text-muted-foreground/30">|</span>
          <button
            onClick={collapseAll}
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Collapse all
          </button>
        </div>
      </div>

      {modules.map((mod) => {
        const isExpanded = expanded.has(mod.slug);
        return (
          <div key={mod.slug} className="rounded-lg border bg-card">
            {/* Module header — clickable toggle */}
            <button
              onClick={() => toggleModule(mod.slug)}
              className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-muted/50"
            >
              <BookOpen className="h-4 w-4 shrink-0 text-primary" />
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold">{mod.title}</h2>
                <p className="text-xs text-muted-foreground">
                  {mod.lessons.length} lessons
                </p>
              </div>
              {isExpanded ? (
                <Minus className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </button>

            {/* Lessons table — collapsible */}
            {isExpanded && (
              <div className="border-t">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-5 w-[45%]">Lesson</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="pr-5 text-right">Edit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mod.lessons.map((lesson) => {
                      const TypeIcon = typeIcons[lesson.type] || FileText;
                      return (
                        <TableRow key={lesson.slug}>
                          <TableCell className="pl-5">
                            <div className="flex items-center gap-2">
                              <TypeIcon className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-sm font-medium">
                                {lesson.title}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="rounded-full border border-foreground/20 px-2 py-0.5 text-[10px] capitalize text-muted-foreground">
                              {lesson.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {lesson.duration || "—"}
                          </TableCell>
                          <TableCell className="pr-5 text-right">
                            <Link
                              href={`/admin/editor/${mod.slug}/${lesson.slug}`}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              title={`Edit ${lesson.title}`}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
