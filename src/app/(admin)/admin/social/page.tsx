import { createClient } from "@/lib/supabase/server";
import { getPublishedPosts } from "@/lib/blog";
import { ShareActions } from "@/components/admin/ShareActions";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata = {
  title: "Blog Social | Admin",
};

interface SocialShare {
  blog_slug: string;
  platform: "linkedin" | "x" | "instagram";
  generated_copy: string | null;
  shared_at: string | null;
}

export default async function AdminSocialPage() {
  const posts = getPublishedPosts();
  const supabase = createClient();

  const { data: shares } = await supabase
    .from("social_shares")
    .select("blog_slug, platform, generated_copy, shared_at");

  // Build a lookup map: slug -> { linkedin, x, instagram }
  const shareMap = new Map<
    string,
    Record<string, SocialShare>
  >();

  for (const share of (shares || []) as SocialShare[]) {
    const existing = shareMap.get(share.blog_slug) || {};
    existing[share.platform] = share;
    shareMap.set(share.blog_slug, existing);
  }

  // Count pending shares
  const pendingCount = posts.reduce((count, post) => {
    const postShares = shareMap.get(post.slug) || {};
    const sharedPlatforms = ["linkedin", "x", "instagram"].filter(
      (p) => postShares[p]?.shared_at
    );
    return count + (sharedPlatforms.length < 3 ? 1 : 0);
  }, 0);

  return (
    <div className="p-6 md:p-10">
      <div className="mb-10">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-tight md:text-3xl">
          Blog Social
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {pendingCount > 0
            ? `${pendingCount} blog${pendingCount > 1 ? "s" : ""} with pending shares`
            : "All blogs shared to all platforms"}
        </p>
      </div>

      <div className="rounded-card border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Blog Post
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider">
                Date
              </TableHead>
              <TableHead className="text-center text-xs font-medium uppercase tracking-wider">
                LinkedIn
              </TableHead>
              <TableHead className="text-center text-xs font-medium uppercase tracking-wider">
                X
              </TableHead>
              <TableHead className="text-center text-xs font-medium uppercase tracking-wider">
                Instagram
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => {
              const postShares = shareMap.get(post.slug) || {};
              const blogUrl = `https://foacourse.com/blog/${post.slug}`;

              return (
                <TableRow key={post.slug}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm leading-tight">
                        {post.title}
                      </p>
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        {post.pillar || post.category}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(post.date), "MMM d, yyyy")}
                  </TableCell>
                  {(["linkedin", "x", "instagram"] as const).map((platform) => {
                    const share = postShares[platform];
                    return (
                      <TableCell key={platform} className="text-center">
                        <div className="flex justify-center">
                          <ShareActions
                            blogSlug={post.slug}
                            blogTitle={post.title}
                            blogUrl={blogUrl}
                            coverImage={post.coverImage}
                            platform={platform}
                            existingCopy={share?.generated_copy || null}
                            sharedAt={share?.shared_at || null}
                          />
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
            {posts.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-sm text-muted-foreground py-8"
                >
                  No published blog posts yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
