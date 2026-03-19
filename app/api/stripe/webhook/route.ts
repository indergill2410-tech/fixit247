import { addMonths } from 'date-fns';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { SubscriptionPlan } from '@prisma/client';
import { getAllowanceForPlan, calculateRollover } from '@/lib/plans';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const body = await request.text();

  let event: any;
  try {
    event = stripe.webhooks.constructEvent(body, signature || '', process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder');
  } catch (error) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${(error as Error).message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;
    const tradieProfileId = session.metadata?.tradieProfileId;
    const plan = session.metadata?.plan as SubscriptionPlan | undefined;
    if (tradieProfileId && plan) {
      const wallet = await prisma.leadWallet.findUnique({ where: { tradieProfileId } });
      const allowance = getAllowanceForPlan(plan);
      const rollover = wallet ? calculateRollover(plan, wallet.availableLeads) : 0;
      const nextEnd = addMonths(new Date(), 1);

      await prisma.subscription.upsert({
        where: { tradieProfileId },
        update: {
          plan,
          status: 'ACTIVE',
          stripeCustomerId: session.customer?.toString(),
          stripeSubscriptionId: session.subscription?.toString(),
          currentPeriodStart: new Date(),
          currentPeriodEnd: nextEnd
        },
        create: {
          tradieProfileId,
          plan,
          status: 'ACTIVE',
          stripeCustomerId: session.customer?.toString(),
          stripeSubscriptionId: session.subscription?.toString(),
          currentPeriodEnd: nextEnd
        }
      });

      const updatedWallet = await prisma.leadWallet.upsert({
        where: { tradieProfileId },
        update: {
          monthlyAllowance: allowance,
          availableLeads: allowance + rollover,
          rolloverLeads: rollover,
          currentPeriodStart: new Date(),
          currentPeriodEnd: nextEnd
        },
        create: {
          tradieProfileId,
          monthlyAllowance: allowance,
          availableLeads: allowance + rollover,
          rolloverLeads: rollover,
          currentPeriodEnd: nextEnd
        }
      });

      await prisma.leadLedger.createMany({
        data: [
          { walletId: updatedWallet.id, type: 'MONTHLY_ALLOCATION', delta: allowance, note: `Stripe renewal allocation for ${plan}.` },
          ...(rollover ? [{ walletId: updatedWallet.id, type: 'ROLLOVER' as const, delta: rollover, note: 'Eligible unused leads rolled into new period.' }] : [])
        ]
      });
    }
  }

  return NextResponse.json({ received: true });
}
