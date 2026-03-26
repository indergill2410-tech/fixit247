import { addMonths } from 'date-fns';
import { NextResponse } from 'next/server';
import { SubscriptionPlan } from '@prisma/client';
import { getAllowanceForPlan, calculateRollover } from '@/lib/plans';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

function isSubscriptionPlan(value: string): value is SubscriptionPlan {
  return value in SubscriptionPlan;
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
      await prisma.$transaction(async (tx) => {
        const wallet = await tx.leadWallet.findUnique({ where: { tradieProfileId } });
        const allowance = getAllowanceForPlan(plan);
        const rollover = wallet ? calculateRollover(plan, wallet.availableLeads) : 0;
        const now = new Date();
        const nextEnd = addMonths(now, 1);

        await tx.subscription.upsert({
          where: { tradieProfileId },
          update: {
            plan,
            status: 'ACTIVE',
            stripeCustomerId: session.customer?.toString(),
            stripeSubscriptionId: session.subscription?.toString(),
            currentPeriodStart: now,
            currentPeriodEnd: nextEnd
          },
          create: {
            tradieProfileId,
            plan,
            status: 'ACTIVE',
            stripeCustomerId: session.customer?.toString(),
            stripeSubscriptionId: session.subscription?.toString(),
            currentPeriodStart: now,
            currentPeriodEnd: nextEnd
          }
        });

        const updatedWallet = await tx.leadWallet.upsert({
          where: { tradieProfileId },
          update: {
            monthlyAllowance: allowance,
            availableLeads: allowance + rollover,
            rolloverLeads: rollover,
            currentPeriodStart: now,
            currentPeriodEnd: nextEnd
          },
          create: {
            tradieProfileId,
            monthlyAllowance: allowance,
            availableLeads: allowance + rollover,
            rolloverLeads: rollover,
            currentPeriodStart: now,
            currentPeriodEnd: nextEnd
          }
        });

        await tx.leadLedger.createMany({
          data: [
            { walletId: updatedWallet.id, type: 'MONTHLY_ALLOCATION', delta: allowance, note: `Stripe renewal allocation for ${plan}.` },
            ...(rollover ? [{ walletId: updatedWallet.id, type: 'ROLLOVER' as const, delta: rollover, note: 'Eligible unused leads rolled into new period.' }] : [])
          ]
        });
      });
    }
  }

  return NextResponse.json({ received: true });
}
