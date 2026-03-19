import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageComposer } from '@/components/forms/message-composer';
import { formatCurrency } from '@/lib/utils';
import { ReviewForm } from '@/components/forms/review-form';

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await prisma.job.findUnique({
    where: { id },
export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      quotes: { include: { tradieProfile: { include: { user: true, reviews: true } } }, orderBy: { totalAmount: 'asc' } },
      messages: { include: { sender: true }, orderBy: { createdAt: 'asc' } },
      review: true
    }
  });

  if (!job) notFound();

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="space-y-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge>{job.status.replace('_', ' ')}</Badge>
            <h1 className="mt-3 text-3xl font-black">{job.title}</h1>
            <p className="mt-2 text-white/70">{job.description}</p>
          </div>
          <div className="rounded-3xl bg-white/5 p-4 text-sm text-white/65">
            <p>{job.category}</p>
            <p>{job.suburb}, {job.state} {job.postcode}</p>
            <p>Budget {formatCurrency(job.budgetMin * 100)} - {formatCurrency(job.budgetMax * 100)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Compare quotes</h2>
          {job.quotes.map((quote) => (
            <div key={quote.id} className="rounded-3xl border border-white/10 bg-black/10 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold">{quote.tradieProfile.businessName}</p>
                  <p className="text-sm text-white/55">{quote.tradieProfile.averageResponseMins} min response • {quote.tradieProfile.reviews.length} reviews</p>
                </div>
                <p className="text-2xl font-black text-brand-lime">{formatCurrency(quote.totalAmount)}</p>
              </div>
              <p className="mt-4 text-sm text-white/70">{quote.scope}</p>
              <div className="mt-4 flex gap-3">
                {quote.status !== 'ACCEPTED' ? (
                  <form action={`/api/quotes/${quote.id}/accept`} method="post">
                    <Button type="submit">Accept quote</Button>
                  </form>
                ) : (
                  <Badge>Accepted</Badge>
                )}
                <Link href="/homeowner/messages"><Button className="bg-white/10 shadow-none hover:bg-white hover:text-brand-ink">Open messages</Button></Link>
              </div>
            </div>
          ))}
          {!job.quotes.length && <p className="text-sm text-white/60">Matched tradies have been invited. Quotes will appear here as they respond.</p>}
        </div>
        {job.status === 'COMPLETED' && job.acceptedQuoteId && !job.review && job.quotes.find((quote) => quote.id === job.acceptedQuoteId) ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-2xl font-bold">Leave a review</h2>
            <p className="mt-2 text-sm text-white/65">Reward great tradies with trust signals and help the next homeowner choose faster.</p>
            <div className="mt-4">
              <ReviewForm jobId={job.id} tradieProfileId={job.quotes.find((quote) => quote.id === job.acceptedQuoteId)!.tradieProfileId} />
            </div>
          </div>
        ) : null}
      </Card>
      <Card className="space-y-5">
        <h2 className="text-2xl font-bold">Messages</h2>
        <div className="max-h-[460px] space-y-3 overflow-y-auto pr-1">
          {job.messages.map((message) => (
            <div key={message.id} className="rounded-2xl bg-white/5 p-4 text-sm">
              <p className="font-semibold">{message.sender?.fullName || message.senderType}</p>
              <p className="mt-2 text-white/70">{message.body}</p>
            </div>
          ))}
        </div>
        <MessageComposer jobId={job.id} />
      </Card>
    </div>
  );
}
