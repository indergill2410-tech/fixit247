CREATE TYPE "Role" AS ENUM ('HOMEOWNER', 'TRADIE', 'ADMIN');
CREATE TYPE "JobUrgency" AS ENUM ('TODAY', 'THIS_WEEK', 'FLEXIBLE');
CREATE TYPE "JobStatus" AS ENUM ('DRAFT', 'OPEN', 'QUOTING', 'BOOKED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED');
CREATE TYPE "QuoteStatus" AS ENUM ('REQUESTED', 'SUBMITTED', 'ACCEPTED', 'REJECTED', 'EXPIRED');
CREATE TYPE "SubscriptionPlan" AS ENUM ('LEADS_10', 'LEADS_20', 'LEADS_30');
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED');
CREATE TYPE "LeadLedgerType" AS ENUM ('MONTHLY_ALLOCATION', 'ROLLOVER', 'PURCHASED', 'CONSUMED', 'ADJUSTMENT', 'REFUND', 'EXPIRED');
CREATE TYPE "ReviewStatus" AS ENUM ('PUBLISHED', 'FLAGGED', 'REMOVED');
CREATE TYPE "MessageSenderType" AS ENUM ('HOMEOWNER', 'TRADIE', 'ADMIN', 'SYSTEM');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "phone" TEXT,
  "role" "Role" NOT NULL,
  "suburb" TEXT,
  "state" TEXT,
  "postcode" TEXT,
  "avatarUrl" TEXT
);

CREATE TABLE "HomeownerProfile" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL UNIQUE,
  "repeatCustomerCode" TEXT UNIQUE,
  "streakCount" INTEGER NOT NULL DEFAULT 0,
  "lastBookedAt" TIMESTAMP(3),
  CONSTRAINT "HomeownerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "TradieProfile" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL UNIQUE,
  "businessName" TEXT NOT NULL,
  "abn" TEXT NOT NULL,
  "licenceNumber" TEXT,
  "yearsInBusiness" INTEGER NOT NULL DEFAULT 1,
  "bio" TEXT NOT NULL,
  "approvedAt" TIMESTAMP(3),
  "bannedAt" TIMESTAMP(3),
  "fastReplyStreak" INTEGER NOT NULL DEFAULT 0,
  "averageResponseMins" INTEGER NOT NULL DEFAULT 45,
  "serviceRadiusKm" INTEGER NOT NULL DEFAULT 20,
  "serviceAreas" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "categories" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "availabilityNotes" TEXT,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "TradieProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "PortfolioItem" (
  "id" TEXT PRIMARY KEY,
  "tradieId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  CONSTRAINT "PortfolioItem_tradieId_fkey" FOREIGN KEY ("tradieId") REFERENCES "TradieProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Job" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "homeownerProfileId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "urgency" "JobUrgency" NOT NULL,
  "suburb" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "postcode" TEXT NOT NULL,
  "addressText" TEXT,
  "budgetMin" INTEGER NOT NULL,
  "budgetMax" INTEGER NOT NULL,
  "availability" TEXT NOT NULL,
  "status" "JobStatus" NOT NULL DEFAULT 'OPEN',
  "photoUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "matchedTradieIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "acceptedQuoteId" TEXT UNIQUE,
  CONSTRAINT "Job_homeownerProfileId_fkey" FOREIGN KEY ("homeownerProfileId") REFERENCES "HomeownerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "QuoteRequest" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "jobId" TEXT NOT NULL,
  "tradieProfileId" TEXT NOT NULL,
  "status" "QuoteStatus" NOT NULL DEFAULT 'REQUESTED',
  "leadConsumed" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "QuoteRequest_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "QuoteRequest_tradieProfileId_fkey" FOREIGN KEY ("tradieProfileId") REFERENCES "TradieProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "QuoteRequest_jobId_tradieProfileId_key" UNIQUE ("jobId", "tradieProfileId")
);

CREATE TABLE "Quote" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "jobId" TEXT NOT NULL,
  "tradieProfileId" TEXT NOT NULL,
  "tradieUserId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "lineItemsJson" JSONB NOT NULL,
  "subtotalAmount" INTEGER NOT NULL,
  "serviceFeeAmount" INTEGER NOT NULL,
  "totalAmount" INTEGER NOT NULL,
  "estimatedStart" TIMESTAMP(3),
  "estimatedDuration" TEXT,
  "status" "QuoteStatus" NOT NULL DEFAULT 'SUBMITTED',
  CONSTRAINT "Quote_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Quote_tradieProfileId_fkey" FOREIGN KEY ("tradieProfileId") REFERENCES "TradieProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Quote_tradieUserId_fkey" FOREIGN KEY ("tradieUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Lead" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "tradieProfileId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "priceAmount" INTEGER NOT NULL DEFAULT 590,
  "status" TEXT NOT NULL DEFAULT 'CLAIMED',
  CONSTRAINT "Lead_tradieProfileId_fkey" FOREIGN KEY ("tradieProfileId") REFERENCES "TradieProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "LeadWallet" (
  "id" TEXT PRIMARY KEY,
  "tradieProfileId" TEXT NOT NULL UNIQUE,
  "monthlyAllowance" INTEGER NOT NULL DEFAULT 10,
  "availableLeads" INTEGER NOT NULL DEFAULT 10,
  "rolloverLeads" INTEGER NOT NULL DEFAULT 0,
  "currentPeriodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LeadWallet_tradieProfileId_fkey" FOREIGN KEY ("tradieProfileId") REFERENCES "TradieProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "LeadLedger" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "walletId" TEXT NOT NULL,
  "type" "LeadLedgerType" NOT NULL,
  "delta" INTEGER NOT NULL,
  "note" TEXT NOT NULL,
  CONSTRAINT "LeadLedger_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "LeadWallet"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Subscription" (
  "id" TEXT PRIMARY KEY,
  "tradieProfileId" TEXT NOT NULL UNIQUE,
  "stripeCustomerId" TEXT UNIQUE,
  "stripeSubscriptionId" TEXT UNIQUE,
  "plan" "SubscriptionPlan" NOT NULL,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
  "currentPeriodStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
  "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "Subscription_tradieProfileId_fkey" FOREIGN KEY ("tradieProfileId") REFERENCES "TradieProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Message" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "jobId" TEXT NOT NULL,
  "senderId" TEXT,
  "senderType" "MessageSenderType" NOT NULL,
  "body" TEXT NOT NULL,
  CONSTRAINT "Message_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "Review" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "authorUserId" TEXT NOT NULL,
  "tradieProfileId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL UNIQUE,
  "rating" INTEGER NOT NULL,
  "headline" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "status" "ReviewStatus" NOT NULL DEFAULT 'PUBLISHED',
  CONSTRAINT "Review_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Review_tradieProfileId_fkey" FOREIGN KEY ("tradieProfileId") REFERENCES "TradieProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Review_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE "Category" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "name" TEXT NOT NULL UNIQUE,
  "icon" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE "PasswordResetToken" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "tokenHash" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  "usedAt" TIMESTAMP(3),
  CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
