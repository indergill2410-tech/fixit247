'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ReviewForm({ jobId, tradieProfileId }: { jobId: string; tradieProfileId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId,
        tradieProfileId,
        rating: Number(formData.get('rating') || 5),
        headline: String(formData.get('headline') || ''),
        body: String(formData.get('body') || '')
      })
    });

    if (!response.ok) {
      const result = await response.json();
      setError(result.error || 'Unable to submit review');
      return;
    }

    router.refresh();
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <div className="grid gap-3 md:grid-cols-2">
        <select name="rating" defaultValue="5">
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </select>
        <input name="headline" placeholder="Short review headline" required />
      </div>
      <textarea name="body" rows={4} placeholder="What was great? Was pricing clear? Was the tradie on time?" required />
      {error && <p className="text-sm text-red-300">{error}</p>}
      <Button type="submit">Publish review</Button>
    </form>
  );
}
