/**
 * Which body regions light up on the muscle diagram (components/MuscleDiagram.jsx) for a machine's
 * `muscles` from gymData.js. Plain JS so it can be tested: scripts/muscles.test.mjs.
 */

/** Muscle names in gymData.js → body regions. "Cardio" and "Mobility" have no region (shown as text). */
export const REGIONS_FOR_MUSCLE = {
  Quads: ['quads'],
  Hamstrings: ['hamstrings'],
  Glutes: ['glutes'],
  Hips: ['hips'],
  Chest: ['chest'],
  Back: ['back'],
  Lats: ['lats'],
  Shoulders: ['shoulders'],
  Arms: ['arms'],
  Core: ['core'],
};
export const ALL_REGIONS = ['shoulders', 'chest', 'core', 'arms', 'hips', 'quads', 'calves', 'back', 'lats', 'glutes', 'hamstrings'];

/**
 * region → 'primary' | 'secondary'. "Full Body" lightly fills every region; muscles that are
 * named directly still get their own level (so a squat shows quads and glutes strongest).
 */
export function muscleLevels(muscles) {
  const levels = {};
  const fullBody = muscles.primary.includes('Full Body') || muscles.secondary.includes('Full Body');
  if (fullBody) ALL_REGIONS.forEach((r) => (levels[r] = 'secondary'));
  muscles.secondary.forEach((m) => (REGIONS_FOR_MUSCLE[m] ?? []).forEach((r) => (levels[r] ??= 'secondary')));
  muscles.primary.forEach((m) => (REGIONS_FOR_MUSCLE[m] ?? []).forEach((r) => (levels[r] = 'primary')));
  return levels;
}
