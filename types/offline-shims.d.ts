declare const process: any;
declare const global: any;
declare const __dirname: string;

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare namespace React {
  type ReactNode = any;
}

declare module 'react' {
  export type ReactNode = any;
  export type PropsWithChildren<T = any> = T & { children?: any; key?: any; [key: string]: any };
  export type ButtonHTMLAttributes<T = any> = any;
  export function useState<T = any>(initial?: T): [T, (value: any) => void];
  export function use<T = any>(value: any): T;
}

declare module 'next' {
  export type NextConfig = any;
  export type Metadata = any;
}

declare module 'next/link' {
  const Link: any;
  export default Link;
}

declare module 'next/navigation' {
  export function redirect(path: string): never;
  export function notFound(): never;
  export function useRouter(): any;
  export function useSearchParams(): any;
}

declare module 'next/server' {
  export const NextResponse: any;
}

declare module 'next/headers' {
  export function cookies(): Promise<any>;
}

declare module '@prisma/client' {
  export const Role: any;
  export type Role = any;
  export const JobUrgency: any;
  export type JobUrgency = any;
  export const JobStatus: any;
  export type JobStatus = any;
  export const QuoteStatus: any;
  export type QuoteStatus = any;
  export const SubscriptionPlan: any;
  export type SubscriptionPlan = any;
  export const SubscriptionStatus: any;
  export type SubscriptionStatus = any;
  export const LeadLedgerType: any;
  export type LeadLedgerType = any;
  export const ReviewStatus: any;
  export type ReviewStatus = any;
  export const MessageSenderType: any;
  export type MessageSenderType = any;
  export class PrismaClient {
    constructor(...args: any[]);
    [key: string]: any;
  }
}

declare module 'lucide-react' {
  export const Hammer: any;
  export const LayoutDashboard: any;
  export const ArrowRight: any;
  export const ShieldCheck: any;
  export const TimerReset: any;
  export const Trophy: any;
  export const ClipboardList: any;
  export const MessageCircle: any;
  export const PlusSquare: any;
  export const ReceiptText: any;
  export const CalendarClock: any;
  export const ListChecks: any;
  export const Sparkles: any;
  export const Star: any;
  export const BriefcaseBusiness: any;
  export const CalendarDays: any;
  export const ClipboardCheck: any;
  export const MessageSquareQuote: any;
  export const BarChart3: any;
  export const FolderTree: any;
  export const ShieldAlert: any;
  export const Siren: any;
  export const Clock3: any;
  export const TriangleAlert: any;
  export const UserRound: any;
  export const CircleDollarSign: any;
  export const Reply: any;
  export const Bolt: any;
  export const ChartSpline: any;
  export const Shield: any;
  export const WalletCards: any;
}

declare module 'bcryptjs' {
  const bcrypt: any;
  export default bcrypt;
}

declare module 'jose' {
  export function jwtVerify<T = any>(...args: any[]): Promise<{ payload: T }>;
  export class SignJWT {
    constructor(payload?: any);
    setProtectedHeader(...args: any[]): this;
    setIssuedAt(...args: any[]): this;
    setExpirationTime(...args: any[]): this;
    sign(...args: any[]): Promise<string>;
  }
}

declare module 'clsx' {
  export type ClassValue = any;
  export function clsx(...args: any[]): string;
}

declare module 'tailwind-merge' {
  export function twMerge(...args: any[]): string;
}

declare module 'zod' {
  export const z: any;
}

declare module 'date-fns' {
  export function addMonths(date: Date, amount: number): Date;
  export function addHours(date: Date, amount: number): Date;
  export function addDays(date: Date, amount: number): Date;
}

declare module 'stripe' {
  export namespace Stripe {
    type Event = any;
    namespace Checkout {
      type Session = any;
    }
  }
  class Stripe {
    constructor(...args: any[]);
    webhooks: any;
    checkout: any;
  }
  export default Stripe;
}

declare module 'tailwindcss' {
  export type Config = any;
}

declare module 'crypto' {
  const crypto: any;
  export default crypto;
}
