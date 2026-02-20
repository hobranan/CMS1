# Quickstart - UC-18 Public Schedule PDF

## Goal
Provide public, unauthenticated access to published conference schedule views and PDF artifacts, with safe handling for unpublished and retrieval-failure states.

## Validation Scenarios
- Published public schedule loads without authentication.
- Unpublished schedule returns 404 not-available response.
- Public entry detail loads and supports unavailable-field markers.
- Restriction policy hides restricted fields and keeps allowed fields visible.
- PDF endpoint supports both inline and attachment dispositions.
- PDF and schedule retrieval failures return 500 with safe error payloads.
- Entry-not-found returns 404.
- Direct-link and refresh remain stable.
- High-volume PDF access remains stable.

## Verification Run (Executed)
- `node --test tests/contract/public-schedule/*.test.js tests/integration/public-schedule/*.test.js`
  - Result: 15 passed, 0 failed.
- `npm.cmd test`
  - Result: pass (full suite).
- `npm.cmd run lint`
  - Result: pass.

## HTML/CSS Style Profile Check
- Verified public schedule views against `docs/standards/html-css-style-profile.md`:
  - `frontend/src/views/public-schedule/public-schedule.html`
  - `frontend/src/views/public-schedule/public-schedule-unavailable.html`
  - `frontend/src/views/public-schedule/public-schedule-detail.html`
  - `frontend/src/views/public-schedule/public-schedule-detail-policy-notes.html`
- Confirmed semantic structure and no inline styles.
