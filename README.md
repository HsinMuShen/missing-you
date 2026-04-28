# Missing You

A **bilingual** (English / Traditional Chinese) Web3 journaling product: **full journal content stays off-chain** in **PostgreSQL**; a **canonical payload** is **hashed** and **anchored on-chain** for verification — not for storing prose.

This repository is a **pnpm + Turborepo** monorepo ready for MVP iteration.

## Structure

```txt
missing-you/
├─ apps/web/           # Next.js (App Router) — UI + BFF
├─ packages/shared/    # Types, Zod schemas, constants, canonical helpers
├─ packages/ui/        # Shared UI primitives (shadcn-style)
├─ packages/contracts/ # Foundry — MemoryRegistry.sol
└─ docs/               # Overview & architecture notes
```

## Requirements

- **Node.js** ≥ 20  
- **pnpm** 9.x (`corepack enable && corepack prepare pnpm@9.15.4 --activate`)  
- **PostgreSQL** 14+ for Prisma  
- **Foundry** (`forge`) for Solidity build/test  

## Install

```bash
cd missing-you
pnpm install
```

`postinstall` builds `@missing-you/shared` and `@missing-you/ui` so TypeScript consumers resolve `dist/` types.

## Develop

```bash
pnpm dev
```

Opens the Next.js app (default [http://localhost:3000](http://localhost:3000)) — middleware redirects to a locale prefix (e.g. `/en`).

## Deploy (Vercel recommended)

1. Import repository into Vercel.
2. Set project root to `apps/web`.
3. Configure required environment variables from `apps/web/.env.example`.
4. Provision PostgreSQL (Neon/Supabase/Railway) and set `DATABASE_URL`.
5. Run Prisma migrations before serving traffic:
   - `pnpm --filter @missing-you/web db:migrate:deploy`
6. Verify readiness endpoint:
   - `GET /api/ready` returns HTTP 200.

## Build

TypeScript / Next.js (contracts use Foundry separately — see below):

```bash
pnpm build
```

## Web app only

```bash
pnpm --filter @missing-you/web dev
pnpm --filter @missing-you/web build
```

## PostgreSQL locally

Example with Docker:

```bash
docker run --name missing-you-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=missing_you -p 5432:5432 -d postgres:16
```

Copy `apps/web/.env.example` to `apps/web/.env.local` and set `DATABASE_URL`.

## Prisma

After schema changes, apply to your database:

```bash
pnpm --filter @missing-you/web db:push
# or
pnpm --filter @missing-you/web db:migrate
pnpm --filter @missing-you/web db:studio
```

### Authentication + Journal API (MVP)

Auth: **Auth.js (NextAuth v5 beta)** with Prisma adapter and email magic links.

- `POST /api/journals` — create draft for the signed-in user (`content`, optional `person`, `privacy`: `private` | `share`).
- `GET /api/journals` — list journals for the signed-in user only.
- `GET /api/journals/:id` — detail + `localVerification` + `chainVerification`; private journals require owner session.
- `POST /api/journals/:id/prepare-anchor` — owner-only; ensures `memoryId` (idempotent), returns `memoryIdBytes32`, canonical payload, SHA-256 `contentHash`, `shareable`.
- `POST /api/journals/:id/confirm-anchor` — owner-only; body `{ "txHash", "chainId", "contractAddress" }`; validates receipt via server RPC, then persists `MemoryAnchor`.

Protected pages: `/[locale]/write`, `/[locale]/memories`, `/[locale]/settings`.


### Blockchain (Polygon-compatible)

Set in `apps/web/.env.local`:

- `NEXT_PUBLIC_ANCHOR_CHAIN_ID` — `80002` (Amoy) or `137` (Polygon).
- `NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS` — deployed `MemoryRegistry`.
- `POLYGON_AMOY_RPC_URL` / `POLYGON_MAINNET_RPC_URL` — server reads for receipts + `getMemory`.
- Optional: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` for WalletConnect (MetaMask still works via injected).

`pnpm --filter @missing-you/web build` runs `prisma generate` before `next build`.

## Production readiness quick check

Before first public release, verify:

- `apps/web/.env.local` (or deploy env) includes required vars for DB, auth, and chain RPC.
- `GET /api/health` returns `ok: true` and `ready: true`.
- Prisma migrations are applied in production before serving traffic.
- `NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS` matches the deployed contract for selected chain.
- SMTP provider is configured for Auth.js email sign-in.

## Security notes

- Journal content remains off-chain by design; chain stores only proof metadata.
- Private journals are not publicly accessible and non-owner access is treated as not-found.
- Tx confirmation validates receipt status and contract target before DB persistence.
- See detailed hardening notes: [Security and hardening](./docs/security-and-hardening.md).

## Contracts (Foundry)

Foundry is **not** part of `pnpm build` so web developers can work without `forge` installed.

```bash
cd packages/contracts
forge install --no-commit foundry-rs/forge-std
forge build   # or: pnpm compile (from this directory)
forge test    # or: pnpm test
```

Deploy script: `script/Deploy.s.sol` — see `packages/contracts/README.md`.

## API health

`GET /api/health` — JSON `{ ok: true }` (not locale-prefixed).
`GET /api/ready` — readiness probe (env completeness).

## CI/CD

GitHub Actions workflow: `.github/workflows/ci.yml`

- Web: install, lint, test, build
- Contracts: `forge test`

Recommended branch protection: require CI checks before merging to `main`.

## Testing

Web tests (Vitest):

```bash
pnpm --filter @missing-you/web test:run
```

Contract tests (Foundry):

```bash
pnpm --filter @missing-you/contracts test
```

Pre-commit checks (lint/tests/build):

```bash
pnpm precommit:check
```

Install local git pre-commit hook:

```bash
pnpm hooks:install
```

## Roadmap (suggested)

1. Wallet linking flow (EIP-4361/SIWE style ownership proof) with `User.walletAddress`.  
2. Production hardening: rate limits, audit logs, event-level tx validation.  
3. SRE improvements: monitoring, alerts, and incident runbooks.  
4. Security testing expansion: API fuzzing + E2E auth/privacy regression suite.  

## Documentation

- [Product overview](./docs/overview.md)  
- [Architecture](./docs/architecture.md)  
- [Security and hardening](./docs/security-and-hardening.md)  
- [Deployment guide](./docs/deployment.md)  
- [Audit checklist](./docs/audit-checklist.md)  
- [QA checklist](./docs/qa-checklist.md)  
- [10-minute QA script](./docs/qa-10-minute-script.md)  
- [User product guide](./docs/user-readme.md)  
- [User product guide (zh-TW)](./docs/user-readme.zh-TW.md)  

## License

Private / unlicensed until you add one.
