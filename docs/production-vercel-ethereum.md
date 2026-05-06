# Production on Vercel with Ethereum mainnet

This guide walks through deploying **Missing You** to [Vercel](https://vercel.com) with **real Ethereum** — that means **[Ethereum mainnet](https://ethereum.org/en/developers/docs/networks/)**, chain ID **`1`**, using **real ETH** for gas. It is **not** a test network (Sepolia, Holesky, etc.). Polygon mainnet (`137`) is a different chain; use `NEXT_PUBLIC_ANCHOR_CHAIN_ID=1` only if users anchor on Ethereum L1.

**Before you start:** mainnet transactions are **irreversible** and **cost money**. Double-check contract code, constructor arguments, and env vars. Prefer validating the full flow on Sepolia or Amoy first, then redeploying addresses and switching env to `1`.

---

## 1. What you are provisioning

| Piece | Role |
|--------|------|
| **Vercel** | Hosts the Next.js app (`apps/web`). |
| **PostgreSQL** | Persists users, journals, drafts (via Prisma). |
| **SMTP** | Sends Auth.js magic-link emails in production. |
| **JSON-RPC** | Server reads receipts / chain state; browser uses public RPC for wagmi (optional but recommended). |
| **MemoryRegistry contract** | Deployed on the **same** chain as `NEXT_PUBLIC_ANCHOR_CHAIN_ID` (here: mainnet). |

---

## 2. Create production PostgreSQL

Use any managed Postgres compatible with Prisma (SSL usually required):

- [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app), [Render](https://render.com), or AWS RDS.

1. Create a database and copy the connection string (often `postgresql://...?sslmode=require`).
2. Note it as **`DATABASE_URL`** — you will paste it into Vercel (and keep it secret).

**Apply migrations** (run once per environment, before or right after first deploy):

```bash
cd apps/web
DATABASE_URL="postgresql://..." pnpm exec prisma migrate deploy
```

Use the **same** `DATABASE_URL` you will set on Vercel. Local `prisma migrate dev` is for development; production should use **`migrate deploy`** only.

---

## 3. Deploy `MemoryRegistry` on Ethereum mainnet

The app expects a deployed **`MemoryRegistry`** at `NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS` on chain **`1`**.

1. Install [Foundry](https://book.getfoundry.sh/getting-started/installation).
2. From `packages/contracts`, fund a deployer wallet with **mainnet ETH** (enough for one contract deployment + buffer).
3. Export keys **only in a secure shell** (never commit; never paste into the repo):

   ```bash
   export ETHEREUM_MAINNET_RPC_URL="https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY"
   export PRIVATE_KEY="0x..."   # deployer; must have mainnet ETH
   ```

4. Deploy:

   ```bash
   cd packages/contracts
   pnpm run deploy:mainnet
   ```

5. Copy the logged **`MemoryRegistry`** address. Verify it on [Etherscan](https://etherscan.io) after deployment.

**Security:** treat `PRIVATE_KEY` like a password. Use a dedicated deployer account with minimal ETH, hardware wallet workflows, or a CI secret store — not your main cold wallet.

---

## 4. Vercel project setup (pnpm monorepo)

The repository root is the **monorepo** (contains `apps/web`, `packages/*`).

1. Push the repo to GitHub/GitLab/Bitbucket and **Import** it in Vercel.
2. **Root Directory:** `apps/web`  
   (So Vercel treats the Next.js app as the project root for output paths.)
3. **Framework Preset:** Next.js (auto-detected).
4. **Install Command** (override — required because dependencies use `workspace:*`):

   ```bash
   cd ../.. && pnpm install
   ```

5. **Build Command** (override — build the web package from the repo root):

   ```bash
   cd ../.. && pnpm --filter @missing-you/web build
   ```

6. **Node.js version:** 20.x (matches `engines` in root `package.json`).

7. Add your **production domain** under Project → Settings → Domains (optional but typical for `AUTH_URL` / `NEXT_PUBLIC_APP_URL`).

---

## 5. Environment variables on Vercel

Add these in **Project → Settings → Environment Variables** for **Production** (and Preview if you want parity).

### Required for a working production app

| Variable | Example / notes |
|----------|------------------|
| `DATABASE_URL` | `postgresql://...` from step 2 |
| `AUTH_SECRET` | Generate: `openssl rand -base64 32` |
| `AUTH_URL` | Canonical site URL, e.g. `https://your-domain.com` (no trailing slash per your Auth config) |
| `NEXT_PUBLIC_APP_URL` | Same public URL as `AUTH_URL` for links and metadata |
| `NEXT_PUBLIC_ANCHOR_CHAIN_ID` | `1` for Ethereum mainnet |
| `NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS` | `0x...` from step 3 |
| `ETHEREUM_MAINNET_RPC_URL` | HTTPS RPC with API key (Alchemy, Infura, etc.) — **server only**, never expose the key in `NEXT_PUBLIC_*` if it is secret |

### Email (magic link) in production

| Variable | Notes |
|----------|--------|
| `AUTH_EMAIL_SERVER` | Nodemailer SMTP URL, e.g. `smtp://user:pass@smtp.example.com:587` |
| `AUTH_EMAIL_FROM` | `"Missing You <no-reply@yourdomain.com>"` |

If these are missing in production, sign-in email will not work reliably.

### Strongly recommended for wallet UX

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_ETHEREUM_MAINNET_RPC_URL` | Public or key-restricted endpoint for **browser** reads (wagmi `http` transport). Can match Alchemy/Infura with domain allowlisting. |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | From [WalletConnect Cloud](https://cloud.walletconnect.com) for mobile / QR wallets |

### Optional

| Variable | Notes |
|----------|--------|
| `RPC_URL` | If set, server uses this for **all** chains (overrides per-chain RPC). Handy for single-endpoint experiments; normally prefer `ETHEREUM_MAINNET_RPC_URL` when `NEXT_PUBLIC_ANCHOR_CHAIN_ID=1`. |
| `SENTRY_DSN` | Error reporting |
| `NEXT_PUBLIC_EXPLORER_BASE_URL` | If set, overrides **all** explorer links (any chain). Otherwise Ethereum mainnet uses `https://etherscan.io`. |

**Never** commit real secrets. Use Vercel env UI or your team’s secret manager.

---

## 6. Auth.js and URLs

- **`AUTH_SECRET`:** required in production; rotate if leaked.
- **`AUTH_URL`:** must match the URL users see (Vercel production domain or custom domain). Mismatches cause broken callbacks and cookies.
- After changing domains, redeploy or clear relevant cookies during testing.

---

## 7. Deploy and verify

1. Trigger a deployment (push to the production branch or “Redeploy”).
2. Open the site, sign in with email, create a draft, then **anchor** with a wallet on **Ethereum mainnet** (chain ID 1).
3. Confirm the transaction on Etherscan and that the app shows the anchored state.
4. Watch server logs on Vercel for RPC or Prisma errors.

---

## 8. Costs and operational notes

- **Gas:** Every anchor is a **mainnet** transaction; fees move with network congestion.
- **RPC:** Paid tiers (Alchemy, Infura, etc.) give reliability and rate limits suitable for production.
- **Database:** Size and connection limits depend on your Postgres plan.
- **Vercel:** Bandwidth and function duration apply; long-running serverless work should stay within limits.

---

## 9. Quick checklist

- [ ] `DATABASE_URL` + `prisma migrate deploy` applied  
- [ ] `AUTH_SECRET`, `AUTH_URL`, `AUTH_EMAIL_*`, `NEXT_PUBLIC_APP_URL`  
- [ ] `NEXT_PUBLIC_ANCHOR_CHAIN_ID=1`  
- [ ] `NEXT_PUBLIC_MEMORY_REGISTRY_ADDRESS` matches mainnet deployment  
- [ ] `ETHEREUM_MAINNET_RPC_URL` on the server  
- [ ] `NEXT_PUBLIC_ETHEREUM_MAINNET_RPC_URL` (recommended) for the browser  
- [ ] Vercel Root Directory `apps/web` + install/build commands above  
- [ ] Contract verified on Etherscan (optional but professional)  

For local parity, see `apps/web/.env.example` and `docs/temp-local-dev-guide.md` (development only).
