/**
 * Search + zone legend, combined. Pure functions (no React) so they are easy to test:
 * see scripts/filters.test.mjs (`npm test`).
 *
 * An item is highlighted when it passes BOTH filters that are switched on:
 *   - search text (machineMatches / itemMatches in matching.js), and
 *   - the tapped legend zone group.
 * Clearing both shows everything.
 */
import { itemMatches, machineMatches } from './matching.js';
import { legendGroupOf } from './legend.js';

export function applyFilters({ items, machines, query, zoneId }) {
  const hasQuery = query.trim() !== '';
  const filtering = hasQuery || zoneId !== null;
  const machineById = (id) => machines.find((m) => m.id === id) ?? null;

  const itemIds = new Set(
    items
      .filter((it) => zoneId === null || legendGroupOf(it).id === zoneId)
      .filter((it) => !hasQuery || itemMatches(it, machineById(it.machineId), query))
      .map((it) => it.id),
  );

  // Machines for the list: match the search, and (with a zone picked) have an item in that zone.
  const machinesInZone = new Set(items.filter((it) => itemIds.has(it.id)).map((it) => it.machineId));
  const machineList = machines
    .filter((m) => !hasQuery || machineMatches(m, query))
    .filter((m) => zoneId === null || machinesInZone.has(m.id));

  return { filtering, itemIds, machineList };
}

/** The sentence read out by screen readers (and shown under the search box). */
export function matchSummary({ query, zoneLabel, machineCount, itemCount, totalMachines }) {
  const q = query.trim();
  const machines = (n) => `${n} ${n === 1 ? 'machine' : 'machines'}`;
  const where = zoneLabel ? ` in ${zoneLabel}` : '';
  if (q) return `${machines(machineCount)} ${machineCount === 1 ? 'matches' : 'match'} “${q}”${where} · ${itemCount} on the map`;
  if (zoneLabel) return `${zoneLabel}: ${itemCount} on the map · ${machines(machineCount)}`;
  return `${machines(totalMachines)}`;
}
