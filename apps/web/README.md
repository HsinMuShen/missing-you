# `@missing-you/web`

Next.js **App Router** application: **frontend + BFF** (Route Handlers, Server Actions). Uses **Tailwind**, **next-intl**, **wagmi/viem**, and **Prisma**.

## Local setup

1. `cp .env.example .env.local` and set `DATABASE_URL`, `AUTH_SECRET`, and `AUTH_URL`.  
2. (Optional for real email) set `AUTH_EMAIL_SERVER` + `AUTH_EMAIL_FROM`; otherwise dev mode logs magic links.  
3. From monorepo root: `pnpm install`.  
4. `pnpm --filter @missing-you/web db:push`  
5. `pnpm --filter @missing-you/web dev`  

## Folders

- `app/[locale]/` — locale-aware pages.  
- `app/api/` — route handlers (BFF).  
- `components/` — app UI.  
- `lib/db`, `lib/hashing`, `lib/blockchain`, `lib/auth` — infrastructure stubs / helpers.  
- `server/actions|repositories|services` — future domain layer.  
- `messages/` — `en.json`, `zh-TW.json` copy.  

## i18n

Locales: `en`, `zh-TW`. Prefix always on (`/en/...`, `/zh-TW/...`). Language switcher: `components/language-switcher.tsx`.


## Auth

- Provider: Email magic-link (`next-auth/providers/email`)
- Adapter: Prisma (`@auth/prisma-adapter`)
- Route handlers: `app/api/auth/[...nextauth]/route.ts`
- Page guards: `lib/auth/page-guards.ts`
- API guards: `lib/auth/route-guards.ts`
