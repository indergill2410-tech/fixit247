'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function QuoteBuilder({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [items, setItems] = useState([{ label: 'Labour', amount: 250 }]);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const response = await fetch('/api/jobs/' + jobId + '/quote-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jobId,
        title: String(formData.get('title') || ''),
        scope: String(formData.get('scope') || ''),
        subtotalAmount: Number(formData.get('subtotalAmount') || 0),
        estimatedDuration: String(formData.get('estimatedDuration') || ''),
        estimatedStart: String(formData.get('estimatedStart') || ''),
        lineItems: items
      })
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error || 'Unable to submit quote');
      return;
    }
    router.refresh();
  }

  return (
    <Card className="space-y-4">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-brand-sky">Quote builder</p>
        <h2 className="mt-2 text-2xl font-bold">Submit a transparent quote</h2>
      </div>
      <form action={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Fixed-price repair with parts" required />
        <textarea name="scope" rows={4} placeholder="Scope of work, inclusions, warranty, and exclusions" required />
        <div className="grid gap-4 md:grid-cols-2">
          <input name="subtotalAmount" type="number" defaultValue={items.reduce((sum, item) => sum + item.amount, 0)} required />
          <input name="estimatedDuration" placeholder="Estimated duration (e.g. 2 hours)" required />
          <input name="estimatedStart" type="date" />
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="grid gap-3 md:grid-cols-[1fr_160px]">
              <input
                value={item.label}
                onChange={(event) => setItems((current) => current.map((entry, idx) => idx === index ? { ...entry, label: event.target.value } : entry))}
              />
              <input
                type="number"
                value={item.amount}
                onChange={(event) => setItems((current) => current.map((entry, idx) => idx === index ? { ...entry, amount: Number(event.target.value) } : entry))}
              />
            </div>
          ))}
          <Button type="button" className="bg-white/10 shadow-none hover:bg-white hover:text-brand-ink" onClick={() => setItems((current) => [...current, { label: '', amount: 0 }])}>Add line item</Button>
        </div>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <Button type="submit">Send quote</Button>
      </form>
    </Card>
  );
}
