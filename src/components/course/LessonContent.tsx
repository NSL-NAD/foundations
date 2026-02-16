"use client";

import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { Download, PlayCircle } from "lucide-react";
import type { CurriculumLesson } from "@/lib/course";

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
        <div className="mb-8 aspect-video rounded-lg bg-muted flex items-center justify-center">
          <div className="text-center">
            <PlayCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">
              Video content coming soon
            </p>
          </div>
        </div>
      )}

      {/* MDX Content or placeholder */}
      {mdxSource ? (
        <div className="prose max-w-none dark:prose-invert [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:tracking-tight [&_h1]:mb-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-4 [&_p]:text-muted-foreground [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mb-1 [&_li]:text-muted-foreground [&_strong]:text-foreground [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground">
          <MDXRemote {...mdxSource} />
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
        <div className="mt-8 rounded-lg border bg-secondary/30 p-4">
          <h3 className="mb-3 text-sm font-semibold">Downloads</h3>
          <div className="space-y-2">
            {(lesson as { downloads: string[] }).downloads.map((file) => (
              <a
                key={file}
                href={`/downloads/${moduleSlug}/${file}`}
                download
                className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm transition-colors hover:bg-accent"
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
