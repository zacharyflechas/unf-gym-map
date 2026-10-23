/**
 * Layout helpers. The floor layout is DATA, not code:
 *   - src/data/base-2f.json   → walls/rooms/stairs/columns traced from the official plan (feet)
 *   - src/data/layout-2f.json → every piece of equipment (feet), edited with the dev-only ?edit=1 editor
 * Moving a machine = changing layout-2f.json. No component changes needed.
 */
import base from './data/base-2f.json';
import layout from './data/layout-2f.json';

export const BASE = base;
export const LAYOUT = layout;
export const ITEMS = layout.items;

/** The part of the base map we show, in feet. */
export const VIEW = base.view;
export const VIEW_BOX = `${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}`;

/** SVG transform that puts an item's own (0,0) at its center and turns it. */
export const itemTransform = (item) => `translate(${item.x} ${item.y}) rotate(${item.rotation})`;

/** Color group for an item type (used as a CSS class). Anything unknown is a "machine". */
const TYPE_GROUP = {
  treadmill: 'cardio',
  elliptical: 'cardio',
  stairclimber: 'cardio',
  bike: 'cardio',
  rack: 'rack',
  'db-rack': 'weights',
  bench: 'weights',
  rig: 'rig',
  desk: 'desk',
};
export const typeGroup = (type) => TYPE_GROUP[type] ?? 'machine';

/** One label per zone, placed at the average position of that zone's items. */
export function zoneLabels(items) {
  const sums = {};
  for (const it of items) {
    if (!it.zone) continue;
    const s = (sums[it.zone] ??= { x: 0, y: 0, n: 0 });
    s.x += it.x;
    s.y += it.y;
    s.n += 1;
  }
  return Object.entries(sums).map(([zone, s]) => ({ zone, x: s.x / s.n, y: s.y / s.n }));
}
