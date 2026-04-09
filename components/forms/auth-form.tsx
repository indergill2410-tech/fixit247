'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function AuthForm({ mode, defaultRole = 'HOMEOWNER' }: { mode: 'login' | 'register'; defaultRole?: 'HOMEOWNER' | 'TRADIE' }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    const payload = {
      fullName: String(formData.get('fullName') || ''),
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
      role: String(formData.get('role') || defaultRole)
    };

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(result.error || 'Something went wrong');
      return;
    }

    router.push(result.redirectTo || '/');
    router.refresh();
  }

  return (
    <Card className="mx-auto w-full max-w-lg space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-brand-sky">{mode === 'login' ? 'Welcome back' : 'Create your account'}</p>
        <h1 className="mt-2 text-3xl font-black">{mode === 'login' ? 'Log in to Fixit247' : 'Join Fixit247'}</h1>
      </div>
      <form
        action={handleSubmit}
        className="space-y-4"
      >
        {mode === 'register' && <input name="fullName" placeholder="Full name" required />}
        <input name="email" type="email" placeholder="Email" required />
        <input name="password" type="password" placeholder="Password" required minLength={8} />
        {mode === 'register' && (
          <select name="role" defaultValue={defaultRole}>
            <option value="HOMEOWNER">Homeowner</option>
            <option value="TRADIE">Tradie</option>
          </select>
        )}
        {error && <p className="text-sm text-red-300">{error}</p>}
        <Button className="w-full" disabled={loading}>{loading ? 'Working…' : mode === 'login' ? 'Log in' : 'Create account'}</Button>
      </form>
    </Card>
  );
}
