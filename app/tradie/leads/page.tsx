import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuoteBuilder } from '@/components/forms/quote-builder';
import { formatCurrency } from '@/lib/utils';

export default async function TradieLeadsPage() {
  const session = await getSession();
  const tradie = await prisma.tradieProfile.findUnique({ where: { userId: session!.userId } });
  const requests = await prisma.quoteRequest.findMany({
    where: { tradieProfileId: tradie!.id },
    include: { job: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black">Lead inbox</h1>
      {requests.map((request) => (
        <Card key={request.id} className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge>{request.status.replace('_', ' ')}</Badge>
              <h2 className="mt-3 text-2xl font-bold">{request.job.title}</h2>
              <p className="text-sm text-white/60">{request.job.suburb} • Budget {formatCurrency(request.job.budgetMin * 100)} - {formatCurrency(request.job.budgetMax * 100)}</p>
            </div>
            <div className="text-sm text-brand-lime">Lead consumed: {request.leadConsumed ? 'Yes' : 'No'}</div>
          </div>
          <p className="text-sm text-white/70">{request.job.description}</p>
          <QuoteBuilder jobId={request.jobId} />
        </Card>
      ))}
    </div>
  );
}
