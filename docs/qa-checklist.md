# QA Checklist

## Core flows

- [ ] Sign in via email magic link and reach `/memories`.
- [ ] Create journal from `/write` and verify it appears in dashboard.
- [ ] Edit draft journal content/person/privacy as owner.
- [ ] Prepare + anchor memory with wallet connected.
- [ ] Confirm anchored journal shows tx hash and verification state.
- [ ] Open public share page for `privacy=share` memory.
- [ ] Ensure non-shareable memory public URL returns not found.
- [ ] Verify memory info (hash, chain, tx, anchored time) renders correctly.

## Access control and privacy

- [ ] Private journal is inaccessible to another signed-in user.
- [ ] `/settings` is inaccessible when unauthenticated.
- [ ] `prepare-anchor` and `confirm-anchor` fail without auth.
- [ ] Public metadata does not expose private memory content.

## Edge cases

- [ ] Anchor attempt without wallet shows actionable UI error.
- [ ] User rejects wallet tx and UI shows recoverable state.
- [ ] Invalid journal ID in API returns validation error, not crash.
- [ ] Malformed `confirm-anchor` payload returns 400.
- [ ] Shareability toggle on anchored memory requires on-chain tx.

## Localization

- [ ] Switch between `en` and `zh-TW` and confirm copy parity.
- [ ] Dates/timestamps render correctly for both locales.

## Reliability checks

- [ ] `GET /api/health` responds OK.
- [ ] `GET /api/ready` reflects env readiness accurately.
- [ ] Build succeeds with production settings.
