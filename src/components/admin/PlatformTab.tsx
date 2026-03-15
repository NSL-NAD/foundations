import { ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IdeaQueuePlaceholder } from "./IdeaQueuePlaceholder";

/*
 * FOA Content Pillars: Educate, Inspire, Empower, Hook/Provoke, Validate (hold)
 * Platform personalities:
 * - LinkedIn: Professional, thought leader, Educate + Empower pillars
 * - X: Fast, punchy, opinionated, Hook/Provoke + Educate pillars
 * - Instagram: Visual-first, warm, Inspire + Educate + Empower pillars
 */

interface PlatformPost {
  blogTitle: string;
  sharedAt: string;
  generatedCopy: string;
}

const platformUrls: Record<string, { url: string; label: string }> = {
  linkedin: {
    url: "https://www.linkedin.com/company/foa-course/",
    label: "LinkedIn",
  },
  x: { url: "https://x.com/foacourse", label: "X" },
  instagram: {
    url: "https://www.instagram.com/foacourse/",
    label: "Instagram",
  },
};

export function PlatformTab({
  platform,
  posts,
}: {
  platform: string;
  posts: PlatformPost[];
}) {
  const platformInfo = platformUrls[platform];

  return (
    <div className="space-y-8">
      {/* Section A — Recent Posts */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Recent Posts</h2>
          <a
            href={platformInfo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Open {platformInfo.label}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No posts yet. Use the Blogs tab to publish your first post.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {posts.map((post, i) => (
              <Card key={i}>
                <CardContent className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-tight">
                      {post.blogTitle}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(new Date(post.sharedAt), "MMM d, yyyy")}
                    </p>
                    {post.generatedCopy && (
                      <p className="mt-2 text-xs text-muted-foreground/80 line-clamp-2">
                        {post.generatedCopy.slice(0, 120)}
                        {post.generatedCopy.length > 120 ? "…" : ""}
                      </p>
                    )}
                  </div>
                  <a
                    href={platformInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Section B — Idea Queue */}
      <div>
        <h2 className="font-heading mb-4 text-lg font-semibold">Idea Queue</h2>
        <IdeaQueuePlaceholder />
      </div>
    </div>
  );
}
