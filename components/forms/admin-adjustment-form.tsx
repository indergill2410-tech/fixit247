'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function AdminAdjustmentForm({ tradieId, action }: { tradieId: string; action: 'adjust' | 'refund' }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    await fetch(`/api/admin/tradies/${tradieId}/${action === 'adjust' ? 'adjust-leads' : 'refund'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delta: Number(formData.get('delta') || 0), note: String(formData.get('note') || '') })
    });
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="grid gap-2 md:grid-cols-[100px_1fr_auto]">
      <input name="delta" type="number" defaultValue={action === 'adjust' ? 1 : 1} />
      <input name="note" placeholder={action === 'adjust' ? 'Lead adjustment note' : 'Refund note'} required />
      <Button type="submit" className={action === 'refund' ? 'bg-brand-orange text-brand-ink hover:bg-brand-lime' : ''}>{action === 'adjust' ? 'Adjust leads' : 'Refund'}</Button>
    </form>
  );
}
