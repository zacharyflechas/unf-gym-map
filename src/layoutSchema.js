/**
 * Layout files: one shape, one checker.
 *
 * A layout file (src/data/layout-<level>.json) lists where every item sits on one floor.
 * Three shapes are accepted, so older exports keep working:
 *
 *   1. Current:  { "meta": { version, updated, source, units, floor, ... }, "items": [ ... ] }
 *   2. Stage A:  { "floor", "units", "about", ..., "items": [ ... ] }   (no meta block)
 *   3. Bare:     [ ...items ]
 *
 * normalizeLayout() turns any of them into { meta, items }. validateLayout() returns
 * human-readable { errors, warnings }. It runs in `npm run build` (prebuild), `npm run validate`
 * and in the browser console during `npm run dev`.
 */

export const STATUS_VALUES = ['guess', 'sketch', 'photo-verified', 'scan-verified'];
export const SOURCE_VALUES = ['sketch', 'photos', 'scan'];
export const FORMAT_VERSION = 1; // meta.version: bump only if the file format itself changes

const NUMBER_FIELDS = ['x', 'y', 'rotation', 'width', 'depth'];

/** Any accepted shape → { meta, items }. Never throws; validateLayout() reports problems. */
export function normalizeLayout(raw) {
  if (Array.isArray(raw)) return { meta: { version: FORMAT_VERSION, units: 'ft' }, items: raw };
  const data = raw ?? {};
  const items = Array.isArray(data.items) ? data.items : [];
  if (data.meta) return { meta: data.meta, items };
  // Stage A shape: the meta fields sit at the top level.
  const { items: _items, statusValues: _statusValues, units, ...rest } = data;
  return {
    meta: { version: FORMAT_VERSION, updated: null, source: 'sketch', units: units === 'feet' ? 'ft' : units, ...rest },
    items,
  };
}

/** Is point [x, y] inside the polygon [[x, y], ...]? (ray casting) */
export function pointInPolygon([x, y], polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/**
 * Check a layout file.
 *   raw        – the parsed JSON, any accepted shape
 *   machineIds – ids from gymData.js MACHINES (an item's machineId must be one of them)
 *   base       – the matching base-<level>.json; items outside base.outline (and base.balcony) give a warning
 *   knownZones – zone names the map legend knows (src/legend.js); other zones give a warning
 */
export function validateLayout(raw, { machineIds = [], base = null, knownZones = null } = {}) {
  const errors = [];
  const warnings = [];
  const isObject = raw !== null && typeof raw === 'object';
  if (!isObject || (!Array.isArray(raw) && !Array.isArray(raw.items))) {
    errors.push('The file must be a list of items, or an object with an "items" list.');
    return { errors, warnings };
  }
  if (!Array.isArray(raw) && !raw.meta) {
    warnings.push('No "meta" block (older Stage A file). The next Export JSON from the editor adds one.');
  }

  const { meta, items } = normalizeLayout(raw);
  if (meta.units && meta.units !== 'ft') errors.push(`meta.units is "${meta.units}"; positions must be in feet ("ft").`);
  if (meta.source && !SOURCE_VALUES.includes(meta.source)) {
    warnings.push(`meta.source is "${meta.source}"; expected one of ${SOURCE_VALUES.join(', ')}.`);
  }

  const areas = [base?.outline, base?.balcony].filter((p) => Array.isArray(p) && p.length >= 3);
  const seen = new Set();
  items.forEach((item, index) => {
    const label = item?.id ? `Item ${item.id}` : `Item #${index + 1} (no id)`;
    if (!item || typeof item !== 'object') return errors.push(`Item #${index + 1} is not an object.`);

    if (!item.id || typeof item.id !== 'string') errors.push(`${label}: missing "id".`);
    else if (seen.has(item.id)) errors.push(`${label}: duplicate id (another item already uses "${item.id}").`);
    else seen.add(item.id);

    if (!item.name || !String(item.name).trim()) errors.push(`${label}: missing "name".`);
    else if (item.name === 'New item') warnings.push(`${label}: still named "New item".`);

    if (!STATUS_VALUES.includes(item.status)) {
      errors.push(`${label}: status "${item.status}" is not one of ${STATUS_VALUES.join(', ')}.`);
    }

    for (const field of NUMBER_FIELDS) {
      if (typeof item[field] !== 'number' || !Number.isFinite(item[field])) {
        errors.push(`${label}: "${field}" must be a number (got ${JSON.stringify(item[field])}).`);
      }
    }
    if (item.width <= 0 || item.depth <= 0) errors.push(`${label}: width and depth must be bigger than 0.`);

    if (item.machineId !== undefined && !machineIds.includes(item.machineId)) {
      errors.push(`${label}: machineId "${item.machineId}" is not a machine in src/data/gymData.js.`);
    }

    if (knownZones && item.zone && !knownZones.includes(item.zone)) {
      warnings.push(`${label}: zone "${item.zone}" is not in the map legend (src/legend.js), so it shows under "Other".`);
    }

    const placed = Number.isFinite(item.x) && Number.isFinite(item.y);
    if (placed && areas.length > 0 && !areas.some((area) => pointInPolygon([item.x, item.y], area))) {
      warnings.push(`${label} ("${item.name}") is outside the floor outline at x=${item.x}, y=${item.y}.`);
    }
  });

  return { errors, warnings };
}

/**
 * Check a base map file (src/data/base-<level>.json). Only "view" and "outline" are required;
 * everything else (rooms, facilities, stairs, balcony, columns, track, openings, entrance) is optional,
 * so a base traced from a scan can start small.
 */
export function validateBase(base) {
  const errors = [];
  const warnings = [];
  const v = base?.view;
  if (!v || !['x', 'y', 'width', 'height'].every((k) => Number.isFinite(v[k]))) {
    errors.push('"view" must be { x, y, width, height } in feet.');
  }
  if (!Array.isArray(base?.outline) || base.outline.length < 3) errors.push('"outline" must be a polygon: [[x, y], ...] (3+ points).');
  if (base?.entrance && !(Number.isFinite(base.entrance.x) && Number.isFinite(base.entrance.y))) {
    errors.push('"entrance" must be null or { x, y, label? }.');
  }
  if (!base?.entrance) warnings.push('No "entrance" position yet, so the entrance label is hidden.');
  return { errors, warnings };
}
