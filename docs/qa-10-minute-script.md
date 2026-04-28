# 10-Minute QA Script (Exact Steps)

This script is for fast end-to-end validation of Missing You in local dev.

Expected setup before starting:

- App running: `pnpm --filter @missing-you/web dev`
- PostgreSQL running
- Migrations applied
- Seed data optional (`pnpm --filter @missing-you/web db:seed`)

---

## Minute 0-1: Open app + health checks

1. Open `http://localhost:3000/en`
2. Open `http://localhost:3000/api/health` in a new tab
   - Expect JSON with `ok: true`
3. Open `http://localhost:3000/api/ready`
   - Expect `ready: true` (or clear missing env list if not fully configured)

Pass criteria:

- App loads without runtime errors
- Health endpoints respond successfully

---

## Minute 1-2: Sign-in flow

1. Go to `/en/sign-in`
2. Enter test email (e.g. `qa@example.com`)
3. Submit
4. If SMTP is not configured, open terminal logs and use printed magic link

Pass criteria:

- User can authenticate and access protected pages
- No crash or blank screen

---

## Minute 2-4: Write and save memory

1. Open `/en/write`
2. Enter content:
   - `I remember your laugh when it rained.`
3. Enter person:
   - `Grandma`
4. Set privacy to `Private`
5. Save
6. Click to memories page

Pass criteria:

- Save success message appears
- New entry appears in `/en/memories`

---

## Minute 4-5: Owner detail page checks

1. Open the new item in `/en/journal/:id`
2. Confirm sections render:
   - content
   - person
   - visibility/shareability controls
   - verification panel

Pass criteria:

- No missing data or UI error
- Journal state displays clearly (`draft` expected)

---

## Minute 5-6: Public share privacy guard

1. Keep current journal as `private`
2. Open `/en/memory/:id` in incognito/private window

Pass criteria:

- Private memory is not publicly visible (not found / denied behavior)

---

## Minute 6-8: Shareability toggle + public page

1. In owner page, set visibility to shareable
2. Reopen `/en/memory/:id` in incognito
3. Confirm public page shows:
   - content
   - created date
   - person (if set)
   - verification/proof section

Pass criteria:

- Public page becomes accessible only after shareable toggle
- Content and metadata are rendered correctly

---

## Minute 8-9: Anchor flow smoke test

1. Connect wallet in header
2. Use draft memory and click Anchor
3. Confirm wallet prompts and transaction submission
4. Wait for confirmation path to complete

Pass criteria:

- TX hash appears
- Status transitions to anchored
- No unhandled error

---

## Minute 9-10: Verification + localization check

1. On memory detail page, confirm:
   - content hash shown
   - tx hash shown
   - chain/network shown
   - verification state shown
2. Switch locale from `en` to `zh-TW`
3. Recheck core labels/pages

Pass criteria:

- Verification UI is complete and consistent
- Localization switch works and content remains accessible

---

## Fail-fast checklist

If any of these fail, stop and fix before release:

- Sign-in cannot complete
- Private memory visible publicly
- Anchor flow fails silently
- Verification panel missing hash/tx/chain details
- `/api/health` or `/api/ready` failing unexpectedly

