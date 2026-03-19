import { SubscriptionPlan } from '@prisma/client';

export const SUBSCRIPTION_PLANS: Record<SubscriptionPlan, { leads: number; priceAudCents: number; label: string }> = {
  LEADS_10: { leads: 10, priceAudCents: 5900, label: '10 leads / month' },
  LEADS_20: { leads: 20, priceAudCents: 8900, label: '20 leads / month' },
  LEADS_30: { leads: 30, priceAudCents: 13900, label: '30 leads / month' }
};

export const PLATFORM_SERVICE_FEE_BPS = 500;
export const MAX_ROLLOVER_RATIO = 0.5;
export const APP_NAME = 'Fixit247';
