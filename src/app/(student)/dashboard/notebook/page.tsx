import { createClient } from "@/lib/supabase/server";
import { getModules, getLessonPath, getLesson } from "@/lib/course";
import { NotebookFullView } from "@/components/notebook/NotebookFullView";

export const metadata = {
  title: "My Notebook",
};

interface NoteRecord {
  module_slug: string;
  lesson_slug: string;
  content: string;
  updated_at: string;
}

export default async function NotebookPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: notes } = await supabase
    .from("notebook_entries")
    .select("module_slug, lesson_slug, content, updated_at")
    .eq("user_id", user!.id)
    .order("module_slug")
    .order("lesson_slug");

  const modules = getModules();

  // Organize notes by module
  const notesByModule = modules.map((mod) => {
    const moduleNotes = (notes || [])
      .filter((n: NoteRecord) => n.module_slug === mod.slug && n.content?.trim())
      .map((n: NoteRecord) => {
        const lesson = getLesson(n.module_slug, n.lesson_slug);
        return {
          moduleSlug: n.module_slug,
          lessonSlug: n.lesson_slug,
          lessonTitle: lesson?.title || n.lesson_slug,
          lessonPath: getLessonPath(n.module_slug, n.lesson_slug),
          content: n.content,
          updatedAt: n.updated_at,
        };
      });

    return {
      slug: mod.slug,
      title: mod.title,
      notes: moduleNotes,
    };
  });

  const totalNotes = notesByModule.reduce(
    (sum, m) => sum + m.notes.length,
    0
  );

  return (
    <NotebookFullView
      notesByModule={notesByModule}
      totalNotes={totalNotes}
      userId={user!.id}
    />
  );
}
