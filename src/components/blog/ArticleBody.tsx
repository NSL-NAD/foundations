"use client";

import { MDXRemote } from "next-mdx-remote";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import { mdxComponents } from "./MDXComponents";

interface ArticleBodyProps {
  source: MDXRemoteSerializeResult;
}

export function ArticleBody({ source }: ArticleBodyProps) {
  return (
    <div className="prose-blog">
      <MDXRemote {...source} components={mdxComponents} />
    </div>
  );
}
