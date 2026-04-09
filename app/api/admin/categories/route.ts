import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { name, icon } = await request.json();
  if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  await prisma.category.create({ data: { name, icon: icon || 'wrench' } });
  return NextResponse.json({ ok: true });
}
