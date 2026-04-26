# `@missing-you/web`

Next.js **App Router** application: **frontend + BFF** (Route Handlers + server services). Uses **Tailwind**, **next-intl**, **wagmi/viem**, and **Prisma**.

## Local setup

1. Copy env file:
   - `cp .env.example .env.local`
2. Fill required values:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `AUTH_URL`
   - `NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS`
   - RPC URL for selected anchor chain (`POLYGON_AMOY_RPC_URL` or `POLYGON_MAINNET_RPC_URL`)
3. From monorepo root: `pnpm install`
4. Prisma setup:
   - `pnpm --filter @missing-you/web db:generate`
   - `pnpm --filter @missing-you/web db:migrate`
   - (optional reset) `pnpm --filter @missing-you/web db:reset`
5. Start app:
   - `pnpm --filter @missing-you/web dev`
6. (Optional) Seed demo data:
   - `pnpm --filter @missing-you/web db:seed`

## Environment checklist

- `NEXT_PUBLIC_APP_URL` — canonical app URL for metadata/share links
- `DATABASE_URL` — PostgreSQL DSN
- `AUTH_SECRET`, `AUTH_URL` — Auth.js session/sign-in config
- `AUTH_EMAIL_SERVER`, `AUTH_EMAIL_FROM` — email magic-link provider
- `SENTRY_DSN` — optional monitoring sink (placeholder integration)
- `NEXT_PUBLIC_ANCHOR_CHAIN_ID` — `80002` (Amoy) or `137` (Polygon)
- `NEXT_PUBLIC_CHAIN_ID` — alias for anchor chain id (optional)
- `NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS` — deployed `MemoryRegistry`
- `NEXT_PUBLIC_CONTRACT_ADDRESS` — alias for registry address (optional)
- `POLYGON_AMOY_RPC_URL`, `POLYGON_MAINNET_RPC_URL` — server-side receipt + chain reads
- `RPC_URL` — generic RPC alias (optional)
- `NEXT_PUBLIC_POLYGON_*_EXPLORER_BASE_URL` — optional explorer URL overrides
- `NEXT_PUBLIC_EXPLORER_BASE_URL` — generic explorer alias (optional)
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` — optional WalletConnect

## API hardening notes

- Request validation uses shared and route-level **zod** schemas.
- Unauthorized responses include stable error shape (`error`, `code`, `requestId`).
- Service-level access checks return `404` for non-owned journals to reduce resource enumeration.
- Private memories are never rendered on public routes.

## Folders

- `app/[locale]/` — locale-aware pages
- `app/api/` — BFF route handlers
- `lib/db`, `lib/hashing`, `lib/blockchain`, `lib/auth`, `lib/config`, `lib/observability`
- `server/actions|repositories|services|schemas`
- `messages/` — `en.json`, `zh-TW.json`

## Deployment notes

### Build + run

```bash
pnpm --filter @missing-you/web build
pnpm --filter @missing-you/web start
```

### Health/readiness endpoint

- `GET /api/health` — lightweight health check
- `GET /api/ready` — readiness (env completeness) check for deployment
- In production, returns `503` if required env is missing.

### Prisma in production

- Prefer migration-based flow:
  - `pnpm --filter @missing-you/web db:migrate:deploy`
- Ensure migrations are applied during deploy before serving traffic.

### Vercel quick setup

1. Import repository into Vercel.
2. Set root directory to `apps/web`.
3. Configure all required env variables.
4. Run `db:migrate:deploy` as part of release process.
5. Verify `/api/ready` returns HTTP 200 after deploy.

### Next.js hosting

Works on Vercel, Fly.io, Render, Railway, or container-based hosting.

Minimum production requirements:

- stable Postgres
- persistent Auth.js secret
- reliable SMTP provider
- RPC provider for selected chain

## Known limitations

- Tx validation checks receipt status + target contract + contract log presence, but does not yet decode event args.
- No request rate limiting yet.
- No background queue/retry system for chain confirmation failures.

## Testing

```bash
pnpm --filter @missing-you/web test:run
```

Coverage focus for MVP reliability:

- canonical payload + hash determinism
- verification service correctness
- journal service state transitions
- API auth/validation behavior
- lightweight integration flow (`create -> prepare -> confirm -> verify`)
