import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';

export default async function TradieSchedulePage() {
  const session = await getSession();
  const quotes = await prisma.quote.findMany({
    where: { tradieUserId: session!.userId, status: 'ACCEPTED' },
    include: { job: true },
    orderBy: { estimatedStart: 'asc' }
  });

  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-black">Schedule</h1>
      {quotes.map((quote) => (
        <div key={quote.id} className="rounded-2xl bg-white/5 p-4 text-sm">
          <p className="font-semibold">{quote.job.title}</p>
          <p className="mt-2 text-white/60">Estimated start: {quote.estimatedStart ? new Date(quote.estimatedStart).toLocaleDateString('en-AU') : 'TBC'}</p>
          <p className="text-white/60">Duration: {quote.estimatedDuration}</p>
        </div>
      ))}
      {!quotes.length && <p className="text-sm text-white/60">Accepted jobs will appear here as a simple schedule view.</p>}
    </Card>
  );
}
