# Security and Hardening Notes (Step 6)

## Completed in this pass

- Added consistent API error envelope with `requestId` and stable `code`.
- Added structured server logging helper for production debugging.
- Hardened route validation:
  - UUID validation for journal IDs
  - strict payload schema for confirm-anchor
  - strict payload schema for shareability updates
- Tightened ownership behavior:
  - non-owner journal access/edit returns not-found semantics in service layer
- Public privacy guard maintained:
  - public memory page only renders shareable entries
  - non-shareable pages return not-found
- Improved tx confirmation checks:
  - receipt success required
  - receipt `to` must match configured MemoryRegistry
  - receipt must include at least one MemoryRegistry log
- Added typed env/config module and production readiness env checks.

## Privacy model (verified)

- Full journal content is never submitted on-chain.
- Canonical payload hash only is used for anchoring.
- Public metadata avoids private content leaks when entry is unavailable.

## API rate limiting (current)

- Per-authenticated-user limits apply to:
  - `POST /api/journals` (create)
  - `POST /api/journals/:id/prepare-anchor`
  - `POST /api/journals/:id/confirm-anchor`
  - `POST /api/account/wallet/link-challenge` and `link-confirm` (shared bucket)
- On exceed: HTTP **429** with JSON `{ code: "RATE_LIMIT" }` and **`Retry-After`** (seconds).
- Implementation: in-process fixed window in `apps/web/lib/rate-limit/` (each Node/serverless instance has its own counters). For **multi-instance production**, use a shared limiter (e.g. Redis / Upstash) so thresholds are global.
- Observability: rate-limit events are logged as structured JSON (`api_rate_limited`).

## Remaining tradeoffs / risks

- Event-level decoding not yet implemented for `anchorMemory` / `setShareable` arg verification.
- Rate limits are not coordinated across horizontally scaled instances unless you add a shared store.
- No audit trail table for visibility or anchor mutation events.
- No automated E2E tests for critical permission paths.

## Recommended next hardening tasks

1. Decode and verify expected contract events in tx receipt.
2. Back rate limiting with a shared store when running multiple app instances.
3. Add append-only audit logs for ownership-sensitive mutations.
4. Add end-to-end security regression tests.
5. Add alerting for repeated tx validation failures.
