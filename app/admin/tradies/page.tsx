import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminAdjustmentForm } from '@/components/forms/admin-adjustment-form';

export default async function AdminTradiesPage() {
  const tradies = await prisma.tradieProfile.findMany({ include: { user: true, subscription: true }, orderBy: { createdAt: 'desc' } });

  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-black">Tradie approvals + bans</h1>
      {tradies.map((tradie) => (
        <div key={tradie.id} className="grid gap-4 rounded-2xl bg-white/5 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="font-semibold">{tradie.businessName}</p>
            <p className="text-sm text-white/55">{tradie.user.email} • ABN {tradie.abn} • {tradie.categories.join(', ')}</p>
          </div>
          <div className="space-y-3">
            <div className="flex gap-3">
              <form action={`/api/admin/tradies/${tradie.id}/approve`} method="post"><Button type="submit">Approve</Button></form>
              <form action={`/api/admin/tradies/${tradie.id}/ban`} method="post"><Button type="submit" className="bg-brand-orange text-brand-ink hover:bg-brand-lime">Ban</Button></form>
            </div>
            <AdminAdjustmentForm tradieId={tradie.id} action="adjust" />
            <AdminAdjustmentForm tradieId={tradie.id} action="refund" />
          </div>
        </div>
      ))}
    </Card>
  );
}
