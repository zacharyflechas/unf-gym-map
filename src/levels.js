/**
 * The floors ("levels") the map can show. Each level is two data files:
 *   - base-<level>.json   → the floor itself: outline, rooms, stairs, columns… (feet)
 *   - layout-<level>.json → where every piece of equipment sits (feet), edited with the ?edit=1 editor
 *
 * To update positions, replace a layout file (see README → "Updating the layout"). No code changes needed.
 * To add a floor, add its two files and one entry below.
 */
import base2f from './data/base-2f.json';
import layout2f from './data/layout-2f.json';
import base3f from './data/base-3f.json';
import layout3f from './data/layout-3f.json';
import { MACHINES } from './data/gymData.js';
import { normalizeLayout, validateBase, validateLayout } from './layoutSchema.js';

/** Layout errors found in dev, shown in a red bar at the top of the page. Always empty in production. */
export const LAYOUT_ERRORS = [];

function makeLevel(id, label, name, base, rawLayout) {
  // During `npm run dev`, check the files and print any problems in the browser console.
  // (In a production build import.meta.env.DEV is false, so this block is removed; `npm run build`
  // runs the same checks in scripts/validate-layout.mjs instead and stops on errors.)
  if (import.meta.env.DEV) {
    const machineIds = MACHINES.map((m) => m.id);
    const result = validateLayout(rawLayout, { machineIds, base });
    const baseResult = validateBase(base);
    const errors = [...baseResult.errors, ...result.errors];
    const warnings = [...baseResult.warnings, ...result.warnings];
    errors.forEach((e) => console.error(`[layout ${id}] ${e}`));
    if (warnings.length) console.info(`[layout ${id}] ${warnings.length} warning(s):\n  ${warnings.join('\n  ')}`);
    LAYOUT_ERRORS.push(...errors.map((e) => `${label}: ${e}`));
  }
  const { meta, items } = normalizeLayout(rawLayout);
  return { id, label, name, base, meta, items };
}

export const LEVELS = [
  makeLevel('2f', '2F', '2nd floor · Gym', base2f, layout2f),
  makeLevel('3f', '3F', '3rd floor · Track', base3f, layout3f),
];

export const DEFAULT_LEVEL = LEVELS[0];
export const levelById = (id) => LEVELS.find((l) => l.id === id) ?? DEFAULT_LEVEL;
