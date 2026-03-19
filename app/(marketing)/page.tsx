import Link from 'next/link';
import { Bolt, ChartSpline, Shield, Star, WalletCards } from 'lucide-react';
import { Hero } from '@/components/marketing/hero';
import { Navbar } from '@/components/marketing/navbar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeading } from '@/components/ui/section-heading';
import { getDashboardData } from '@/lib/data';
import { SUBSCRIPTION_PLANS } from '@/lib/constants';
import { describeLeadPolicy } from '@/lib/plans';

export default async function LandingPage() {
  const stats = await getDashboardData();
  const leadPolicy = describeLeadPolicy();

  return (
    <main>
      <Navbar />
      <Hero />
      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="grid gap-4 rounded-[32px] border border-white/10 bg-white/5 p-6 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ['Open jobs', stats.jobsOpen.toString()],
            ['Approved tradies', stats.tradiesApproved.toString()],
            ['Quotes submitted', stats.quotesSubmitted.toString()],
            ['Published reviews', stats.reviewsPublished.toString()]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-black/10 p-4">
              <p className="text-sm text-white/50">{label}</p>
              <p className="mt-2 text-3xl font-black">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl space-y-10 px-6 py-16">
        <SectionHeading
          eyebrow="Why it wins"
          title="Positioned beyond directories: instant readiness, quote clarity, and richer retention loops."
          copy="Fixit247 is designed as a conversion engine, not a listing board. Matching is driven by urgency, suburb, category, availability, and reply streaks, while the UX keeps homeowners and tradies returning."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: Bolt,
              title: 'Faster matching',
              copy: 'Rank tradies by service area overlap, category fit, response speed, and approval status so homeowners see viable options first.'
            },
            {
              icon: WalletCards,
              title: 'Clearer pricing',
              copy: 'Standardised quote builder exposes labour, materials, and fees so homeowners compare apples-to-apples.'
            },
            {
              icon: Shield,
              title: 'Stronger trust',
              copy: 'ABN, licence, portfolio, review moderation, and admin controls make trust visible at first glance.'
            },
            {
              icon: Star,
              title: 'Retention loops',
              copy: 'Returning-customer code, tradie streaks, and post-job nudges grow repeat bookings and loyalty.'
            },
            {
              icon: ChartSpline,
              title: 'Tradie economics',
              copy: 'Subscriptions reduce uncertainty versus pay-per-click lead marketplaces while keeping lead caps transparent.'
            }
          ].map((item) => (
            <Card key={item.title} className="space-y-4">
              <item.icon className="h-6 w-6 text-brand-sky" />
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-sm text-white/65">{item.copy}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl space-y-10 px-6 py-16">
        <SectionHeading
          eyebrow="Tradie subscriptions"
          title="Lead packs built for predictable ROI."
          copy="A lead is consumed when a tradie claims a homeowner job and unlocks direct messaging plus quote submission. Included unused leads roll one cycle only, capped at 50% of next month’s allowance."
        />
        <div className="grid gap-6 lg:grid-cols-3">
          {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
            <Card key={key} className="space-y-5">
              <Badge>{plan.label}</Badge>
              <div>
                <p className="text-4xl font-black">${(plan.priceAudCents / 100).toFixed(0)}</p>
                <p className="mt-1 text-sm text-white/60">AUD / month</p>
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                <li>• Claim and unlock {plan.leads} high-intent homeowner jobs each month.</li>
                <li>• 1-cycle rollover up to {Math.floor(plan.leads / 2)} extra leads.</li>
                <li>• Immediate upgrades, next-cycle downgrades.</li>
              </ul>
              <Link href={`/auth/register?role=TRADIE&plan=${key}`}>
                <Button className="w-full">Start with {plan.label}</Button>
              </Link>
            </Card>
          ))}
        </div>
        <Card className="space-y-3 text-sm text-white/70">
          <p><span className="font-semibold text-white">Lead definition:</span> {leadPolicy.definition}</p>
          <p><span className="font-semibold text-white">Rollover:</span> {leadPolicy.rollover}</p>
          <p><span className="font-semibold text-white">Upgrade handling:</span> {leadPolicy.upgrade}</p>
          <p><span className="font-semibold text-white">Downgrade handling:</span> {leadPolicy.downgrade}</p>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <Card className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-brand-sky">Ready to launch</p>
            <h2 className="mt-2 text-3xl font-black">Deploy locally, then ship on Render with Postgres + Stripe.</h2>
            <p className="mt-2 text-white/65">Detailed deployment, environment, webhook, and domain instructions live in docs/05-render-deployment.md inside this repo.</p>
          </div>
          <Link href="/auth/register">
            <Button className="bg-brand-orange text-brand-ink hover:bg-brand-lime">Start onboarding</Button>
          </Link>
        </Card>
      </section>
    </main>
  );
}
