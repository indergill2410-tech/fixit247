import Link from 'next/link';
import { Clock3, ShieldCheck, TriangleAlert, UserRound } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { Card } from '@/components/ui/card';
import { getAdminDashboard } from '@/lib/data';

export default async function AdminOverviewPage() {
  const dashboard = await getAdminDashboard();
  const pendingTradies = dashboard.tradies.filter((tradie) => !tradie.approvedAt && !tradie.bannedAt).length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Marketplace users" value={String(dashboard.users)} helper="Homeowners + tradies." icon={<UserRound className="h-5 w-5" />} />
        <StatCard label="Pending approvals" value={String(pendingTradies)} helper="Approve or request more evidence." icon={<ShieldCheck className="h-5 w-5" />} />
        <StatCard label="Flagged reviews" value={String(dashboard.reviews.filter((review) => review.status === 'FLAGGED').length)} helper="Moderation queue." icon={<TriangleAlert className="h-5 w-5" />} />
        <StatCard label="Fast-reply laggards" value={String(dashboard.tradies.filter((tradie) => tradie.averageResponseMins > 60).length)} helper="Churn-signal monitoring." icon={<Clock3 className="h-5 w-5" />} />
      </div>
      <Card className="space-y-4">
        <h1 className="text-3xl font-black">Admin operating system</h1>
        <p className="text-white/70">Use the dedicated pages to approve or ban tradies, moderate reviews, manage disputes, and monitor lead-wallet adjustments and churn signals.</p>
        <Link href="/admin/tradies" className="text-brand-sky">Review tradie approvals →</Link>
      </Card>
    </div>
  );
}
