import Link from 'next/link';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Sidebar({ title, items }: { title: string; items: { href: string; label: string; icon: ReactNode }[] }) {
  return (
    <aside className="rounded-[28px] border border-white/10 bg-white/5 p-5">
      <p className="mb-4 text-xs uppercase tracking-[0.28em] text-white/45">{title}</p>
      <div className="space-y-2">
        {items.map((item) => (
          <Link key={item.href} href={item.href} className={cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/70 hover:bg-white/10 hover:text-white')}>
            {item.icon}
            {item.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
