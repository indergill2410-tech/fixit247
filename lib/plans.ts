import { SubscriptionPlan } from '@prisma/client';
import { MAX_ROLLOVER_RATIO, SUBSCRIPTION_PLANS } from '@/lib/constants';

export function getAllowanceForPlan(plan: SubscriptionPlan) {
  return SUBSCRIPTION_PLANS[plan].leads;
}

export function calculateRollover(plan: SubscriptionPlan, remainingLeads: number) {
  const allowance = getAllowanceForPlan(plan);
  return Math.min(Math.floor(allowance * MAX_ROLLOVER_RATIO), Math.max(remainingLeads, 0));
}

export function describeLeadPolicy() {
  return {
    definition:
      'A lead is consumed when a tradie claims a homeowner job and unlocks direct messaging plus quote submission for that job.',
    rollover:
      'Unused included leads roll over for one billing cycle only, capped at 50% of the next month\'s included allowance.',
    upgrade:
      'Upgrades apply immediately. The wallet is topped up to the new allowance plus any eligible rollover, minus leads already consumed this period.',
    downgrade:
      'Downgrades take effect on the next billing date. Existing active leads remain accessible, but the next cycle allowance and rollover cap use the lower tier.'
  };
}
