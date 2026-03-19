import { MessageSenderType } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { messageSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid message payload.' }, { status: 400 });

  const tradieProfile =
    session.role === 'TRADIE'
      ? await prisma.tradieProfile.findUnique({ where: { userId: session.userId }, select: { id: true } })
      : null;

  const job = await prisma.job.findUnique({
    where: { id: parsed.data.jobId },
    include: {
      homeownerProfile: true,
      quoteRequests: true,
      quotes: true
    }
  });

  if (!job) return NextResponse.json({ error: 'Job not found.' }, { status: 404 });

  const isHomeownerParticipant = session.role === 'HOMEOWNER' && job.homeownerProfile.userId === session.userId;
  const isTradieParticipant =
    session.role === 'TRADIE' &&
    !!tradieProfile &&
    (job.quoteRequests.some((request) => request.tradieProfileId === tradieProfile.id) ||
      job.quotes.some((quote) => quote.tradieProfileId === tradieProfile.id));

  if (!isHomeownerParticipant && !isTradieParticipant && session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.message.create({
    data: {
      jobId: parsed.data.jobId,
      senderId: session.userId,
      senderType: session.role === 'HOMEOWNER' ? MessageSenderType.HOMEOWNER : session.role === 'TRADIE' ? MessageSenderType.TRADIE : MessageSenderType.ADMIN,
      body: parsed.data.body
    }
  });

  return NextResponse.json({ ok: true });
}
