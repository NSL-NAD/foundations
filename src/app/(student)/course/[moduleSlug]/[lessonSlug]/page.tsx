import { createClient } from "@/lib/supabase/server";
import { getModule, getLesson, getLessonNavigation, getModules } from "@/lib/course";
import { notFound } from "next/navigation";
import { CoursePlayer } from "@/components/course/CoursePlayer";
import { promises as fs } from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import type { MDXRemoteSerializeResult } from "next-mdx-remote";
import remarkGfm from "remark-gfm";

// remark-gfm v3 has a type mismatch with next-mdx-remote's unified version
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const gfmPlugin = remarkGfm as any;

interface LessonPageProps {
  params: { moduleSlug: string; lessonSlug: string };
}

export async function generateMetadata({ params }: LessonPageProps) {
  const lesson = getLesson(params.moduleSlug, params.lessonSlug);
  if (!lesson) return { title: "Lesson Not Found" };

  const mod = getModule(params.moduleSlug);
  return {
    title: `${lesson.title} — ${mod?.title}`,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { moduleSlug, lessonSlug } = params;

  const mod = getModule(moduleSlug);
  const lesson = getLesson(moduleSlug, lessonSlug);

  if (!mod || !lesson) {
    notFound();
  }

  const navigation = getLessonNavigation(moduleSlug, lessonSlug);
  const modules = getModules();

  // Get user progress
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: progressRecords } = await supabase
    .from("lesson_progress")
    .select("lesson_slug, module_slug, completed")
    .eq("user_id", user!.id)
    .eq("completed", true);

  const completedLessons = new Set(
    progressRecords?.map((p) => `${p.module_slug}/${p.lesson_slug}`) || []
  );

  // Load MDX content from filesystem and serialize for client rendering
  let serializedMdx: MDXRemoteSerializeResult | null = null;
  try {
    const contentPath = path.join(
      process.cwd(),
      "src",
      "content",
      "lessons",
      moduleSlug,
      `${lessonSlug}.mdx`
    );
    const mdxContent = await fs.readFile(contentPath, "utf-8");
    if (mdxContent.trim()) {
      serializedMdx = await serialize(mdxContent, {
        mdxOptions: { remarkPlugins: [gfmPlugin] },
      });
    }
  } catch {
    // Content not yet created — show placeholder
  }

  return (
    <CoursePlayer
      moduleSlug={moduleSlug}
      lessonSlug={lessonSlug}
      lesson={lesson}
      module={mod}
      modules={modules}
      navigation={navigation}
      completedLessons={Array.from(completedLessons)}
      mdxSource={serializedMdx}
    />
  );
}
