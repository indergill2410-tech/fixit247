import { BarChart3, FolderTree, ShieldAlert, ShieldCheck, Siren, Star } from 'lucide-react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { requireSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireSession('ADMIN');

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[260px_1fr]">
      <Sidebar
        title="Admin portal"
        items={[
          { href: '/admin', label: 'Overview', icon: <BarChart3 className="h-4 w-4" /> },
          { href: '/admin/tradies', label: 'Tradie approvals', icon: <ShieldCheck className="h-4 w-4" /> },
          { href: '/admin/categories', label: 'Categories', icon: <FolderTree className="h-4 w-4" /> },
          { href: '/admin/reviews', label: 'Review moderation', icon: <Star className="h-4 w-4" /> },
          { href: '/admin/disputes', label: 'Disputes', icon: <Siren className="h-4 w-4" /> },
          { href: '/admin/analytics', label: 'Analytics', icon: <ShieldAlert className="h-4 w-4" /> }
        ]}
      />
      <section className="space-y-6">{children}</section>
    </main>
  );
}
