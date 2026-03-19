import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getSession();
  if (!session || session.role !== 'HOMEOWNER') {
    return NextResponse.redirect(new URL('/auth/login', process.env.APP_URL || 'http://localhost:3000'));
  }

  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      job: {
        include: {
          homeownerProfile: true,
          quotes: { select: { id: true } }
        }
      }
    }
  });

  if (!quote || quote.job.homeownerProfile.userId !== session.userId) {
    return NextResponse.redirect(new URL('/homeowner', process.env.APP_URL || 'http://localhost:3000'));
  }

  if (quote.job.acceptedQuoteId && quote.job.acceptedQuoteId !== quote.id) {
    return NextResponse.redirect(new URL(`/homeowner/jobs/${quote.jobId}`, process.env.APP_URL || 'http://localhost:3000'));
  }

  await prisma.$transaction([
    prisma.quote.update({ where: { id: quote.id }, data: { status: 'ACCEPTED' } }),
    prisma.quote.updateMany({
      where: { jobId: quote.jobId, id: { not: quote.id } },
      data: { status: 'REJECTED' }
    }),
    prisma.job.update({ where: { id: quote.jobId }, data: { acceptedQuoteId: quote.id, status: 'BOOKED' } })
  ]);

  return NextResponse.redirect(new URL(`/homeowner/jobs/${quote.jobId}`, process.env.APP_URL || 'http://localhost:3000'));
}
