import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'TRADIE') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  await prisma.tradieProfile.update({
    where: { userId: session.userId },
    data: {
      businessName: body.businessName,
      abn: body.abn,
      licenceNumber: body.licenceNumber || null,
      categories: body.categories || [],
      serviceAreas: body.serviceAreas || [],
      availabilityNotes: body.availabilityNotes || null,
      bio: body.bio || ''
    }
  });

  return NextResponse.json({ ok: true });
}
