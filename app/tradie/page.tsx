import { CircleDollarSign, Reply, Star, Trophy } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getSession } from '@/lib/auth';
import { getTradieDashboard } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function TradieDashboardPage() {
  const session = await getSession();
  const dashboard = await getTradieDashboard(session!.userId);
  const wonQuotes = dashboard?.quotes.filter((quote) => quote.status === 'ACCEPTED') ?? [];

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge>{dashboard?.approvedAt ? 'Approved tradie' : 'Pending approval'}</Badge>
          <h1 className="mt-3 text-4xl font-black">{dashboard?.businessName}</h1>
          <p className="mt-2 text-white/70">Lead wallet: {dashboard?.leadCredits?.availableLeads ?? 0} available leads. Fast-reply streak: {dashboard?.fastReplyStreak ?? 0} days.</p>
        </div>
        <div className="rounded-[28px] bg-brand-orange px-5 py-4 text-brand-ink">
          <p className="text-xs uppercase tracking-[0.28em]">Current plan</p>
          <p className="mt-2 text-2xl font-black">{dashboard?.subscription?.plan?.replace('_', ' ') ?? 'TRIAL'}</p>
        </div>
      </Card>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Available leads" value={String(dashboard?.leadCredits?.availableLeads ?? 0)} helper="Monthly allowance plus rollover." icon={<CircleDollarSign className="h-5 w-5" />} />
        <StatCard label="Quotes sent" value={String(dashboard?.quotes.length ?? 0)} helper="Transparent builder improves conversion." icon={<Reply className="h-5 w-5" />} />
        <StatCard label="Won jobs" value={String(wonQuotes.length)} helper="Accepted quotes ready for scheduling." icon={<Trophy className="h-5 w-5" />} />
        <StatCard label="Average review" value={dashboard?.reviews.length ? (dashboard.reviews.reduce((sum, review) => sum + review.rating, 0) / dashboard.reviews.length).toFixed(1) : '—'} helper="Trust badges update after each completed job." icon={<Star className="h-5 w-5" />} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="space-y-4">
          <h2 className="text-2xl font-bold">Recent leads</h2>
          {dashboard?.leads.map((lead) => (
            <div key={lead.id} className="rounded-2xl bg-white/5 p-4 text-sm text-white/70">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white">Job #{lead.jobId.slice(-6)}</p>
                <p className="text-brand-lime">{formatCurrency(lead.priceAmount)}</p>
              </div>
              <p className="mt-2">Status: {lead.status}</p>
            </div>
          ))}
        </Card>
        <Card className="space-y-4">
          <h2 className="text-2xl font-bold">Lead wallet ledger</h2>
          {dashboard?.leadCredits?.ledgerEntries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-2xl bg-white/5 p-4 text-sm">
              <div>
                <p className="font-semibold">{entry.type.replace('_', ' ')}</p>
                <p className="text-white/55">{entry.note}</p>
              </div>
              <p className={entry.delta >= 0 ? 'text-brand-lime' : 'text-brand-orange'}>{entry.delta > 0 ? '+' : ''}{entry.delta}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
