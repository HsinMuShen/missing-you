# MVP Audit Checklist

## Validation

- [ ] All route params validated (UUID / schema)
- [ ] All JSON bodies validated with zod
- [ ] Invalid payloads return stable error shape

## Access control

- [ ] Private journals inaccessible to non-owner
- [ ] Owner-only routes (`prepare-anchor`, `confirm-anchor`, settings) require auth
- [ ] Public share route renders only `privacy=share`

## Privacy

- [ ] No journal content stored on-chain
- [ ] Metadata for unavailable memory does not leak private content

## Blockchain

- [ ] Confirmed tx receipt has `success` status
- [ ] Receipt target contract matches configured registry
- [ ] Receipt includes registry logs
- [ ] Chain ID and contract address match configured environment

## Operations

- [ ] `/api/health` and `/api/ready` monitored
- [ ] Required env vars set in deploy platform
- [ ] Migrations applied before traffic switch

## Reliability gaps (known)

- [ ] Add rate limiting
- [ ] Add event arg decoding for tx confirmation
- [ ] Add E2E regression tests for auth/privacy boundaries
