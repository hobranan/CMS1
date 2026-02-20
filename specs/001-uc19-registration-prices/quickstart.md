# Quickstart - UC-19 View Registration Prices

## Goal
Expose published registration categories publicly with final CAD prices, no discount calculations, and stable behavior across guest/authenticated views.

## Validation Scenarios
- Published prices are visible publicly.
- Guest and authenticated users receive identical pricing values.
- Prices use CAD formatting (integer and decimal variants).
- Discount fields are absent and `discountApplied=false`.
- Unpublished pricing returns 404.
- Retrieval failure returns 500 and recovers on subsequent success.
- Incomplete categories include missing-information markers.
- Refresh/revisit keeps consistent payload.
- Public pricing latency p95 remains below 400ms in local harness.

## Verification Run (Executed)
- `node --test tests/contract/public-pricing/*.test.js tests/integration/public-pricing/*.test.js`
  - Result: 12 passed, 0 failed.
- `npm.cmd test`
  - Result: pass (full suite).
- `npm.cmd run lint`
  - Result: pass.

## HTML/CSS Style Profile Check
- Verified pricing views against `docs/standards/html-css-style-profile.md`:
  - `frontend/src/views/public-pricing/registration-prices.html`
  - `frontend/src/views/public-pricing/registration-prices-unavailable.html`
  - `frontend/src/views/public-pricing/registration-prices-missing-info.html`
- Confirmed semantic structure and no inline styles.
