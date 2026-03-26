import { NextResponse } from 'next/server';
import { JobStatus } from '@prisma/client';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { reviewSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'HOMEOWNER') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const payload = await request.json();
  const parsed = reviewSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid review payload.' }, { status: 400 });
  }
  const { jobId, rating, headline, body } = parsed.data;

  const job = await prisma.job.findUnique({ where: { id: jobId }, include: { homeownerProfile: true, quotes: true } });
  if (!job || job.homeownerProfile.userId !== session.userId) {
    return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
  }
  if (job.status !== JobStatus.COMPLETED || !job.acceptedQuoteId) {
    return NextResponse.json({ error: 'Reviews are only allowed once a job is completed.' }, { status: 400 });
  }

  const acceptedQuote = job.quotes.find((quote) => quote.id === job.acceptedQuoteId);
  if (!acceptedQuote) {
    return NextResponse.json({ error: 'Review must target the accepted tradie for this job.' }, { status: 400 });
  }

  await prisma.review.create({
    data: {
      authorUserId: session.userId,
      tradieProfileId: acceptedQuote.tradieProfileId,
      jobId,
      rating,
      headline,
      body
    }
  });

  return NextResponse.json({ ok: true });
}
