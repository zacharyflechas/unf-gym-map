// Tests for the search + zone legend logic. Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { applyFilters, matchSummary } from '../src/filters.js';

const machines = [
  { id: 'half-racks', name: 'Half Racks', short: 'HR', zone: 'racks', muscles: { primary: ['Quads', 'Glutes'], secondary: [] } },
  { id: 'treadmill', name: 'Treadmills', short: 'TM', zone: 'cardio', muscles: { primary: ['Cardio'], secondary: ['Glutes'] } },
];
const items = [
  { id: 'r1', name: 'Rack r1', zone: 'Rack row (r1-r13)', machineId: 'half-racks' },
  { id: 't1', name: 'Treadmill 1', zone: 'Treadmills', machineId: 'treadmill' },
  { id: 'x1', name: 'Mystery bench', zone: 'DB racks / free weights' },
];
const run = (query, zoneId) => applyFilters({ items, machines, query, zoneId });

test('no filters: nothing is filtered, every machine listed', () => {
  const r = run('', null);
  assert.equal(r.filtering, false);
  assert.equal(r.itemIds.size, 3);
  assert.equal(r.machineList.length, 2);
});

test('search only: muscle text matches linked items', () => {
  const r = run('glutes', null);
  assert.deepEqual([...r.itemIds].sort(), ['r1', 't1']);
});

test('zone only: just that zone', () => {
  const r = run('', 'racks');
  assert.deepEqual([...r.itemIds], ['r1']);
  assert.deepEqual(r.machineList.map((m) => m.id), ['half-racks']);
});

test('search + zone combine (AND)', () => {
  const r = run('glutes', 'cardio');
  assert.deepEqual([...r.itemIds], ['t1']);
  assert.deepEqual(r.machineList.map((m) => m.id), ['treadmill']);
});

test('unlinked items match by name', () => {
  assert.deepEqual([...run('mystery', null).itemIds], ['x1']);
});

test('unknown zone names fall under Other', () => {
  const r = applyFilters({ items: [{ id: 'z', name: 'Z', zone: 'Brand new zone' }], machines, query: '', zoneId: 'other' });
  assert.deepEqual([...r.itemIds], ['z']);
});

test('summary sentence', () => {
  assert.equal(
    matchSummary({ query: 'glutes ', zoneLabel: null, machineCount: 6, itemCount: 20, totalMachines: 30 }),
    '6 machines match “glutes” · 20 on the map',
  );
  assert.equal(matchSummary({ query: '', zoneLabel: null, machineCount: 0, itemCount: 0, totalMachines: 30 }), '30 machines');
});
