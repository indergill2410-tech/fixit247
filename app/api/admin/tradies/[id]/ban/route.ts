import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await prisma.tradieProfile.update({ where: { id: id }, data: { bannedAt: new Date() } });
  return NextResponse.redirect(new URL('/admin/tradies', process.env.APP_URL || 'http://localhost:3000'));
}
