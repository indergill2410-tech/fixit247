'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ForgotPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: String(formData.get('email') || '') })
    });
    const result = await response.json();
    setMessage(result.message);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <Card className="w-full max-w-lg space-y-5">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-brand-sky">Password reset</p>
          <h1 className="mt-2 text-3xl font-black">Reset your password</h1>
        </div>
        <form action={handleSubmit} className="space-y-4">
          <input type="email" name="email" placeholder="you@fixit247.com.au" required />
          <Button className="w-full">Send reset link</Button>
        </form>
        {message && <p className="text-sm text-white/70">{message}</p>}
        <Link href="/auth/login" className="text-sm text-brand-sky">Back to login</Link>
      </Card>
    </main>
  );
}
