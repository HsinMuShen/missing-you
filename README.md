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

## Roadmap (suggested)

1. Wallet linking flow (EIP-4361/SIWE style ownership proof) with `User.walletAddress`.  
2. Public share page policy + richer verification UX (owner, chain, timestamp display and mismatch recovery).  
3. Journal CRUD Server Actions + optimistic UI improvements.  
4. Hardening: rate limits, audit logs, content warnings, data export.  

## Documentation

- [Product overview](./docs/overview.md)  
- [Architecture](./docs/architecture.md)  

## License

Private / unlicensed until you add one.
