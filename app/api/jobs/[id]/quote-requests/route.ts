import { PLATFORM_SERVICE_FEE_BPS } from '@/lib/constants';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { quoteSchema } from '@/lib/validation';
import { NextResponse } from 'next/server';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session || session.role !== 'TRADIE') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid quote payload.' }, { status: 400 });

  const tradie = await prisma.tradieProfile.findUnique({ where: { userId: session.userId }, include: { leadCredits: true } });
  if (!tradie || !tradie.leadCredits) return NextResponse.json({ error: 'Tradie profile not found.' }, { status: 404 });

  const quoteRequest = await prisma.quoteRequest.findUnique({ where: { jobId_tradieProfileId: { jobId: params.id, tradieProfileId: tradie.id } } });
  if (!quoteRequest) return NextResponse.json({ error: 'Lead request not found.' }, { status: 404 });

  if (!quoteRequest.leadConsumed) {
    if (tradie.leadCredits.availableLeads <= 0) {
      return NextResponse.json({ error: 'No lead credits available. Upgrade your subscription or wait for the next billing cycle.' }, { status: 402 });
    }

    await prisma.lead.create({
      data: {
        tradieProfileId: tradie.id,
        jobId: params.id,
        priceAmount: 590
      }
    });

    await prisma.leadWallet.update({
      where: { id: tradie.leadCredits.id },
      data: { availableLeads: { decrement: 1 } }
    });

    await prisma.leadLedger.create({
      data: {
        walletId: tradie.leadCredits.id,
        type: 'CONSUMED',
        delta: -1,
        note: `Lead consumed to unlock job ${params.id}.`
      }
    });

    await prisma.quoteRequest.update({ where: { id: quoteRequest.id }, data: { leadConsumed: true } });
  }

  const serviceFeeAmount = Math.round(parsed.data.subtotalAmount * (PLATFORM_SERVICE_FEE_BPS / 10000));
  const totalAmount = parsed.data.subtotalAmount + serviceFeeAmount;

  const quote = await prisma.quote.create({
    data: {
      jobId: id,
      jobId: params.id,
      tradieProfileId: tradie.id,
      tradieUserId: session.userId,
      title: parsed.data.title,
      scope: parsed.data.scope,
      lineItemsJson: parsed.data.lineItems,
      subtotalAmount: parsed.data.subtotalAmount * 100,
      serviceFeeAmount: serviceFeeAmount * 100,
      totalAmount: totalAmount * 100,
      estimatedDuration: parsed.data.estimatedDuration,
      estimatedStart: parsed.data.estimatedStart ? new Date(parsed.data.estimatedStart) : null
    }
  });

  await prisma.quoteRequest.update({ where: { id: quoteRequest.id }, data: { status: 'SUBMITTED' } });
  await prisma.job.update({ where: { id: id }, data: { status: 'QUOTING' } });
  await prisma.job.update({ where: { id: params.id }, data: { status: 'QUOTING' } });

  return NextResponse.json({ ok: true, quoteId: quote.id });
}
