import { addDays, addMonths } from 'date-fns';
import { PrismaClient, Role, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.job.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.leadLedger.deleteMany();
  await prisma.leadWallet.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.category.deleteMany();
  await prisma.homeownerProfile.deleteMany();
  await prisma.tradieProfile.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  await prisma.category.createMany({
    data: [
      { name: 'Plumbing', icon: 'droplets' },
      { name: 'Electrical', icon: 'zap' },
      { name: 'Painting', icon: 'paintbrush' },
      { name: 'HVAC', icon: 'fan' },
      { name: 'Handyman', icon: 'hammer' }
    ]
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@fixit247.com.au',
      fullName: 'Fixit247 Admin',
      passwordHash,
      role: Role.ADMIN
    }
  });

  const homeowner = await prisma.user.create({
    data: {
      email: 'homeowner@fixit247.com.au',
      fullName: 'Olivia Homeowner',
      passwordHash,
      role: Role.HOMEOWNER,
      suburb: 'Surry Hills',
      state: 'NSW',
      postcode: '2010',
      homeownerProfile: {
        create: {
          repeatCustomerCode: 'FIX-VIP24',
          streakCount: 2,
          lastBookedAt: addDays(new Date(), -12)
        }
      }
    },
    include: { homeownerProfile: true }
  });

  const tradieOneUser = await prisma.user.create({
    data: {
      email: 'tradie1@fixit247.com.au',
      fullName: 'Mason Sparks',
      passwordHash,
      role: Role.TRADIE,
      suburb: 'Surry Hills',
      state: 'NSW',
      postcode: '2010',
      tradieProfile: {
        create: {
          businessName: 'Volt Masters Sydney',
          abn: '12 345 678 901',
          licenceNumber: 'LIC-NSW-8843',
          yearsInBusiness: 8,
          bio: 'Fast-response electrician for residential emergencies and upgrades.',
          approvedAt: addDays(new Date(), -30),
          fastReplyStreak: 7,
          averageResponseMins: 11,
          serviceRadiusKm: 25,
          serviceAreas: ['Surry Hills', 'Paddington', 'Redfern', 'Sydney CBD'],
          categories: ['Electrical'],
          availabilityNotes: '24/7 emergency callouts plus scheduled works.',
          featured: true,
          portfolio: {
            create: [
              { title: 'Switchboard upgrade', description: 'Modern board replacement with compliance cert.', imageUrl: 'https://images.unsplash.com/photo-1581093458791-9d09aee476d4' },
              { title: 'Feature lighting install', description: 'Premium pendant and dimmer installation.', imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f' }
            ]
          },
          leadCredits: {
            create: {
              monthlyAllowance: 20,
              availableLeads: 14,
              rolloverLeads: 4,
              currentPeriodStart: addDays(new Date(), -14),
              currentPeriodEnd: addDays(new Date(), 16),
              ledgerEntries: {
                create: [
                  { type: 'MONTHLY_ALLOCATION', delta: 20, note: 'Monthly included leads.' },
                  { type: 'ROLLOVER', delta: 4, note: 'Unused leads from previous cycle.' },
                  { type: 'CONSUMED', delta: -10, note: 'Lead claims on active jobs.' }
                ]
              }
            }
          },
          subscription: {
            create: {
              plan: SubscriptionPlan.LEADS_20,
              status: SubscriptionStatus.ACTIVE,
              currentPeriodStart: addDays(new Date(), -14),
              currentPeriodEnd: addDays(new Date(), 16)
            }
          }
        }
      }
    },
    include: { tradieProfile: true }
  });

  const tradieTwoUser = await prisma.user.create({
    data: {
      email: 'tradie2@fixit247.com.au',
      fullName: 'Jack Pipe',
      passwordHash,
      role: Role.TRADIE,
      suburb: 'Marrickville',
      state: 'NSW',
      postcode: '2204',
      tradieProfile: {
        create: {
          businessName: 'Inner West Plumbing Co',
          abn: '98 765 432 109',
          licenceNumber: 'PL-2019-33',
          yearsInBusiness: 12,
          bio: 'Reliable plumber for leaks, hot water, and bathroom upgrades.',
          approvedAt: addDays(new Date(), -45),
          fastReplyStreak: 3,
          averageResponseMins: 24,
          serviceRadiusKm: 20,
          serviceAreas: ['Surry Hills', 'Marrickville', 'Newtown', 'Alexandria'],
          categories: ['Plumbing'],
          availabilityNotes: 'Weekdays and Saturday morning availability.',
          portfolio: {
            create: [
              { title: 'Bathroom refit', description: 'Full wet-area rough-in and fit-off.', imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85' }
            ]
          },
          leadCredits: {
            create: {
              monthlyAllowance: 10,
              availableLeads: 8,
              rolloverLeads: 1,
              currentPeriodStart: addDays(new Date(), -10),
              currentPeriodEnd: addDays(new Date(), 20),
              ledgerEntries: {
                create: [
                  { type: 'MONTHLY_ALLOCATION', delta: 10, note: 'Monthly included leads.' },
                  { type: 'ROLLOVER', delta: 1, note: 'Unused lead rolled over.' },
                  { type: 'CONSUMED', delta: -3, note: 'Leads claimed this cycle.' }
                ]
              }
            }
          },
          subscription: {
            create: {
              plan: SubscriptionPlan.LEADS_10,
              status: SubscriptionStatus.ACTIVE,
              currentPeriodStart: addDays(new Date(), -10),
              currentPeriodEnd: addDays(new Date(), 20)
            }
          }
        }
      }
    },
    include: { tradieProfile: true }
  });

  const job = await prisma.job.create({
    data: {
      homeownerProfileId: homeowner.homeownerProfile!.id,
      title: 'Emergency electrical safety check and power fault',
      category: 'Electrical',
      description: 'Half the apartment has lost power after a storm. Need diagnostics, safety check, and likely circuit repair tonight if possible.',
      urgency: 'TODAY',
      suburb: 'Surry Hills',
      state: 'NSW',
      postcode: '2010',
      budgetMin: 250,
      budgetMax: 700,
      availability: 'After 5pm today or before 8am tomorrow.',
      status: 'QUOTING',
      photoUrls: ['https://images.unsplash.com/photo-1621905251918-48416bd8575a'],
      matchedTradieIds: [tradieOneUser.tradieProfile!.id],
      quoteRequests: {
        create: [{ tradieProfileId: tradieOneUser.tradieProfile!.id, leadConsumed: true, status: 'SUBMITTED' }]
      },
      messages: {
        create: [
          { senderId: homeowner.id, senderType: 'HOMEOWNER', body: 'Hi Mason, the power keeps tripping near the kitchen outlets.' },
          { senderId: tradieOneUser.id, senderType: 'TRADIE', body: 'Thanks Olivia — I can attend tonight around 6:30pm and quote before starting.' }
        ]
      }
    }
  });

  await prisma.quote.create({
    data: {
      jobId: job.id,
      tradieProfileId: tradieOneUser.tradieProfile!.id,
      tradieUserId: tradieOneUser.id,
      title: 'Diagnostic + repair quote',
      scope: 'Electrical diagnostics, isolation testing, repair of faulty circuit, and compliance safety check. Includes minor consumables and 12-month workmanship warranty.',
      lineItemsJson: [{ label: 'Diagnostics + callout', amount: 280 }, { label: 'Minor repair allowance', amount: 110 }],
      subtotalAmount: 39000,
      serviceFeeAmount: 2000,
      totalAmount: 41000,
      estimatedStart: addDays(new Date(), 1),
      estimatedDuration: '2-3 hours',
      status: 'SUBMITTED'
    }
  });

  const completedJob = await prisma.job.create({
    data: {
      homeownerProfileId: homeowner.homeownerProfile!.id,
      title: 'Bathroom mixer tap replacement',
      category: 'Plumbing',
      description: 'Supply and install a new basin mixer tap in ensuite bathroom.',
      urgency: 'FLEXIBLE',
      suburb: 'Surry Hills',
      state: 'NSW',
      postcode: '2010',
      budgetMin: 180,
      budgetMax: 350,
      availability: 'Weekday mornings preferred.',
      status: 'COMPLETED',
      photoUrls: [],
      matchedTradieIds: [tradieTwoUser.tradieProfile!.id]
    }
  });

  const acceptedQuote = await prisma.quote.create({
    data: {
      jobId: completedJob.id,
      tradieProfileId: tradieTwoUser.tradieProfile!.id,
      tradieUserId: tradieTwoUser.id,
      title: 'Supply and install basin mixer',
      scope: 'Remove old tap, supply standard chrome mixer, install, test, and tidy up.',
      lineItemsJson: [{ label: 'Supply tap', amount: 120 }, { label: 'Labour', amount: 110 }],
      subtotalAmount: 23000,
      serviceFeeAmount: 1200,
      totalAmount: 24200,
      estimatedStart: addDays(new Date(), -20),
      estimatedDuration: '90 minutes',
      status: 'ACCEPTED'
    }
  });

  await prisma.job.update({ where: { id: completedJob.id }, data: { acceptedQuoteId: acceptedQuote.id } });

  await prisma.review.create({
    data: {
      authorUserId: homeowner.id,
      tradieProfileId: tradieTwoUser.tradieProfile!.id,
      jobId: completedJob.id,
      rating: 5,
      headline: 'Fast, tidy, and transparent pricing',
      body: 'Jack arrived on time, explained the options clearly, and the quote matched the final invoice. Would book again.',
      status: 'PUBLISHED'
    }
  });

  console.log('Seed complete', { admin: admin.email, homeowner: homeowner.email, tradieOne: tradieOneUser.email, tradieTwo: tradieTwoUser.email });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
