import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { TradieProfileForm } from '@/components/forms/tradie-profile-form';

export const dynamic = 'force-dynamic';

export default async function TradieOnboardingPage() {
  const session = await getSession();
  const tradie = await prisma.tradieProfile.findUnique({ where: { userId: session!.userId }, include: { portfolio: true } });

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <Card className="space-y-4">
        <h1 className="text-3xl font-black">Tradie onboarding checklist</h1>
        <ul className="space-y-3 text-sm text-white/70">
          <li>• Business name: {tradie?.businessName}</li>
          <li>• ABN: {tradie?.abn}</li>
          <li>• Licence number: {tradie?.licenceNumber || 'Optional / not supplied'}</li>
          <li>• Service areas: {tradie?.serviceAreas.join(', ')}</li>
          <li>• Categories: {tradie?.categories.join(', ')}</li>
          <li>• Availability notes: {tradie?.availabilityNotes || 'Update this in admin or seed data'}</li>
        </ul>
        <TradieProfileForm defaults={{ businessName: tradie?.businessName || '', abn: tradie?.abn || '', licenceNumber: tradie?.licenceNumber || '', categories: tradie?.categories || [], serviceAreas: tradie?.serviceAreas || [], availabilityNotes: tradie?.availabilityNotes || '', bio: tradie?.bio || '' }} />
      </Card>
      <Card className="space-y-4">
        <h2 className="text-2xl font-bold">Portfolio</h2>
        {tradie?.portfolio.map((item) => (
          <div key={item.id} className="rounded-2xl bg-white/5 p-4">
            <p className="font-semibold">{item.title}</p>
            <p className="mt-2 text-sm text-white/60">{item.description}</p>
            <p className="mt-3 text-xs text-brand-sky">{item.imageUrl}</p>
          </div>
        ))}
      </Card>
    </div>
  );
}
