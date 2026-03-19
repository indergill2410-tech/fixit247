# 02. System architecture

## Stack choice

### Frontend + backend
- **Next.js 15 App Router** for a single deployable web app.
- **React 19** for UI composition.
- **Tailwind CSS** for premium, mobile-first styling.
- **Route handlers** for backend APIs inside the same codebase.

### Data layer
- **PostgreSQL** on Render.
- **Prisma ORM** for schema, migrations, and seed data.

### Auth
- Custom **email/password auth** using bcrypt password hashing + signed JWT session cookie.
- Password reset via token table + reset route.

### Payments
- **Stripe Checkout + webhook** for tradie subscription billing.

### Deployment
- **Render Web Service** for the Next.js app.
- **Render PostgreSQL** for the database.

## Architecture overview

```text
Browser
  -> Next.js App Router pages
  -> Next.js route handlers (/api/*)
  -> Prisma client
  -> Render PostgreSQL

Stripe Checkout
  -> Stripe webhook
  -> Subscription + lead wallet updates
```

## Interface map

### 1) Homeowner portal
Routes:
- `/homeowner`
- `/homeowner/jobs/new`
- `/homeowner/jobs/[id]`
- `/homeowner/quotes`
- `/homeowner/messages`

Capabilities:
- Post jobs with urgency, location, budget, availability, and photos.
- View matched tradies via incoming quote requests and quotes.
- Compare quotes and accept one.
- In-app messaging.
- Track job status.

### 2) Tradie portal
Routes:
- `/tradie`
- `/tradie/onboarding`
- `/tradie/leads`
- `/tradie/quotes`
- `/tradie/schedule`

Capabilities:
- ABN/licence/service area/category onboarding state.
- Lead inbox.
- Lead-credit enforcement.
- Transparent quote builder.
- Schedule view for accepted jobs.
- Earnings/leads health via dashboard stats.

### 3) Admin portal
Routes:
- `/admin`
- `/admin/tradies`
- `/admin/categories`
- `/admin/reviews`
- `/admin/disputes`
- `/admin/analytics`

Capabilities:
- Approve / ban tradies.
- Manage categories.
- Moderate reviews.
- Resolve disputes by updating job status.
- Issue lead adjustments and refunds into the tradie lead wallet ledger.
- Monitor conversion, response time, and churn signals.

## Auth routes
- `/auth/login`
- `/auth/register`
- `/auth/forgot-password`
- `/auth/reset-password/[token]`

## API map
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/jobs`
- `POST /api/jobs/[id]/quote-requests`
- `POST /api/quotes/[id]/accept`
- `POST /api/messages`
- `POST /api/stripe/checkout`
- `POST /api/stripe/webhook`
- `POST /api/admin/categories`
- `POST /api/admin/jobs/[id]/status`
- `POST /api/admin/tradies/[id]/approve`
- `POST /api/admin/tradies/[id]/ban`
- `POST /api/admin/tradies/[id]/adjust-leads`
- `POST /api/admin/tradies/[id]/refund`

## Database schema summary

### Core entities
- `User`
- `HomeownerProfile`
- `TradieProfile`
- `PortfolioItem`
- `Job`
- `QuoteRequest`
- `Quote`
- `Lead`
- `LeadWallet`
- `LeadLedger`
- `Subscription`
- `Message`
- `Review`
- `PasswordResetToken`

## Lead policy implemented

### Lead definition
A lead is consumed when a tradie claims a homeowner job and unlocks direct messaging plus quote submission for that job.

### Subscription tiers
- 10 leads — **$59 AUD / month**
- 20 leads — **$89 AUD / month**
- 30 leads — **$139 AUD / month**

### Monthly lead limits
Each plan sets a monthly included allowance in the tradie’s `LeadWallet`.

### Rollover rule
Unused included leads roll over for **one billing cycle only**, capped at **50% of the next month’s included allowance**.

### Upgrade handling
Upgrades apply immediately. The webhook logic tops the wallet up to the new plan allowance plus eligible rollover.

### Downgrade handling
Downgrades are intended for the next billing cycle. The architecture doc and pricing language state this rule, and the wallet logic is designed around the next cycle allowance.

## Background jobs / notifications plan

### Implemented now
- Password reset emails are generated through the notification helper.
- Stripe webhook updates subscription + wallet state.

### Planned next jobs
1. **Match refresh worker**
   - Re-rank open jobs as tradie availability changes.
2. **Reminder worker**
   - Nudge tradies if quote requests are aging.
3. **Review request worker**
   - Trigger review prompts after completion.
4. **Churn-risk worker**
   - Flag tradies with low wallet usage, high response times, or cancel-at-period-end subscriptions.
5. **Returning customer worker**
   - Send personalised repeat-booking reminders to homeowners.
