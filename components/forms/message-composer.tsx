'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function MessageComposer({ jobId }: { jobId: string }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, body: String(formData.get('body') || '') })
    });
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <textarea name="body" placeholder="Send a message…" rows={3} required />
      <Button type="submit">Send message</Button>
    </form>
  );
}
