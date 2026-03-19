const test = require('node:test');
const assert = require('node:assert/strict');

function formatCurrency(cents) {
  return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(cents / 100);
}

function truncate(text, size = 120) {
  if (text.length <= size) return text;
  return `${text.slice(0, size - 1)}…`;
}

test('formats cents to AUD currency', () => {
  assert.match(formatCurrency(5900), /59\.00/);
});

test('truncates strings safely', () => {
  assert.equal(truncate('abcdefghijklmnopqrstuvwxyz', 10), 'abcdefghi…');
});
