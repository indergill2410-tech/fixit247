'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const categories = ['Plumbing', 'Electrical', 'Painting', 'Roofing', 'HVAC', 'Handyman'];

export function JobForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    const photoUrls = String(formData.get('photoUrls') || '')
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean);

    const payload = {
      title: String(formData.get('title') || ''),
      category: String(formData.get('category') || ''),
      description: String(formData.get('description') || ''),
      urgency: String(formData.get('urgency') || 'THIS_WEEK'),
      suburb: String(formData.get('suburb') || ''),
      state: String(formData.get('state') || ''),
      postcode: String(formData.get('postcode') || ''),
      budgetMin: Number(formData.get('budgetMin') || 0),
      budgetMax: Number(formData.get('budgetMax') || 0),
      availability: String(formData.get('availability') || ''),
      photoUrls
    };

    const response = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) {
      setError(result.error || 'Unable to create job');
      return;
    }

    router.push(`/homeowner/jobs/${result.jobId}`);
    router.refresh();
  }

  return (
    <Card className="space-y-5">
      <div>
        <p className="text-sm uppercase tracking-[0.28em] text-brand-sky">Post a job</p>
        <h1 className="mt-2 text-3xl font-black">Tell us what needs fixing</h1>
      </div>
      <form action={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2"><input name="title" placeholder="Kitchen tap leaking and under-sink pipe needs repair" required /></div>
        <select name="category" defaultValue="Plumbing">{categories.map((item) => <option key={item}>{item}</option>)}</select>
        <select name="urgency" defaultValue="THIS_WEEK">
          <option value="TODAY">Today</option>
          <option value="THIS_WEEK">This week</option>
          <option value="FLEXIBLE">Flexible</option>
        </select>
        <input name="suburb" placeholder="Suburb" required />
        <input name="state" placeholder="State" required defaultValue="NSW" />
        <input name="postcode" placeholder="Postcode" required />
        <input name="budgetMin" type="number" placeholder="Budget min" required defaultValue="150" />
        <input name="budgetMax" type="number" placeholder="Budget max" required defaultValue="450" />
        <div className="md:col-span-2"><textarea name="availability" placeholder="Availability e.g. weekdays after 4pm or weekend mornings" rows={3} required /></div>
        <div className="md:col-span-2"><textarea name="description" placeholder="Describe the issue, access details, desired outcome, and any previous repairs." rows={5} required /></div>
        <div className="md:col-span-2"><input name="photoUrls" placeholder="Photo URLs (comma separated)" /></div>
        {error && <p className="md:col-span-2 text-sm text-red-300">{error}</p>}
        <div className="md:col-span-2"><Button>Publish job + match tradies</Button></div>
      </form>
    </Card>
  );
}
