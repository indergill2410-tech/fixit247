import Link from 'next/link';
import { ArrowRight, ShieldCheck, TimerReset, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:py-24">
      <div className="space-y-8">
        <Badge>Built for Australian homeowners + licensed tradies</Badge>
        <div className="space-y-5">
          <h1 className="max-w-4xl text-5xl font-black leading-tight sm:text-6xl">
            Faster tradie matching, cleaner quotes, and trust signals that beat the old directories.
          </h1>
          <p className="max-w-2xl text-lg text-white/70">
            Fixit247 helps homeowners go from urgent issue to confirmed booking in minutes, while tradies win high-intent leads, streak rewards, and subscription economics designed for repeat work.
          </p>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link href="/auth/register?role=HOMEOWNER">
            <Button className="w-full sm:w-auto">
              Post a job <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/auth/register?role=TRADIE">
            <Button className="w-full bg-brand-orange text-brand-ink hover:bg-brand-lime sm:w-auto">
              Join as a tradie
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: TimerReset, title: 'Fast match', copy: 'Availability + suburb filters rank ready-to-quote tradies first.' },
            { icon: ShieldCheck, title: 'Trust stack', copy: 'ABN, licence, reviews, and response-time badges show instantly.' },
            { icon: Trophy, title: 'Retention loops', copy: 'Returning-customer shortcuts and fast-reply streaks drive repeat use.' }
          ].map((item) => (
            <Card key={item.title} className="space-y-3">
              <item.icon className="h-7 w-7 text-brand-sky" />
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-white/65">{item.copy}</p>
            </Card>
          ))}
        </div>
      </div>
      <Card className="relative overflow-hidden border-brand-sky/20 bg-gradient-to-br from-brand-blue/20 via-white/5 to-brand-orange/10 p-8">
        <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-brand-lime/20 blur-3xl" />
        <div className="space-y-6">
          <div className="animate-float rounded-[28px] border border-white/10 bg-brand-ink/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/45">Homeowner view</p>
                <h3 className="text-lg font-semibold">Emergency electrician</h3>
              </div>
              <Badge className="bg-brand-orange/10 text-brand-orange">3 quotes in 14 min</Badge>
            </div>
            <div className="space-y-3 text-sm text-white/70">
              <p>Compare pricing, earliest arrival, warranty, and response badges side-by-side.</p>
              <div className="grid gap-3">
                {[['Volt Masters', 'From $280', '4.9 ★'], ['After Hours Spark', 'From $320', 'Fast reply'], ['Westside Electrical', 'From $295', '12m away']].map(
                  ([title, price, meta]) => (
                    <div key={title} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                      <div>
                        <p className="font-medium text-white">{title}</p>
                        <p className="text-xs text-white/50">{meta}</p>
                      </div>
                      <p className="font-semibold text-brand-lime">{price}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-brand-ink/60 p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-white/45">Tradie retention loop</p>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-3xl font-black text-brand-lime">7 day streak</p>
                <p className="text-sm text-white/70">Reply within 15 minutes to keep your Fast Reply badge.</p>
              </div>
              <div className="rounded-2xl bg-brand-orange px-4 py-3 text-sm font-bold text-brand-ink">+12% profile lift</div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
