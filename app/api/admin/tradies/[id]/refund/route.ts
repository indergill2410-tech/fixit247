import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { delta, note } = await request.json();
  const wallet = await prisma.leadWallet.findUnique({ where: { tradieProfileId: id } });
  if (!wallet) return NextResponse.json({ error: 'Wallet not found.' }, { status: 404 });

  await prisma.leadWallet.update({ where: { id: wallet.id }, data: { availableLeads: { increment: delta } } });
  await prisma.leadLedger.create({ data: { walletId: wallet.id, type: 'REFUND', delta, note: note || 'Admin refund issued.' } });
  return NextResponse.json({ ok: true });
}
