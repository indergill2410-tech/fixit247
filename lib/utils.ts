import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(cents: number) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(cents / 100);
}

export function formatLeadPrice(cents: number) {
  return `${formatCurrency(cents)} incl. GST`;
}

export function truncate(text: string, size = 120) {
  if (text.length <= size) return text;
  return `${text.slice(0, size - 1)}…`;
}
