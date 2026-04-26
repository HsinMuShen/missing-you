# Deployment Guide (MVP)

## 1) Required environment variables

Set these for the web runtime:

- `NEXT_PUBLIC_APP_URL`
- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- `AUTH_EMAIL_SERVER`
- `AUTH_EMAIL_FROM`
- `NEXT_PUBLIC_ANCHOR_CHAIN_ID`
- `NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS`
- `POLYGON_AMOY_RPC_URL` / `POLYGON_MAINNET_RPC_URL`

Supported aliases (if your platform already uses these keys):

- `NEXT_PUBLIC_CHAIN_ID` (alias of `NEXT_PUBLIC_ANCHOR_CHAIN_ID`)
- `NEXT_PUBLIC_CONTRACT_ADDRESS` (alias of `NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS`)
- `RPC_URL` (generic RPC override)
- `NEXT_PUBLIC_EXPLORER_BASE_URL` (generic explorer override)

Optional:

- `NEXT_PUBLIC_POLYGON_AMOY_EXPLORER_BASE_URL`
- `NEXT_PUBLIC_POLYGON_MAINNET_EXPLORER_BASE_URL`
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

## 2) Build

```bash
pnpm install
pnpm --filter @missing-you/shared build
pnpm --filter @missing-you/web build
```

## 3) Database migration

Before serving traffic, apply migrations:

```bash
pnpm --filter @missing-you/web db:migrate:deploy
```

Local reset when needed:

```bash
pnpm --filter @missing-you/web db:reset
```

## 4) Start app

```bash
pnpm --filter @missing-you/web start
```

## 5) Probes

- Health: `GET /api/health`
- Readiness: `GET /api/ready`

Production should only receive traffic when readiness returns HTTP 200.

## 6) Contracts

- Deploy `MemoryRegistry` for the target chain from `packages/contracts`.
- Set deployed address in `NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS`.
- Ensure selected chain (`NEXT_PUBLIC_ANCHOR_CHAIN_ID`) matches that contract deployment.

Reference deploy flow:

```bash
cd packages/contracts
pnpm deploy:amoy
DEPLOY_NETWORK=amoy DEPLOY_CHAIN_ID=80002 pnpm save:deployment
pnpm export:abi
```

For mainnet, replace with `pnpm deploy:polygon` and `DEPLOY_CHAIN_ID=137`.

## 7) Vercel setup (recommended)

1. Import repo in Vercel.
2. Framework preset: `Next.js`.
3. Root directory: `apps/web`.
4. Build command: `pnpm --filter @missing-you/web build`.
5. Install command: `pnpm install`.
6. Add required environment variables (Production + Preview).
7. Configure Postgres provider (Neon/Supabase/Railway).
8. Run `db:migrate:deploy` before promoting production traffic.

## 8) CI/CD baseline

GitHub Actions workflow: `.github/workflows/ci.yml`

- web checks: install, lint, tests, build
- contracts: Foundry `forge test`

Protect `main` with required status checks from this workflow.

## 9) Rollback guidance (MVP)

- Keep previous app image/build available.
- Re-point traffic to previous build if readiness or auth fails.
- Never rollback DB schema by ad-hoc SQL; use forward fixes.
