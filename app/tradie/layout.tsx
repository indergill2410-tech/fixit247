import { BriefcaseBusiness, CalendarDays, ClipboardCheck, MessageSquareQuote } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { requireSession } from '@/lib/auth';

export default async function TradieLayout({ children }: { children: React.ReactNode }) {
  await requireSession('TRADIE');

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[260px_1fr]">
      <Sidebar
        title="Tradie portal"
        items={[
          { href: '/tradie', label: 'Dashboard', icon: <BriefcaseBusiness className="h-4 w-4" /> },
          { href: '/tradie/onboarding', label: 'Onboarding', icon: <ClipboardCheck className="h-4 w-4" /> },
          { href: '/tradie/leads', label: 'Lead inbox', icon: <MessageSquareQuote className="h-4 w-4" /> },
          { href: '/tradie/quotes', label: 'Quotes', icon: <ClipboardCheck className="h-4 w-4" /> },
          { href: '/tradie/schedule', label: 'Schedule', icon: <CalendarDays className="h-4 w-4" /> }
        ]}
      />
      <section className="space-y-6">{children}</section>
    </main>
  );
}
