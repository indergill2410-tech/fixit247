# 05. Render deployment guide

## 1) Create the Render PostgreSQL database
1. In Render, create a new **PostgreSQL** instance.
2. Copy the internal database URL into `DATABASE_URL`.
3. Keep SSL enabled in Render’s provided connection string.

## 2) Create the web service
Use a **Web Service** connected to this repository.

### Build command
```bash
npm install && npm run build
```

### Start command
```bash
npm run prisma:migrate && npm run start
```

## 3) Required environment variables

```bash
DATABASE_URL=
AUTH_SECRET=
APP_URL=https://fixit247.com.au
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

### Notes
- `AUTH_SECRET` should be a long random string.
- `APP_URL` must match the production custom domain.
- `STRIPE_WEBHOOK_SECRET` comes from the Stripe webhook endpoint.

## 4) Run migrations + seed locally before first production deploy

```bash
npm install
npm run prisma:generate
npx prisma migrate deploy
npm run prisma:seed
npm run dev
```

## 5) Stripe setup

### Products / prices
Create three recurring monthly prices in Stripe for AUD:
- Fixit247 10 leads — **$59 AUD**
- Fixit247 20 leads — **$89 AUD**
- Fixit247 30 leads — **$139 AUD**

This app currently creates Checkout price data dynamically in code, so separate pre-created prices are optional.

### Webhook endpoint
Set the webhook endpoint to:

```text
https://fixit247.com.au/api/stripe/webhook
```

Recommended events:
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

The current implementation handles `checkout.session.completed` and is structured for the rest.

## 6) Custom domain for fixit247.com.au
1. In Render, open the deployed web service.
2. Add the custom domain `fixit247.com.au`.
3. Add `www.fixit247.com.au` if you want the www variant as well.
4. Update your DNS provider with the Render-provided records.
5. Wait for SSL provisioning to complete.
6. Set `APP_URL=https://fixit247.com.au`.

## 7) Recommended Render service settings
- Region close to Australia if available for your Render plan.
- Auto-deploy enabled for the default branch.
- Health checks can target `/`.
- Use at least a plan suitable for Next.js SSR + Prisma.

## 8) Post-deploy checks
- Register a new homeowner account.
- Register a new tradie account.
- Log in as admin and approve the tradie.
- Post a job as homeowner.
- Submit a quote as tradie.
- Accept the quote as homeowner.
- Trigger a Stripe test checkout + webhook.
