import crypto from 'crypto';
import { addHours } from 'date-fns';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/notifications';

export async function POST(request: Request) {
  const { email } = await request.json();
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const rawToken = crypto.randomBytes(24).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: addHours(new Date(), 1)
      }
    });

    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/auth/reset-password/${rawToken}`;
    await sendEmail(user.email, 'Reset your Fixit247 password', `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`);
  }

  return NextResponse.json({ message: 'If that email exists, a reset link has been sent.' });
}
