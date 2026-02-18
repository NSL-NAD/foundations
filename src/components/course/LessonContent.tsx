"use client";

import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Download, PlayCircle } from "lucide-react";
import type { CurriculumLesson } from "@/lib/course";
import { DrawerPath, BriefPath } from "@/components/course/PathIndicator";

const mdxComponents = {
  DrawerPath,
  BriefPath,
};

interface LessonContentProps {
  mdxSource: MDXRemoteSerializeResult | null;
  lesson: CurriculumLesson;
  moduleSlug: string;
}

export function LessonContent({ mdxSource, lesson, moduleSlug }: LessonContentProps) {
  const hasDownloads = "downloads" in lesson && Array.isArray(lesson.downloads) && lesson.downloads.length > 0;

  return (
    <div>
      {/* Video placeholder for video lessons */}
      {lesson.type === "video" && (
        <div className="mb-8 flex aspect-video items-center justify-center rounded-card bg-[#171C24] ring-1 ring-brass/20">
          <div className="text-center">
            <PlayCircle className="mx-auto h-12 w-12 text-white/50" />
            <p className="mt-2 text-sm text-white/50">
              Video content coming soon
            </p>
          </div>
        </div>
      )}

      {/* MDX Content or placeholder */}
      {mdxSource ? (
        <div className="prose-lesson">
          <MDXRemote {...mdxSource} components={mdxComponents} />
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">
            Lesson content is being prepared. Check back soon!
          </p>
        </div>
      )}

      {/* Downloads */}
      {hasDownloads && (
        <div className="mt-8 rounded-card border border-foreground/10 p-4">
          <h3 className="mb-3 text-sm font-semibold">Downloads</h3>
          <div className="space-y-2">
            {(lesson as { downloads: string[] }).downloads.map((file) => (
              <a
                key={file}
                href={`/downloads/${moduleSlug}/${file}`}
                download
                className="flex items-center gap-2 rounded-full border border-foreground/10 bg-card px-3 py-2 text-sm transition-colors hover:bg-accent"
              >
                <Download className="h-4 w-4 text-primary" />
                <span>{file}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
