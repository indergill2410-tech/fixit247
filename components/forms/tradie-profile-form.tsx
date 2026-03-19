'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function TradieProfileForm({
  defaults
}: {
  defaults: {
    businessName: string;
    abn: string;
    licenceNumber: string;
    categories: string[];
    serviceAreas: string[];
    availabilityNotes: string;
    bio: string;
  };
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const response = await fetch('/api/tradie/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        businessName: String(formData.get('businessName') || ''),
        abn: String(formData.get('abn') || ''),
        licenceNumber: String(formData.get('licenceNumber') || ''),
        categories: String(formData.get('categories') || '').split(',').map((v) => v.trim()).filter(Boolean),
        serviceAreas: String(formData.get('serviceAreas') || '').split(',').map((v) => v.trim()).filter(Boolean),
        availabilityNotes: String(formData.get('availabilityNotes') || ''),
        bio: String(formData.get('bio') || '')
      })
    });
    const result = await response.json();
    setMessage(response.ok ? 'Profile updated.' : result.error || 'Unable to update profile.');
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <input name="businessName" defaultValue={defaults.businessName} placeholder="Business name" required />
        <input name="abn" defaultValue={defaults.abn} placeholder="ABN" required />
        <input name="licenceNumber" defaultValue={defaults.licenceNumber} placeholder="Licence number" />
        <input name="categories" defaultValue={defaults.categories.join(', ')} placeholder="Categories (comma separated)" />
        <input name="serviceAreas" defaultValue={defaults.serviceAreas.join(', ')} placeholder="Service suburbs (comma separated)" />
        <input name="availabilityNotes" defaultValue={defaults.availabilityNotes} placeholder="Availability notes" />
      </div>
      <textarea name="bio" rows={4} defaultValue={defaults.bio} placeholder="Short business bio" />
      {message && <p className="text-sm text-white/70">{message}</p>}
      <Button type="submit">Save onboarding profile</Button>
    </form>
  );
}
