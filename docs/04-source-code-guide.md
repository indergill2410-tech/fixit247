# 04. Full source code guide

The full source code for every application file is contained directly in this repository.

## Main app areas
- `app/` — Next.js pages, layouts, and API route handlers.
- `components/` — reusable UI, marketing, dashboard, and form components.
- `lib/` — auth, Prisma, pricing constants, validation, notifications, and Stripe helpers.
- `prisma/` — schema, migration, and seed data.
- `tests/` — focused utility/plan tests.

## Key implementation notes
- The app is a **single deployable monolith** that supports homeowner, tradie, and admin roles.
- UI is mobile-first with high-contrast “tradie colors” and animated hero elements.
- Seed data creates demo accounts, jobs, quotes, messages, reviews, and lead-wallet state.
- Stripe billing is wired via Checkout session creation and webhook processing.

## Offline-safe validation layer
- `types/offline-shims.d.ts` supplies ambient declarations for restricted environments where npm packages cannot be fetched.
- `npm install` succeeds without registry access.
- `npm run typecheck` uses the global TypeScript compiler plus the ambient shim layer.
- `npm test` uses Node's built-in test runner instead of Vitest.
