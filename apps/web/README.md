# `@missing-you/web`

Next.js **App Router** application: **frontend + BFF** (Route Handlers, Server Actions). Uses **Tailwind**, **next-intl**, **wagmi/viem**, and **Prisma**.

## Local setup

1. `cp .env.example .env.local` and set `DATABASE_URL`.  
2. From monorepo root: `pnpm install`.  
3. `pnpm --filter @missing-you/web db:push`  
4. `pnpm --filter @missing-you/web dev`  

## Folders

- `app/[locale]/` — locale-aware pages.  
- `app/api/` — route handlers (BFF).  
- `components/` — app UI.  
- `lib/db`, `lib/hashing`, `lib/blockchain`, `lib/auth` — infrastructure stubs / helpers.  
- `server/actions|repositories|services` — future domain layer.  
- `messages/` — `en.json`, `zh-TW.json` copy.  

## i18n

Locales: `en`, `zh-TW`. Prefix always on (`/en/...`, `/zh-TW/...`). Language switcher: `components/language-switcher.tsx`.
