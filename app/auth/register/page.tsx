import Link from 'next/link';
import { AuthForm } from '@/components/forms/auth-form';

export default async function RegisterPage({
  searchParams
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const params = await searchParams;
  const defaultRole = params.role === 'TRADIE' ? 'TRADIE' : 'HOMEOWNER';

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-lg space-y-6">
        <AuthForm mode="register" defaultRole={defaultRole} />
        <p className="text-center text-sm text-white/60">
          Already have an account? <Link href="/auth/login" className="text-brand-sky">Log in</Link>
        </p>
      </div>
    </main>
  );
}
