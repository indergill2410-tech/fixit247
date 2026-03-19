import type { Route } from 'next';
import Link from 'next/link';
import { CalendarClock, ListChecks, Sparkles, Star } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSession } from '@/lib/auth';
import { getHomeownerDashboard } from '@/lib/data';
import { formatCurrency, truncate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function HomeownerDashboardPage() {
  const session = await getSession();
  const dashboard = await getHomeownerDashboard(session!.userId);
  const jobs = dashboard?.jobs ?? [];
  const accepted = jobs.filter((job) => job.status === 'BOOKED' || job.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <Card className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge>Returning customer experience</Badge>
          <h1 className="mt-3 text-4xl font-black">Welcome back, {dashboard?.user.fullName.split(' ')[0]}</h1>
          <p className="mt-2 max-w-2xl text-white/70">Your repeat-customer code {dashboard?.repeatCustomerCode ?? 'FIXITVIP'} saves previous preferences so posting urgent jobs is frictionless.</p>
        </div>
        <Link href="/homeowner/jobs/new"><Button>Post a new job</Button></Link>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Jobs posted" value={String(jobs.length)} helper="Track progress from brief to completion." icon={<ListChecks className="h-5 w-5" />} />
        <StatCard label="Booked jobs" value={String(accepted)} helper="Quotes accepted and work scheduled." icon={<CalendarClock className="h-5 w-5" />} />
        <StatCard label="Streak" value={`${dashboard?.streakCount ?? 0} jobs`} helper="Return for another booking to maintain your homeowner streak." icon={<Sparkles className="h-5 w-5" />} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Active jobs</h2>
            <Badge>{jobs.length} total</Badge>
          </div>
          <div className="space-y-4">
            {jobs.map((job) => (
              <Link key={job.id} href={`/homeowner/jobs/${job.id}` as Route} className="block rounded-3xl border border-white/10 bg-black/10 p-5 hover:bg-white/10">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-lg font-semibold">{job.title}</p>
                    <p className="text-sm text-white/55">{job.category} • {job.suburb} • {job.status.replace('_', ' ')}</p>
                  </div>
                  <div className="text-sm text-brand-lime">{job.quotes.length} quotes</div>
                </div>
                <p className="mt-3 text-sm text-white/65">{truncate(job.description)}</p>
              </Link>
            ))}
            {!jobs.length && <p className="text-sm text-white/60">No jobs yet. Post your first one to start matching tradies.</p>}
          </div>
        </Card>
        <Card className="space-y-4">
          <h2 className="text-2xl font-bold">Why people come back</h2>
          <ul className="space-y-3 text-sm text-white/70">
            <li>• Saved location + budget defaults speed up repeat postings.</li>
            <li>• Compare quotes with itemised pricing and fast-reply badges.</li>
            <li>• Your preferred tradies can be re-invited in one tap.</li>
          </ul>
          {jobs.slice(0, 2).map((job) => (
            <div key={job.id} className="rounded-2xl bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Best current quote</p>
                <Star className="h-4 w-4 text-brand-orange" />
              </div>
              {job.quotes[0] ? (
                <>
                  <p className="mt-3 text-xl font-bold text-brand-lime">{formatCurrency(job.quotes[0].totalAmount)}</p>
                  <p className="text-sm text-white/60">{job.quotes[0].tradieProfile.businessName}</p>
                </>
              ) : (
                <p className="mt-3 text-sm text-white/60">Waiting for tradies to reply.</p>
              )}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
