import { getPublishedPosts } from "@/lib/blog";

export async function GET() {
  const posts = getPublishedPosts();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>FOA Course Blog</title>
    <link>https://foacourse.com/blog</link>
    <description>Architecture education, dream home inspiration, and design thinking.</description>
    <language>en-us</language>
    <atom:link href="https://foacourse.com/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://foacourse.com/blog/${post.slug}</link>
      <description><![CDATA[${post.description}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">https://foacourse.com/blog/${post.slug}</guid>
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
