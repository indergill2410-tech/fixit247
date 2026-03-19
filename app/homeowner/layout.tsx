import { ClipboardList, MessageCircle, PlusSquare, ReceiptText } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { requireSession } from '@/lib/auth';

export default async function HomeownerLayout({ children }: { children: React.ReactNode }) {
  await requireSession('HOMEOWNER');

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[260px_1fr]">
      <Sidebar
        title="Homeowner portal"
        items={[
          { href: '/homeowner', label: 'Dashboard', icon: <ClipboardList className="h-4 w-4" /> },
          { href: '/homeowner/jobs/new', label: 'Post a job', icon: <PlusSquare className="h-4 w-4" /> },
          { href: '/homeowner/quotes', label: 'Quotes', icon: <ReceiptText className="h-4 w-4" /> },
          { href: '/homeowner/messages', label: 'Messages', icon: <MessageCircle className="h-4 w-4" /> }
        ]}
      />
      <section className="space-y-6">{children}</section>
    </main>
  );
}
