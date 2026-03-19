import { PropsWithChildren } from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={cn('rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur', className)}>{children}</div>;
}
