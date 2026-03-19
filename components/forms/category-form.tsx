'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function CategoryForm() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: String(formData.get('name') || ''), icon: String(formData.get('icon') || 'wrench') })
    });
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
      <input name="name" placeholder="Category name" required />
      <input name="icon" placeholder="Icon keyword" defaultValue="wrench" required />
      <Button type="submit">Add category</Button>
    </form>
  );
}
