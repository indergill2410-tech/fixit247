import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const quote = await prisma.quote.findUnique({ where: { id: id } });
export async function POST(_: Request, { params }: { params: { id: string } }) {
  const quote = await prisma.quote.findUnique({ where: { id: params.id } });
  if (!quote) return NextResponse.redirect(new URL('/homeowner', process.env.APP_URL || 'http://localhost:3000'));

  await prisma.quote.update({ where: { id: quote.id }, data: { status: 'ACCEPTED' } });
  await prisma.job.update({ where: { id: quote.jobId }, data: { acceptedQuoteId: quote.id, status: 'BOOKED' } });

  return NextResponse.redirect(new URL(`/homeowner/jobs/${quote.jobId}`, process.env.APP_URL || 'http://localhost:3000'));
}
