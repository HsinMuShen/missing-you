# Missing You — product overview

**Missing You** is a bilingual (English / Traditional Chinese) Web3 journaling experience focused on grief, remembrance, and emotional safety. Users write about people they miss; the product emphasizes calm typography, generous whitespace, and trustworthy explanations — not trading or speculation aesthetics.

## What users do

1. Write a journal entry in a gentle editor (future milestone).
2. The **full text** is stored **off-chain** in **PostgreSQL** via the Next.js app’s server layer.
3. A **canonical payload** is built from structured fields (see `@missing-you/shared`).
4. That payload is serialized and **hashed** with **SHA-256** over UTF-8 bytes (see `apps/web/lib/hashing/hash.ts`).
5. The **hash** and **metadata** are **anchored on-chain** through `MemoryRegistry` — **never** the prose itself.
6. Optional **public memory pages** show only what privacy rules allow, plus verification affordances.

## What this is not

- Not DeFi, DAO, NFT minting, or token economics.
- Not a place to store private keys in the browser for server-side anchoring (use wallet signing or a secure relayer pattern when you implement anchoring).

## Locales

- `en` — English  
- `zh-TW` — Traditional Chinese  

Copy lives in `apps/web/messages/` and is loaded through **next-intl**.
