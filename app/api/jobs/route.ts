import { JobStatus } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { jobSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'HOMEOWNER') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = jobSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid job payload.' }, { status: 400 });

  const homeowner = await prisma.homeownerProfile.findUnique({ where: { userId: session.userId } });
  if (!homeowner) return NextResponse.json({ error: 'Homeowner profile not found.' }, { status: 404 });

  const matches = await prisma.tradieProfile.findMany({
    where: {
      approvedAt: { not: null },
      bannedAt: null,
      categories: { has: parsed.data.category },
      serviceAreas: { has: parsed.data.suburb }
    },
    orderBy: [{ featured: 'desc' }, { fastReplyStreak: 'desc' }, { averageResponseMins: 'asc' }],
    take: 6
  });

  const job = await prisma.job.create({
    data: {
      ...parsed.data,
      homeownerProfileId: homeowner.id,
      status: matches.length ? JobStatus.QUOTING : JobStatus.OPEN,
      matchedTradieIds: matches.map((tradie) => tradie.id)
    }
  });

  if (matches.length) {
    await prisma.quoteRequest.createMany({
      data: matches.map((tradie) => ({ jobId: job.id, tradieProfileId: tradie.id }))
    });
  }

  return NextResponse.json({ ok: true, jobId: job.id });
}
