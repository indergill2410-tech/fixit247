import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

export function StatCard({ label, value, helper, icon }: { label: string; value: string; helper: string; icon: ReactNode }) {
  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between text-white/60">
        <p className="text-sm">{label}</p>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-black">{value}</p>
        <p className="mt-2 text-sm text-white/55">{helper}</p>
      </div>
    </Card>
  );
}
