# Architecture

## Monorepo layout

| Path | Role |
|------|------|
| `apps/web` | **Next.js (App Router)** — UI, **i18n**, and **BFF** (Route Handlers). No separate API service in MVP. |
| `packages/shared` | Shared **TypeScript** types, **Zod** schemas, locale constants, chain + ABI helpers. |
| `packages/ui` | Shared **React** primitives (shadcn-style **CVA** buttons, layout shell). |
| `packages/contracts` | **Foundry** project — `MemoryRegistry.sol` stores commitments, not journal bodies. |
| `docs/` | Product and engineering notes. |

## Off-chain vs on-chain

- **Off-chain (PostgreSQL):** `Journal.content` (full text), optional `person`, `privacy`, `status`, `memoryId` (UUID string for this MVP), timestamps. This is the **source of truth** for readable content.
- **On-chain (`MemoryRegistry`):** `memoryId` as **bytes32**, `contentHash` as **bytes32**, owner, timestamps, shareable flag — **not** the journal prose.
- **Bridge table (PostgreSQL):** `MemoryAnchor` stores `contentHash`, `txHash`, `chainId`, `contractAddress`, and links 1:1 to `Journal` after a validated on-chain transaction.

## BFF layering (`apps/web`)

| Layer | Responsibility |
|-------|------------------|
| `app/api/**/route.ts` | HTTP orchestration, parse body, map service errors to status codes; optional **per-user rate limits** (`lib/rate-limit/`). |
| `server/services/*` | Validation (Zod), hashing, anchor prep, verification helpers. |
| `server/repositories/*` | Prisma reads/writes only. |
| `lib/hashing/*` | Canonical JSON builder + **SHA-256** hex digest (must stay aligned with contract checks). |
| `lib/db/*` | Prisma client singleton. |
| `lib/rate-limit/*` | In-process fixed-window limits for sensitive POST routes (see `docs/security-and-hardening.md`). |

## Why Next.js is the BFF

**Route Handlers** keep secrets and hashing on the server, share types with `@missing-you/shared`, and avoid shipping DB credentials to the browser. Server Actions can be added later for the same services without changing repositories.

## Canonical payload & hashing

Canonical objects are built in **`apps/web/lib/hashing/canonical.ts`** with **fixed key order** (`version`, `content`, `person`, `createdAt`, `memoryId`), **no `undefined`** (use `null` for empty `person`), and **trimmed** strings. The shared package exposes **`canonicalPayloadSchema`** so the shape stays documented and parseable in one place.

The BFF hashes **`JSON.stringify(payload)`** with **Node `crypto` SHA-256**, returning **`0x` + 64 hex** (32 bytes) so it maps cleanly to Solidity **`bytes32`**.

> **Contract alignment:** `MemoryRegistry` compares `bytes32` digests. The contract (or an off-chain prover) must hash the **identical UTF-8 bytes** of the same canonical JSON, or you must migrate to an explicit domain-separated scheme and bump `version`.

## Smart contract

`MemoryRegistry` (OpenZeppelin **Ownable** + **Pausable**) exposes `anchorMemory`, `getMemory`, `verifyMemory`, and `setShareable`. The web app submits `anchorMemory` via **wagmi** (wallet); the BFF validates receipts and persists `MemoryAnchor` with `chainId` + `contractAddress`.

Shared ABI and chain helpers: `packages/shared/src/blockchain/`. UUID → on-chain key: `journalUuidToMemoryIdKey` (= `keccak256(utf8(uuid))`).

## Internationalization

**next-intl** provides locale-prefixed routes (`/en/...`, `/zh-TW/...`), message JSON files, and navigation helpers under `apps/web/lib/i18n/`.

## Loading and navigation UX (`apps/web`)

- **`app/[locale]/loading.tsx`:** Default **Suspense** fallback while a new locale-scoped page loads (server transitions).
- **`NavigationProgress`:** Client top bar on **pathname / search** change (works with `next-intl` `Link` / `router`).
- **Client data:** Lists and detail panels use **`LoadingBlock`** + **`Spinner`** while `fetch` to `/api/*` is in flight; forms use **`aria-busy`**, disabled controls, and spinners during submit or wallet actions.
- **Strings:** Shared labels under the `common` key in `apps/web/messages/en.json` and `zh-TW.json` (e.g. `pageLoading`, `navigating`).

## Product-facing surfaces (trust & onboarding)

- First-visit **Memories** dialog (empty list), **Write** collapsible trust panel, **person** grouping on the list, expanded **public memory** copy, **`/privacy-security`** help page — see `docs/technical-system-documentation.md` for detail.
