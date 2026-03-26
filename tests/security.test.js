const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

test('quote acceptance route requires homeowner session and ownership checks', () => {
  const source = read('app/api/quotes/[id]/accept/route.ts');
  assert.match(source, /getSession/);
  assert.match(source, /session\.role !== 'HOMEOWNER'/);
  assert.match(source, /homeownerProfile\.userId !== session\.userId/);
  assert.match(source, /updateMany\(/);
});

test('message route checks job participation before creating a message', () => {
  const source = read('app/api/messages/route.ts');
  assert.match(source, /quoteRequests\.some/);
  assert.match(source, /quotes\.some/);
  assert.match(source, /return NextResponse\.json\(\{ error: 'Forbidden' \}, \{ status: 403 \}\)/);
});

test('homeowner job detail page scopes job lookup to the signed-in homeowner', () => {
  const source = read('app/homeowner/jobs/[id]/page.tsx');
  assert.match(source, /getSession/);
  assert.match(source, /findFirst\(/);
  assert.match(source, /homeownerProfile: \{ userId: session!\.userId \}/);
});

test('auth password reset routes validate payloads with shared schemas', () => {
  const forgotSource = read('app/api/auth/forgot-password/route.ts');
  const resetSource = read('app/api/auth/reset-password/route.ts');
  const validationSource = read('lib/validation.ts');

  assert.match(forgotSource, /forgotPasswordSchema\.safeParse/);
  assert.match(resetSource, /resetPasswordSchema\.safeParse/);
  assert.match(validationSource, /export const forgotPasswordSchema/);
  assert.match(validationSource, /export const resetPasswordSchema/);
});
