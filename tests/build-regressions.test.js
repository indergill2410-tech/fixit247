const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('stripe client uses an SDK-supported API version literal', () => {
  const source = read('lib/stripe.ts');
  assert.match(source, /apiVersion:\s*'2024-11-20\.acacia'/);
});

test('register page resolves role search params on the server', () => {
  const page = read('app/auth/register/page.tsx');
  const form = read('components/forms/auth-form.tsx');

  assert.match(page, /searchParams: Promise<\{ role\?: string \}>/);
  assert.match(page, /const defaultRole = params\.role === 'TRADIE' \? 'TRADIE' : 'HOMEOWNER';/);
  assert.match(page, /<AuthForm mode="register" defaultRole=\{defaultRole\} \/>/);
  assert.doesNotMatch(form, /useSearchParams/);
  assert.match(form, /defaultRole\?: 'HOMEOWNER' \| 'TRADIE'/);
});
