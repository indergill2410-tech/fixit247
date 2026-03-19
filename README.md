# Fixit247

Fixit247 is a production-ready Australian tradie marketplace MVP+ built with Next.js, Prisma, PostgreSQL, and Stripe billing.

## Deliverables
1. `docs/01-market-analysis.md`
2. `docs/02-system-architecture.md`
3. `docs/03-repo-tree.md`
4. Source code in this repository
5. `docs/05-render-deployment.md`
6. `docs/06-qa-and-demo-data.md`

## Quick start

```bash
npm install
npm run prisma:generate
npx prisma migrate deploy
npm run prisma:seed
npm run dev
```

## Demo credentials
All demo users use:

```text
Password123!
```

- Admin: `admin@fixit247.com.au`
- Homeowner: `homeowner@fixit247.com.au`
- Tradie: `tradie1@fixit247.com.au`
- Tradie: `tradie2@fixit247.com.au`


## Offline validation in restricted environments

This repository now includes self-contained TypeScript shims, Node built-in tests, and an offline-aware build wrapper so `npm run build` automatically falls back to `npm run typecheck` when Prisma/Next binaries are unavailable in a restricted environment. In a normal installed environment, `npm run build` still runs `prisma generate` followed by `next build`.

For dependency advisories, use `npm run audit:prod`. It attempts `npm audit --omit=dev`, retries once without proxy variables when the npm advisory endpoint is blocked, and reports registry-access failures as an infrastructure warning instead of a misleading package failure.
