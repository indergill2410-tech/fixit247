'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const router = useRouter();
  const { token } = use(params);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password: String(formData.get('password') || '') })
    });
    const result = await response.json();
    if (response.ok) {
      setMessage('Password updated. Redirecting to login…');
      setTimeout(() => router.push('/auth/login'), 1200);
    } else {
      setMessage(result.error || 'Unable to reset password.');
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-lg space-y-5">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-brand-sky">Create a new password</p>
          <h1 className="mt-2 text-3xl font-black">Secure your account</h1>
        </div>
        <form action={handleSubmit} className="space-y-4">
          <input type="password" name="password" placeholder="New password" required minLength={8} />
          <Button className="w-full">Update password</Button>
        </form>
        {message && <p className="text-sm text-white/70">{message}</p>}
      </Card>
    </main>
  );
}
