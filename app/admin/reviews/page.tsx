import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({ include: { tradieProfile: true, author: true }, orderBy: { createdAt: 'desc' } });

  return (
    <Card className="space-y-4">
      <h1 className="text-3xl font-black">Review moderation</h1>
      {reviews.map((review) => (
        <div key={review.id} className="rounded-2xl bg-white/5 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{review.headline}</p>
              <p className="text-sm text-white/55">{review.author.fullName} → {review.tradieProfile.businessName}</p>
            </div>
            <p className="text-brand-lime">{review.rating} / 5</p>
          </div>
          <p className="mt-3 text-sm text-white/70">{review.body}</p>
        </div>
      ))}
    </Card>
  );
}
