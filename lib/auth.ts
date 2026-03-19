import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { jwtVerify, SignJWT } from 'jose';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-change-me');
const cookieName = 'fixit247_session';

type SessionPayload = {
  userId: string;
  role: Role;
  email: string;
  fullName: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);

  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearSession() {
  (await cookies()).delete(cookieName);
}

export async function getSession() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify<SessionPayload>(token, secret);
    return verified.payload;
  } catch {
    return null;
  }
}

export async function requireSession(role?: Role) {
  const session = await getSession();
  if (!session) redirect('/auth/login');
  if (role && session.role !== role) redirect('/');
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;
  return prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      homeownerProfile: true,
      tradieProfile: {
        include: {
          leadCredits: true,
          subscription: true,
          portfolio: true
        }
      }
    }
  });
}
