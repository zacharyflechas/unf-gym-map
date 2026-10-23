import { ZONES } from './data/gymData.js';

const zoneName = (id) => ZONES.find((z) => z.id === id)?.name ?? id;

/** Returns true if the machine matches the free-text query and the selected muscle (if any). */
export function machineMatches(machine, query, muscle) {
  const all = [...machine.muscles.primary, ...machine.muscles.secondary];
  if (muscle && !all.some((m) => m.toLowerCase() === muscle.toLowerCase())) return false;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [machine.name, machine.short, zoneName(machine.zone), ...all].join(' ').toLowerCase();
  return q.split(/\s+/).every((term) => haystack.includes(term));
}

export { zoneName };

/**
 * Does a layout item (from layout-2f.json) match the search?
 * - If it is linked to a machine (machineId), it matches whenever that machine does.
 * - Otherwise only the text search can match it (by item name or zone); a muscle filter can't,
 *   because unlinked items have no muscle info yet.
 */
export function itemMatches(item, machine, query, muscle) {
  if (machine && machineMatches(machine, query, muscle)) return true;
  if (muscle) return false;
  const q = query.trim().toLowerCase();
  const haystack = `${item.name} ${item.zone}`.toLowerCase();
  return q !== '' && q.split(/\s+/).every((term) => haystack.includes(term));
}
