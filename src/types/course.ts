export type LessonType =
  | "video"
  | "text"
  | "exercise"
  | "download"
  | "quiz"
  | "checklist";

export type LearningPath = "drawer" | "brief-builder" | "both";

export interface Lesson {
  slug: string;
  title: string;
  type: LessonType;
  duration?: string;
  videoId?: string;
  downloads?: string[];
  paths: LearningPath[];
  order: number;
}

export interface Module {
  slug: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  order: number;
}

export interface Curriculum {
  title: string;
  modules: Module[];
}

export interface LessonNavigation {
  previous: { moduleSlug: string; lessonSlug: string; title: string } | null;
  next: { moduleSlug: string; lessonSlug: string; title: string } | null;
}
