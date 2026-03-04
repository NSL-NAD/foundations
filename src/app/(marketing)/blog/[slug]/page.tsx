import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getRelatedPosts,
  getAllPublishedSlugs,
  getSerializedMdx,
} from "@/lib/blog";
import dynamic from "next/dynamic";
import { ArticleJsonLd } from "@/components/blog/ArticleJsonLd";
import { ArticleHeader } from "@/components/blog/ArticleHeader";
import { ArticleSidebar } from "@/components/blog/ArticleSidebar";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { RelatedPosts } from "@/components/blog/RelatedPosts";

const ArticleBody = dynamic(
  () =>
    import("@/components/blog/ArticleBody").then((mod) => mod.ArticleBody),
  { ssr: false }
);

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const slugs = getAllPublishedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: post.seo.metaTitle,
    description: post.seo.metaDescription,
    openGraph: {
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      images: [{ url: post.seo.ogImage, width: 1200, height: 630 }],
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.metaTitle,
      description: post.seo.metaDescription,
      images: [post.seo.ogImage],
    },
    alternates: {
      canonical: post.seo.canonicalUrl,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const serializedMdx = await getSerializedMdx(post.content);
  const related = getRelatedPosts(post.slug, post.category, 3);

  const articleUrl = `https://foacourse.com/blog/${post.slug}`;

  return (
    <>
      <ArticleJsonLd post={post} />

      <article className="container py-12 md:py-16">
        <ArticleHeader post={post} />

        {/* Two-column layout: article + sidebar */}
        <div className="mt-12 flex flex-col gap-12 lg:flex-row">
          {/* Article body */}
          <div className="min-w-0 flex-1">
            <ArticleBody source={serializedMdx} />
          </div>

          {/* Sidebar — hidden on mobile, sticky on desktop */}
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24">
              <ArticleSidebar />
            </div>
          </aside>
        </div>

        {/* Share + Related */}
        <div className="mt-16 space-y-16">
          <ShareButtons url={articleUrl} title={post.title} />
          <RelatedPosts posts={related} />
        </div>
      </article>
    </>
  );
}
