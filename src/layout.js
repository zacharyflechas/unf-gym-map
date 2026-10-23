/**
 * Small helpers for drawing layout items. The data itself lives in src/data/ (see levels.js).
 */

/** "x y width height" for an SVG viewBox, from a { x, y, width, height } box in feet. */
export const viewBoxOf = (v) => `${v.x} ${v.y} ${v.width} ${v.height}`;

/** SVG transform that puts an item's own (0,0) at its center and turns it. */
export const itemTransform = (item) => `translate(${item.x} ${item.y}) rotate(${item.rotation})`;

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
  return Object.entries(sums).map(([zone, s]) => ({ zone, x: s.x / s.n, y: s.y / s.n, count: s.n }));
}
