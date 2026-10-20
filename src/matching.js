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
