'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function DisputeStatusForm({ jobId, currentStatus }: { jobId: string; currentStatus: string }) {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    await fetch(`/api/admin/jobs/${jobId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: String(formData.get('status') || currentStatus) })
    });
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="grid gap-2 md:grid-cols-[1fr_auto]">
      <select name="status" defaultValue={currentStatus}>
        <option value="OPEN">OPEN</option>
        <option value="QUOTING">QUOTING</option>
        <option value="BOOKED">BOOKED</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="DISPUTED">DISPUTED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
      <Button type="submit">Update status</Button>
    </form>
  );
}
