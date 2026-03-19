const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('sidebar navigation items use Next Route typing', () => {
  const source = read('components/dashboard/sidebar.tsx');
  assert.match(source, /import type \{ Route \} from 'next'/);
  assert.match(source, /href: Route/);
});

test('dynamic homeowner job links are explicitly typed as Next routes', () => {
  const dashboard = read('app/homeowner/page.tsx');
  const quotes = read('app/homeowner/quotes/page.tsx');

  assert.match(dashboard, /href=\{`\/homeowner\/jobs\/\$\{job\.id\}` as Route\}/);
  assert.match(quotes, /href=\{`\/homeowner\/jobs\/\$\{quote\.jobId\}` as Route\}/);
});

test('marketing plan signup links are explicitly typed as Next routes', () => {
  const source = read('app/(marketing)/page.tsx');
  assert.match(source, /href=\{`\/auth\/register\?role=TRADIE&plan=\$\{key\}` as Route\}/);
});
