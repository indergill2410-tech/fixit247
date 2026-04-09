import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { DisputeStatusForm } from '@/components/forms/dispute-status-form';

export const dynamic = 'force-dynamic';

export default async function AdminDisputesPage() {
  const jobs = await prisma.job.findMany({
    where: { status: { in: ['BOOKED', 'IN_PROGRESS', 'DISPUTED', 'COMPLETED'] } },
    include: { homeownerProfile: { include: { user: true } }, quotes: { include: { tradieProfile: true } } },
    orderBy: { updatedAt: 'desc' },
    take: 20
  });

  return (
    <Card className="space-y-5">
      <h1 className="text-3xl font-black">Disputes + job interventions</h1>
      {jobs.map((job) => (
        <div key={job.id} className="rounded-2xl bg-white/5 p-4">
          <p className="font-semibold">{job.title}</p>
          <p className="mt-1 text-sm text-white/55">Homeowner: {job.homeownerProfile.user.fullName}</p>
          <p className="mt-1 text-sm text-white/55">Tradies involved: {job.quotes.map((quote) => quote.tradieProfile.businessName).join(', ') || 'Awaiting quote'}</p>
          <div className="mt-3"><DisputeStatusForm jobId={job.id} currentStatus={job.status} /></div>
        </div>
      ))}
    </Card>
  );
}
