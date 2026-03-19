import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'HOMEOWNER') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { jobId, tradieProfileId, rating, headline, body } = await request.json();
  if (!jobId || !tradieProfileId || !headline || !body) {
    return NextResponse.json({ error: 'Missing review fields.' }, { status: 400 });
  }

  const job = await prisma.job.findUnique({ where: { id: jobId }, include: { homeownerProfile: true } });
  if (!job || job.homeownerProfile.userId !== session.userId) {
    return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
  }

  await prisma.review.create({
    data: {
      authorUserId: session.userId,
      tradieProfileId,
      jobId,
      rating,
      headline,
      body
    }
  });

  return NextResponse.json({ ok: true });
}
