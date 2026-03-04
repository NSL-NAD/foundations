import type { BlogPost } from "@/lib/blog";

interface ArticleJsonLdProps {
  post: BlogPost;
}

export function ArticleJsonLd({ post }: ArticleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.seo.ogImage.startsWith("http")
      ? post.seo.ogImage
      : `https://foacourse.com${post.seo.ogImage}`,
    datePublished: post.date,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: "FOA Course",
      url: "https://foacourse.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": post.seo.canonicalUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
