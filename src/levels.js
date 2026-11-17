/**
 * The floor the map shows (2nd floor only). It is two data files:
 *   - base-2f.json   → the floor itself: outline, rooms, stairs, columns… (feet)
 *   - layout-2f.json → where every piece of equipment sits (feet), edited with the ?edit=1 editor
 *
 * To update positions, replace the layout file (see README → "Updating the layout"). No code changes needed.
 */
import base2f from './data/base-2f.json';
import layout2f from './data/layout-2f.json';
import { MACHINES } from './data/gymData.js';
import { normalizeLayout, validateBase, validateLayout } from './layoutSchema.js';
import { KNOWN_ZONES } from './legend.js';

/** Layout errors found in dev, shown in a red bar at the top of the page. Always empty in production. */
export const LAYOUT_ERRORS = [];

function makeLevel(id, label, title, name, base, rawLayout) {
  // During `npm run dev`, check the files and print any problems in the browser console.
  // (In a production build import.meta.env.DEV is false, so this block is removed; `npm run build`
  // runs the same checks in scripts/validate-layout.mjs instead and stops on errors.)
  if (import.meta.env.DEV) {
    const machineIds = MACHINES.map((m) => m.id);
    const result = validateLayout(rawLayout, { machineIds, base, knownZones: KNOWN_ZONES });
    const baseResult = validateBase(base);
    const errors = [...baseResult.errors, ...result.errors];
    const warnings = [...baseResult.warnings, ...result.warnings];
    errors.forEach((e) => console.error(`[layout ${id}] ${e}`));
    if (warnings.length) console.info(`[layout ${id}] ${warnings.length} warning(s):\n  ${warnings.join('\n  ')}`);
    LAYOUT_ERRORS.push(...errors.map((e) => `${label}: ${e}`));
  }
  const { meta, items } = normalizeLayout(rawLayout);
  return { id, label, title, name, base, meta, items };
}

export const LEVEL = makeLevel('2f', '2F', 'Gym', '2nd floor · Gym', base2f, layout2f);
