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

## 7) Rollback guidance (MVP)

- Keep previous app image/build available.
- Re-point traffic to previous build if readiness or auth fails.
- Never rollback DB schema by ad-hoc SQL; use forward fixes.
