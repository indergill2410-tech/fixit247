import { addMonths } from 'date-fns';
import { NextResponse } from 'next/server';
import { SubscriptionPlan } from '@prisma/client';
import { getAllowanceForPlan, calculateRollover } from '@/lib/plans';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

function isSubscriptionPlan(value: string): value is SubscriptionPlan {
  return value in SubscriptionPlan;
}

type ProvisionLeadCycleInput = {
  tradieProfileId: string;
  plan: SubscriptionPlan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  allocationNote: string;
};

async function provisionLeadCycle(input: ProvisionLeadCycleInput) {
  await prisma.$transaction(async (tx) => {
    const wallet = await tx.leadWallet.findUnique({ where: { tradieProfileId: input.tradieProfileId } });
    const allowance = getAllowanceForPlan(input.plan);
    const remainingIncludedLeads = wallet ? Math.max(wallet.availableLeads - wallet.rolloverLeads, 0) : 0;
    const rollover = calculateRollover(input.plan, remainingIncludedLeads);
    const now = new Date();
    const periodStart = input.currentPeriodStart ?? now;
    const periodEnd = input.currentPeriodEnd ?? addMonths(periodStart, 1);

    await tx.subscription.upsert({
      where: { tradieProfileId: input.tradieProfileId },
      update: {
        plan: input.plan,
        status: 'ACTIVE',
        stripeCustomerId: input.stripeCustomerId,
        stripeSubscriptionId: input.stripeSubscriptionId,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd
      },
      create: {
        tradieProfileId: input.tradieProfileId,
        plan: input.plan,
        status: 'ACTIVE',
        stripeCustomerId: input.stripeCustomerId,
        stripeSubscriptionId: input.stripeSubscriptionId,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd
      }
    });

    const updatedWallet = await tx.leadWallet.upsert({
      where: { tradieProfileId: input.tradieProfileId },
      update: {
        monthlyAllowance: allowance,
        availableLeads: allowance + rollover,
        rolloverLeads: rollover,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd
      },
      create: {
        tradieProfileId: input.tradieProfileId,
        monthlyAllowance: allowance,
        availableLeads: allowance + rollover,
        rolloverLeads: rollover,
        currentPeriodStart: periodStart,
        currentPeriodEnd: periodEnd
      }
    });

    await tx.leadLedger.createMany({
      data: [
        { walletId: updatedWallet.id, type: 'MONTHLY_ALLOCATION', delta: allowance, note: input.allocationNote },
        ...(rollover ? [{ walletId: updatedWallet.id, type: 'ROLLOVER' as const, delta: rollover, note: 'Eligible unused included leads rolled into new period.' }] : [])
      ]
    });
  });
}

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing webhook signature or secret.' }, { status: 400 });
  }

  const body = await request.text();

  let event: ReturnType<(typeof stripe.webhooks)['constructEvent']>;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${(error as Error).message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as {
      metadata?: { tradieProfileId?: string; plan?: string };
      customer?: { toString(): string } | string | null;
      subscription?: { toString(): string } | string | null;
    };
    const tradieProfileId = session.metadata?.tradieProfileId;
    const plan = session.metadata?.plan;

    if (tradieProfileId && plan && isSubscriptionPlan(plan)) {
      await provisionLeadCycle({
        tradieProfileId,
        plan,
        stripeCustomerId: session.customer?.toString(),
        stripeSubscriptionId: session.subscription?.toString(),
        allocationNote: `Stripe checkout allocation for ${plan}.`
      });
    }
  }

  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as {
      billing_reason?: string;
      subscription?: { toString(): string } | string | null;
      customer?: { toString(): string } | string | null;
      lines?: { data?: Array<{ period?: { start?: number; end?: number } }> };
    };
    const stripeSubscriptionId = invoice.subscription?.toString();

    if (stripeSubscriptionId && invoice.billing_reason === 'subscription_cycle') {
      const subscription = await prisma.subscription.findUnique({
        where: { stripeSubscriptionId },
        select: { tradieProfileId: true, plan: true }
      });

      if (subscription) {
        const period = invoice.lines?.data?.[0]?.period;
        const periodStart = period?.start ? new Date(period.start * 1000) : new Date();
        const periodEnd = period?.end ? new Date(period.end * 1000) : addMonths(periodStart, 1);

        await provisionLeadCycle({
          tradieProfileId: subscription.tradieProfileId,
          plan: subscription.plan,
          stripeCustomerId: invoice.customer?.toString(),
          stripeSubscriptionId,
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
          allocationNote: `Stripe recurring allocation for ${subscription.plan}.`
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
