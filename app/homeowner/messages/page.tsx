import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Card } from '@/components/ui/card';

export default async function HomeownerMessagesPage() {
  const session = await getSession();
  const jobs = await prisma.job.findMany({
    where: { homeownerProfile: { userId: session!.userId } },
    include: { messages: { include: { sender: true }, orderBy: { createdAt: 'desc' }, take: 10 } },
    orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-black">Message centre</h1>
      {jobs.map((job) => (
        <Card key={job.id} className="space-y-4">
          <h2 className="text-xl font-bold">{job.title}</h2>
          {job.messages.map((message) => (
            <div key={message.id} className="rounded-2xl bg-white/5 p-4 text-sm">
              <p className="font-semibold">{message.sender?.fullName || message.senderType}</p>
              <p className="mt-2 text-white/65">{message.body}</p>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}
