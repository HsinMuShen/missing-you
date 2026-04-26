# Auth

Auth.js (NextAuth v5 beta) with Prisma adapter and email magic-link.

- `auth.ts` exports `auth`, `signIn`, `signOut`, and route handlers.
- `session.ts` and guard helpers enforce session-aware page/API access.

Wallet linking is not implemented yet; `User.walletAddress` is reserved for the next step.
