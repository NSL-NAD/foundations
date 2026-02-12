import curriculum from "@/content/curriculum.json";
import type { LessonNavigation } from "@/types/course";

export type CurriculumModule = (typeof curriculum.modules)[number];
export type CurriculumLesson = CurriculumModule["lessons"][number];

export function getCurriculum() {
  return curriculum;
}

export function getModules(): CurriculumModule[] {
  return curriculum.modules;
}

export function getModule(moduleSlug: string): CurriculumModule | undefined {
  return curriculum.modules.find((m) => m.slug === moduleSlug);
}

export function getLesson(
  moduleSlug: string,
  lessonSlug: string
): CurriculumLesson | undefined {
  const mod = getModule(moduleSlug);
  return mod?.lessons.find((l) => l.slug === lessonSlug);
}

export function getTotalLessons(): number {
  return curriculum.modules.reduce((sum, m) => sum + m.lessons.length, 0);
}

export function getAllLessons(): Array<{
  moduleSlug: string;
  moduleTitle: string;
  lesson: CurriculumLesson;
}> {
  const lessons: Array<{
    moduleSlug: string;
    moduleTitle: string;
    lesson: CurriculumLesson;
  }> = [];

  for (const mod of curriculum.modules) {
    for (const lesson of mod.lessons) {
      lessons.push({
        moduleSlug: mod.slug,
        moduleTitle: mod.title,
        lesson,
      });
    }
  }

  return lessons;
}

export function getLessonNavigation(
  moduleSlug: string,
  lessonSlug: string
): LessonNavigation {
  const allLessons = getAllLessons();
  const currentIndex = allLessons.findIndex(
    (l) => l.moduleSlug === moduleSlug && l.lesson.slug === lessonSlug
  );

  if (currentIndex === -1) {
    return { previous: null, next: null };
  }

  const previous =
    currentIndex > 0
      ? {
          moduleSlug: allLessons[currentIndex - 1].moduleSlug,
          lessonSlug: allLessons[currentIndex - 1].lesson.slug,
          title: allLessons[currentIndex - 1].lesson.title,
        }
      : null;

  const next =
    currentIndex < allLessons.length - 1
      ? {
          moduleSlug: allLessons[currentIndex + 1].moduleSlug,
          lessonSlug: allLessons[currentIndex + 1].lesson.slug,
          title: allLessons[currentIndex + 1].lesson.title,
        }
      : null;

  return { previous, next };
}

export function getFirstLesson(): {
  moduleSlug: string;
  lessonSlug: string;
} {
  const firstModule = curriculum.modules[0];
  const firstLesson = firstModule.lessons[0];
  return {
    moduleSlug: firstModule.slug,
    lessonSlug: firstLesson.slug,
  };
}

export function getLessonPath(moduleSlug: string, lessonSlug: string): string {
  return `/course/${moduleSlug}/${lessonSlug}`;
}
