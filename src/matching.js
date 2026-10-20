import { ZONES } from './data/gymData.js';

const zoneName = (id) => ZONES.find((z) => z.id === id)?.name ?? id;

/** Does the machine match the search text? Every word must appear in its name, zone or muscles. */
export function machineMatches(machine, query) {
  const all = [...machine.muscles.primary, ...machine.muscles.secondary];
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [machine.name, machine.short, zoneName(machine.zone), ...all].join(' ').toLowerCase();
  return q.split(/\s+/).every((term) => haystack.includes(term));
}

export { zoneName };

/**
 * Does a layout item (from layout-2f.json) match the search?
 * - If it is linked to a machine (machineId), it matches whenever that machine does.
 * - Otherwise it matches by its own name or zone (it has no muscle info yet).
 */
export function itemMatches(item, machine, query) {
  if (machine && machineMatches(machine, query)) return true;
  const q = query.trim().toLowerCase();
  const haystack = `${item.name} ${item.zone}`.toLowerCase();
  return q !== '' && q.split(/\s+/).every((term) => haystack.includes(term));
}
