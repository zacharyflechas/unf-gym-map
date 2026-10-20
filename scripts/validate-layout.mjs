/**
 * Checks every src/data/layout-<level>.json against its base-<level>.json and gymData.js.
 * Runs automatically before `npm run build` (the "prebuild" script) and by hand with `npm run validate`.
 * Errors stop the build; warnings are printed but don't.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { MACHINES } from '../src/data/gymData.js';
import { validateLayout, validateBase } from '../src/layoutSchema.js';

const DATA = new URL('../src/data/', import.meta.url);
const machineIds = MACHINES.map((m) => m.id);

function readJson(name) {
  try {
    return JSON.parse(readFileSync(new URL(name, DATA), 'utf8'));
  } catch (err) {
    return { parseError: `src/data/${name} is not valid JSON: ${err.message}` };
  }
}

let errorCount = 0;
const layoutFiles = readdirSync(DATA).filter((f) => /^layout-.+\.json$/.test(f)).sort();

for (const file of layoutFiles) {
  const level = file.replace(/^layout-|\.json$/g, '');
  const baseFile = `base-${level}.json`;
  const errors = [];
  const warnings = [];

  const layout = readJson(file);
  const base = existsSync(new URL(baseFile, DATA)) ? readJson(baseFile) : null;
  if (!base) errors.push(`missing src/data/${baseFile} (every layout needs a base map).`);

  for (const data of [layout, base]) if (data?.parseError) errors.push(data.parseError);
  if (base && !base.parseError) {
    const b = validateBase(base);
    errors.push(...b.errors.map((e) => `${baseFile}: ${e}`));
    warnings.push(...b.warnings.map((w) => `${baseFile}: ${w}`));
  }
  if (!layout.parseError) {
    const r = validateLayout(layout, { machineIds, base: base?.parseError ? null : base });
    errors.push(...r.errors);
    warnings.push(...r.warnings);
  }

  const count = Array.isArray(layout) ? layout.length : layout.items?.length ?? 0;
  console.log(`\n${file}: ${count} items · ${errors.length} error(s) · ${warnings.length} warning(s)`);
  errors.forEach((e) => console.log(`  ✖ ${e}`));
  warnings.forEach((w) => console.log(`  ⚠ ${w}`));
  errorCount += errors.length;
}

if (errorCount > 0) {
  console.log(`\nLayout check failed with ${errorCount} error(s). Fix them, then run \`npm run validate\` again.\n`);
  process.exit(1);
}
console.log('\nLayout check passed.\n');
