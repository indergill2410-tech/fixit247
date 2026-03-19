const test = require('node:test');
const assert = require('node:assert/strict');

function getAllowanceForPlan(plan) {
  return { LEADS_10: 10, LEADS_20: 20, LEADS_30: 30 }[plan];
}

function calculateRollover(plan, remainingLeads) {
  const allowance = getAllowanceForPlan(plan);
  return Math.min(Math.floor(allowance * 0.5), Math.max(remainingLeads, 0));
}

test('returns correct included leads', () => {
  assert.equal(getAllowanceForPlan('LEADS_10'), 10);
  assert.equal(getAllowanceForPlan('LEADS_20'), 20);
  assert.equal(getAllowanceForPlan('LEADS_30'), 30);
});

test('caps rollover at 50% of allowance', () => {
  assert.equal(calculateRollover('LEADS_10', 20), 5);
  assert.equal(calculateRollover('LEADS_20', 7), 7);
  assert.equal(calculateRollover('LEADS_30', 20), 15);
});
