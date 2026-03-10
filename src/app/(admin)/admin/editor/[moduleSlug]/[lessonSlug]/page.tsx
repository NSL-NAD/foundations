import { getModule, getLesson } from "@/lib/course";
import { notFound } from "next/navigation";
import { promises as fs } from "fs";
import path from "path";
import { LessonEditor } from "@/components/admin/LessonEditor";

interface EditorPageProps {
  params: { moduleSlug: string; lessonSlug: string };
}

export async function generateMetadata({ params }: EditorPageProps) {
  const lesson = getLesson(params.moduleSlug, params.lessonSlug);
  if (!lesson) return { title: "Lesson Not Found" };
  return { title: `Edit: ${lesson.title} | Admin` };
}

export default async function EditorPage({ params }: EditorPageProps) {
  const { moduleSlug, lessonSlug } = params;

  const mod = getModule(moduleSlug);
  const lesson = getLesson(moduleSlug, lessonSlug);

  if (!mod || !lesson) {
    notFound();
  }

  // Load current MDX content from filesystem
  let initialContent = "";
  try {
    const contentPath = path.join(
      process.cwd(),
      "src",
      "content",
      "lessons",
      moduleSlug,
      `${lessonSlug}.mdx`
    );
    initialContent = await fs.readFile(contentPath, "utf-8");
  } catch {
    // File doesn't exist yet — start with empty content
  }

  return (
    <LessonEditor
      moduleSlug={moduleSlug}
      lessonSlug={lessonSlug}
      moduleTitle={mod.title}
      lessonTitle={lesson.title}
      lessonType={lesson.type}
      lessonDuration={lesson.duration}
      initialContent={initialContent}
    />
  );
}
