const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('package.json exposes the audit wrapper script', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['audit:prod'], 'node scripts/audit.mjs');
});

test('audit wrapper retries without proxy variables on advisory endpoint failures', () => {
  const source = read('scripts/audit.mjs');
  assert.match(source, /npm', baseArgs/);
  assert.match(source, /HTTP_PROXY/);
  assert.match(source, /npm advisory endpoint is unavailable from this environment/);
  assert.match(source, /process\.exit\(0\)/);
});


test('package.json exposes the deployment verification script', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['verify:deploy'], 'node scripts/verify-deploy.mjs');
});

test('deployment verification script runs the expected checks in order', () => {
  const source = read('scripts/verify-deploy.mjs');
  assert.match(source, /\['npm', \['test'\]\]/);
  assert.match(source, /\['npm', \['run', 'typecheck'\]\]/);
  assert.match(source, /\['npm', \['run', 'build'\]\]/);
  assert.match(source, /\['npm', \['run', 'audit:prod'\]\]/);
});


test('verify-deploy GitHub Actions workflow exists', () => {
  const source = read('.github/workflows/verify-deploy.yml');
  assert.match(source, /name: Verify deploy/);
  assert.match(source, /pull_request:/);
  assert.match(source, /run: npm run verify:deploy/);
});
