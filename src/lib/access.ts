/**
 * Course access tier system.
 *
 * - 'full'  — user has purchased the course or bundle
 * - 'trial' — user signed up but has not purchased (Welcome module only)
 * - null    — no access
 */

export type AccessTier = "full" | "trial" | null;

/** Module slugs available to trial users */
export const TRIAL_MODULE_SLUGS = new Set(["welcome"]);

/** Check whether a module is accessible for a given tier */
export function isModuleAccessible(
  moduleSlug: string,
  tier: AccessTier
): boolean {
  if (tier === "full") return true;
  if (tier === "trial") return TRIAL_MODULE_SLUGS.has(moduleSlug);
  return false;
}

/** Check whether a lesson (by its module) is accessible for a given tier */
export function isLessonAccessible(
  moduleSlug: string,
  tier: AccessTier
): boolean {
  return isModuleAccessible(moduleSlug, tier);
}
