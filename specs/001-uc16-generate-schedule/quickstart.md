# Quickstart - UC-16 Generate Conference Schedule

## Goal
Allow authorized admin/editor users to manually generate a draft schedule, review it, and publish it when blocking conflicts are resolved.

## Validation Scenarios
- Manual generate creates a draft from accepted papers.
- Generated draft includes one column per room and equal sequential slot counts.
- Different seeds produce different initial paper ordering.
- Publish succeeds only when `confirm=true` and no blocking conflicts exist.
- Cancel publish keeps draft unpublished.
- No accepted papers blocks generation.
- Missing schedule parameters blocks generation.
- Save failure returns 500 with no stored draft.
- Published schedule remains available across repeated retrieval.
- `GET /schedule` returns 404 when unpublished.
- Generation latency p95 remains under 400ms in local harness.

## Verification Run (Executed)
- `node --test tests/contract/schedule/*.test.js tests/integration/schedule/*.test.js`
  - Result: 16 passed, 0 failed.
- `npm.cmd test`
  - Result: pass (full suite).
- `npm.cmd run lint`
  - Result: pass.

## HTML/CSS Style Profile Check
- Verified schedule views against `docs/standards/html-css-style-profile.md`:
  - `frontend/src/views/schedule/schedule-draft.html`
  - `frontend/src/views/schedule/schedule-grid-view.html`
- Confirmed semantic section structure and no inline style usage.
