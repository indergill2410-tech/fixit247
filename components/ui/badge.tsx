import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export function Badge({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <span className={cn('inline-flex rounded-full border border-brand-lime/20 bg-brand-lime/10 px-3 py-1 text-xs font-semibold text-brand-lime', className)}>{children}</span>;
}
