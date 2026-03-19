import { JobStatus, QuoteStatus, ReviewStatus, Role } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function getDashboardData() {
  const [jobsOpen, tradiesApproved, quotesSubmitted, reviewsPublished] = await Promise.all([
    prisma.job.count({ where: { status: { in: [JobStatus.OPEN, JobStatus.QUOTING, JobStatus.BOOKED] } } }),
    prisma.tradieProfile.count({ where: { approvedAt: { not: null }, bannedAt: null } }),
    prisma.quote.count({ where: { status: { in: [QuoteStatus.SUBMITTED, QuoteStatus.ACCEPTED] } } }),
    prisma.review.count({ where: { status: ReviewStatus.PUBLISHED } })
  ]);

  return { jobsOpen, tradiesApproved, quotesSubmitted, reviewsPublished };
}

export async function getHomeownerDashboard(userId: string) {
  return prisma.homeownerProfile.findUnique({
    where: { userId },
    include: {
      jobs: {
        include: {
          quotes: {
            include: {
              tradieProfile: {
                include: { user: true }
              }
            }
          },
          messages: { orderBy: { createdAt: 'desc' }, take: 3 }
        },
        orderBy: { createdAt: 'desc' }
      },
      user: true
    }
  });
}

export async function getTradieDashboard(userId: string) {
  return prisma.tradieProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      leadCredits: { include: { ledgerEntries: { orderBy: { createdAt: 'desc' }, take: 8 } } },
      subscription: true,
      leads: { orderBy: { createdAt: 'desc' }, take: 10 },
      quotes: { include: { job: true }, orderBy: { createdAt: 'desc' }, take: 10 },
      reviews: true,
      portfolio: true
    }
  });
}

export async function getAdminDashboard() {
  const [tradies, reviews, users] = await Promise.all([
    prisma.tradieProfile.findMany({ include: { user: true, subscription: true }, orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.review.findMany({ include: { tradieProfile: { include: { user: true } }, author: true }, orderBy: { createdAt: 'desc' }, take: 20 }),
    prisma.user.count({ where: { role: { not: Role.ADMIN } } })
  ]);

  return { tradies, reviews, users };
}
