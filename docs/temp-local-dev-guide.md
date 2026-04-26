# Temporary Local Dev Guide

This is a temporary checklist for running and testing Missing You locally.

## 1) One-time setup

From repo root:

```bash
nvm install
nvm use
pnpm install
```

Start local PostgreSQL (Docker):

```bash
docker run --name missing-you-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=missing_you \
  -p 5432:5432 -d postgres:16
```

## 2) Environment setup (this phase)

Copy env template:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Set these minimum values in `apps/web/.env.local`:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/missing_you

AUTH_SECRET=your_generated_secret
AUTH_URL=http://localhost:3000

NEXT_PUBLIC_ANCHOR_CHAIN_ID=80002
NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS=0xYourDeployedMemoryRegistryAddress
POLYGON_AMOY_RPC_URL=https://your-rpc-url
NEXT_PUBLIC_POLYGON_AMOY_RPC_URL=https://your-rpc-url
```

Generate `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

Optional values for this phase:

- `AUTH_EMAIL_SERVER` / `AUTH_EMAIL_FROM` (real email magic link)
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_POLYGON_AMOY_EXPLORER_BASE_URL`
- `SENTRY_DSN` (placeholder)

## 3) Prisma / DB flow

```bash
pnpm --filter @missing-you/web db:generate
pnpm --filter @missing-you/web db:migrate
pnpm --filter @missing-you/web db:seed
```

## 4) Start app

```bash
pnpm --filter @missing-you/web dev
```

Open: `http://localhost:3000/en`

## 5) Feature testing checklist

### Auth

1. Open `/en/sign-in`
2. Submit email
3. If SMTP is not configured, use magic link from dev server logs

### Journal flow

1. Open `/en/write`, create journal
2. Open `/en/memories`, confirm entry appears
3. Open `/en/journal/:id`, check detail and visibility controls

### Public sharing

1. Set journal to shareable
2. Open `/en/memory/:id` in incognito
3. Set journal back to private, confirm public URL is not accessible

### Anchoring + verification

1. Connect wallet on Polygon Amoy
2. Click anchor
3. Confirm tx hash + verification info appear
4. Confirm explorer link opens

### Readiness

- `GET /api/health`
- `GET /api/ready` (should be healthy with required env set)

## 6) Quality checks before push

```bash
pnpm precommit:check
```

This runs shared build + web lint + tests + web build (and contract tests if `forge` is installed).

