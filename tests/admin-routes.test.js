const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const routeFiles = [
  'app/api/admin/tradies/[id]/approve/route.ts',
  'app/api/admin/tradies/[id]/ban/route.ts',
  'app/api/admin/tradies/[id]/adjust-leads/route.ts',
  'app/api/admin/tradies/[id]/refund/route.ts'
];

for (const file of routeFiles) {
  test(`${file} exposes a single POST handler with awaited route params`, () => {
    const source = fs.readFileSync(file, 'utf8');
    const postHandlers = source.match(/export async function POST\(/g) ?? [];

    assert.equal(postHandlers.length, 1, 'expected exactly one POST export');
    assert.match(source, /context: \{ params: Promise<\{ id: string \}> \}/);
    assert.match(source, /const \{ id \} = await context\.params;/);
    assert.doesNotMatch(source, /\{ params \}: \{ params: \{ id: string \} \}/);
  });
}
