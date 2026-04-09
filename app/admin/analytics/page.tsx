import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const [jobs, quotes, tradies, subscriptions] = await Promise.all([
    prisma.job.findMany({ include: { quotes: true } }),
    prisma.quote.findMany(),
    prisma.tradieProfile.findMany({ include: { reviews: true } }),
    prisma.subscription.findMany()
  ]);

  const conversionRate = jobs.length ? Math.round((jobs.filter((job) => job.quotes.length > 0).length / jobs.length) * 100) : 0;
  const avgResponse = tradies.length ? Math.round(tradies.reduce((sum, tradie) => sum + tradie.averageResponseMins, 0) / tradies.length) : 0;
  const churnSignals = subscriptions.filter((sub) => sub.cancelAtPeriodEnd || sub.status === 'PAST_DUE').length;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="space-y-3">
        <p className="text-sm text-white/55">Job → quote conversion</p>
        <p className="text-4xl font-black">{conversionRate}%</p>
        <p className="text-sm text-white/60">Share of posted jobs that received at least one quote.</p>
      </Card>
      <Card className="space-y-3">
        <p className="text-sm text-white/55">Average response time</p>
        <p className="text-4xl font-black">{avgResponse} min</p>
        <p className="text-sm text-white/60">Marketplace-wide response speed used for badge thresholds.</p>
      </Card>
      <Card className="space-y-3">
        <p className="text-sm text-white/55">Churn signals</p>
        <p className="text-4xl font-black">{churnSignals}</p>
        <p className="text-sm text-white/60">Tradies with cancelation intent or payment issues.</p>
      </Card>
    </div>
  );
}
