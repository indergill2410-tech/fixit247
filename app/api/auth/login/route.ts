import { NextResponse } from 'next/server';
import { createSession, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid login payload.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user) return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

  await createSession({ userId: user.id, role: user.role, email: user.email, fullName: user.fullName });

  const redirectTo = user.role === 'ADMIN' ? '/admin' : user.role === 'TRADIE' ? '/tradie' : '/homeowner';
  return NextResponse.json({ ok: true, redirectTo });
}
