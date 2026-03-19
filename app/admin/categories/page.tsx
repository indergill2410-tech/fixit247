import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { CategoryForm } from '@/components/forms/category-form';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <Card className="space-y-5">
      <h1 className="text-3xl font-black">Manage categories</h1>
      <CategoryForm />
      <div className="grid gap-3 md:grid-cols-2">
        {categories.map((category) => (
          <div key={category.id} className="rounded-2xl bg-white/5 p-4">
            <p className="font-semibold">{category.name}</p>
            <p className="mt-1 text-sm text-white/55">Icon: {category.icon}</p>
            <p className="mt-1 text-xs text-brand-sky">{category.active ? 'Active' : 'Inactive'}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
