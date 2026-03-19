import { SubscriptionPlan } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'TRADIE') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { plan } = await request.json();
  const selected = SUBSCRIPTION_PLANS[plan as SubscriptionPlan];
  if (!selected) return NextResponse.json({ error: 'Unknown plan.' }, { status: 400 });

  const tradie = await prisma.tradieProfile.findUnique({ where: { userId: session.userId }, include: { subscription: true, user: true } });
  if (!tradie) return NextResponse.json({ error: 'Tradie not found.' }, { status: 404 });

  const checkout = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: tradie.user.email,
    success_url: `${process.env.APP_URL}/tradie?checkout=success`,
    cancel_url: `${process.env.APP_URL}/tradie?checkout=cancelled`,
    line_items: [
      {
        price_data: {
          currency: 'aud',
          recurring: { interval: 'month' },
          product_data: { name: `Fixit247 ${selected.label}` },
          unit_amount: selected.priceAudCents
        },
        quantity: 1
      }
    ],
    metadata: { tradieProfileId: tradie.id, plan }
  });

  return NextResponse.json({ url: checkout.url });
}
