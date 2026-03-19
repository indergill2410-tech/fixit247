import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export default async function TradieQuotesPage() {
  const session = await getSession();
  const quotes = await prisma.quote.findMany({
    where: { tradieUserId: session!.userId },
    include: { job: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-black">Quotes sent</h1>
      {quotes.map((quote) => (
        <div key={quote.id} className="rounded-2xl bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{quote.job.title}</p>
              <p className="text-sm text-white/55">{quote.status.replace('_', ' ')}</p>
            </div>
            <p className="text-lg font-bold text-brand-lime">{formatCurrency(quote.totalAmount)}</p>
          </div>
        </div>
      ))}
    </Card>
  );
}
