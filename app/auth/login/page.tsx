import Link from 'next/link';
import { AuthForm } from '@/components/forms/auth-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg space-y-6">
        <AuthForm mode="login" />
        <div className="text-center text-sm text-white/60">
          <Link href="/auth/forgot-password" className="text-brand-sky">Forgot password?</Link>
          <span className="mx-2">•</span>
          <Link href="/auth/register" className="text-brand-sky">Create account</Link>
        </div>
      </div>
    </main>
  );
}
