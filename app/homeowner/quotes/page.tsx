import Link from 'next/link';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

export default async function HomeownerQuotesPage() {
  const session = await getSession();
  const quotes = await prisma.quote.findMany({
    where: { job: { homeownerProfile: { userId: session!.userId } } },
    include: { job: true, tradieProfile: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-black">Quote comparison inbox</h1>
      <div className="space-y-3">
        {quotes.map((quote) => (
          <Link key={quote.id} href={`/homeowner/jobs/${quote.jobId}`} className="block rounded-2xl bg-white/5 p-4 hover:bg-white/10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{quote.job.title}</p>
                <p className="text-sm text-white/55">{quote.tradieProfile.businessName}</p>
              </div>
              <p className="text-lg font-bold text-brand-lime">{formatCurrency(quote.totalAmount)}</p>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
