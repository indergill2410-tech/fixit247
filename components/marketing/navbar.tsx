import Link from 'next/link';
import { Hammer, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-ink/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-bold tracking-tight">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-orange text-brand-ink shadow-glow">
            <Hammer className="h-5 w-5" />
          </span>
          <span className="text-lg">Fixit247</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
          <Link href="/#features">Features</Link>
          <Link href="/#pricing">Tradie Pricing</Link>
          <Link href="/auth/login">Login</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/homeowner">
            <Button className="bg-white/10 shadow-none hover:bg-white hover:text-brand-ink">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button>Get started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
