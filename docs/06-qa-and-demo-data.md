# 06. QA checklist + demo accounts + seed data

## QA checklist

### Auth
- Register homeowner account.
- Register tradie account.
- Log in and log out.
- Request password reset.
- Reset password using generated token URL.

### Homeowner flow
- Post a job.
- Confirm matched tradies produce quote requests.
- Review quote comparison page.
- Accept a quote.
- Send and receive messages.

### Tradie flow
- Review onboarding data.
- Open lead inbox.
- Submit quote.
- Confirm lead credit decrements on first claim.
- Check schedule page after quote acceptance.

### Admin flow
- Approve a tradie.
- Ban a tradie.
- Review moderation queue.
- Inspect analytics page.

### Billing
- Create Stripe checkout session.
- Complete test checkout.
- Confirm webhook updates wallet allocation.

## Demo accounts from seed data
All seed accounts use the same password:

```text
Password123!
```

### Admin
- `admin@fixit247.com.au`

### Homeowner
- `homeowner@fixit247.com.au`

### Tradie
- `tradie1@fixit247.com.au`
- `tradie2@fixit247.com.au`

## Seed data included
- One admin user.
- One homeowner with repeat-customer code.
- Two approved tradies with ABN/licence/profile/portfolio/lead wallets.
- One live quoting job with messages and a submitted quote.
- One completed plumbing job with accepted quote and published review.
