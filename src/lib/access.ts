/**
 * Course access tier system.
 *
 * - 'full'  — user has purchased the course or bundle
 * - 'trial' — user signed up but has not purchased
 *             (Welcome module + specific teaser lessons)
 * - null    — no access
 */

export type AccessTier = "full" | "trial" | null;

/** Module slugs fully available to trial users */
export const TRIAL_MODULE_SLUGS = new Set(["welcome"]);

/**
 * Individual lessons available to trial users outside the trial modules.
 * Format: "moduleSlug/lessonSlug"
 */
export const TRIAL_LESSON_KEYS = new Set(["kickoff/workshop-intro"]);

/** Check whether a module is fully accessible for a given tier */
export function isModuleAccessible(
  moduleSlug: string,
  tier: AccessTier
): boolean {
  if (tier === "full") return true;
  if (tier === "trial") return TRIAL_MODULE_SLUGS.has(moduleSlug);
  return false;
}

/**
 * Check whether a module has at least one accessible lesson for trial users.
 * Used to decide if the module header should look partially unlocked.
 */
export function moduleHasTrialLessons(moduleSlug: string): boolean {
  return Array.from(TRIAL_LESSON_KEYS).some((key) =>
    key.startsWith(`${moduleSlug}/`)
  );
}

/** Check whether a specific lesson is accessible for a given tier */
export function isLessonAccessible(
  moduleSlug: string,
  tier: AccessTier,
  lessonSlug?: string
): boolean {
  if (tier === "full") return true;
  if (tier === "trial") {
    // Full module access
    if (TRIAL_MODULE_SLUGS.has(moduleSlug)) return true;
    // Individual lesson access
    if (lessonSlug && TRIAL_LESSON_KEYS.has(`${moduleSlug}/${lessonSlug}`))
      return true;
  }
  return false;
}
