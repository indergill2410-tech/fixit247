import { NextResponse } from 'next/server';
import { Role, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import { addMonths } from 'date-fns';
import { createSession, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getAllowanceForPlan } from '@/lib/plans';
import { registerSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid registration payload.' }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: 'An account with that email already exists.' }, { status: 409 });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role as Role,
      homeownerProfile:
        parsed.data.role === 'HOMEOWNER'
          ? {
              create: {
                repeatCustomerCode: `FIX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
              }
            }
          : undefined,
      tradieProfile:
        parsed.data.role === 'TRADIE'
          ? {
              create: {
                businessName: `${parsed.data.fullName} Trades`,
                abn: '12 345 678 901',
                bio: 'Fully insured local tradie ready for urgent and planned jobs.',
                serviceAreas: ['Sydney CBD', 'Inner West'],
                categories: ['Plumbing'],
                availabilityNotes: 'Available weekdays 7am-6pm, emergency after-hours by request.',
                leadCredits: {
                  create: {
                    monthlyAllowance: 10,
                    availableLeads: 10,
                    rolloverLeads: 0,
                    currentPeriodEnd: addMonths(new Date(), 1)
                  }
                },
                subscription: {
                  create: {
                    plan: SubscriptionPlan.LEADS_10,
                    status: SubscriptionStatus.TRIAL,
                    currentPeriodEnd: addMonths(new Date(), 1)
                  }
                }
              }
            }
          : undefined
    },
    include: { homeownerProfile: true, tradieProfile: true }
  });


  if (user.tradieProfile) {
    const wallet = await prisma.leadWallet.findUnique({ where: { tradieProfileId: user.tradieProfile.id } });
    if (wallet) {
      await prisma.leadLedger.create({
        data: {
          walletId: wallet.id,
          type: 'MONTHLY_ALLOCATION',
          delta: getAllowanceForPlan(SubscriptionPlan.LEADS_10),
          note: 'Welcome allocation for trial tradie plan.'
        }
      });
    }
  }

  await createSession({
    userId: user.id,
    role: user.role,
    email: user.email,
    fullName: user.fullName
  });

  return NextResponse.json({
    ok: true,
    redirectTo: user.role === 'HOMEOWNER' ? '/homeowner' : '/tradie'
  });
}
