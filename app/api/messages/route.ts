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
