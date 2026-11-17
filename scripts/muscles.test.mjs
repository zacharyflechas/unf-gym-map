// Tests for the muscle diagram mapping. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { muscleLevels, REGIONS_FOR_MUSCLE } from '../src/muscleRegions.js';
import { MACHINES } from '../src/data/gymData.js';

test('primary beats secondary, Full Body fills the rest lightly', () => {
  const levels = muscleLevels({ primary: ['Quads', 'Full Body'], secondary: ['Core'] });
  assert.equal(levels.quads, 'primary');
  assert.equal(levels.core, 'secondary');
  assert.equal(levels.calves, 'secondary');
});

test('every muscle name used in gymData is known (or is Cardio / Mobility / Full Body)', () => {
  const names = new Set(MACHINES.flatMap((m) => [...m.muscles.primary, ...m.muscles.secondary]));
  for (const n of names) assert.ok(REGIONS_FOR_MUSCLE[n] || ['Cardio', 'Mobility', 'Full Body'].includes(n), n);
});
