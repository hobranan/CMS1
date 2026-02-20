# Quickstart - UC-17 Edit Conference Schedule

## Goal
Allow authorized editors/admins to load published schedules in edit mode, save valid changes with optimistic concurrency, and cancel safely.

## Validation Scenarios
- Editable schedule loads for authorized role.
- Valid save updates schedule and returns incremented version.
- Published status remains published after valid save.
- Last-edited timestamp updates on successful save and latest timestamp wins.
- Conflict and invalid-reference saves are rejected with no unintended persistence.
- Policy lock blocks save with explanatory feedback.
- DB save failure returns error and preserves previous schedule state.
- Cancel discards unsaved edits.
- Stale-version concurrent save returns `409`.
- Failure payloads keep stable `code/message` shape.
- Edit load/save p95 remains below 400ms in local harness.

## Verification Run (Executed)
- `node --test tests/contract/schedule-edit/*.test.js tests/integration/schedule-edit/*.test.js`
  - Result: 16 passed, 0 failed.
- `npm.cmd test`
  - Result: pass (full suite).
- `npm.cmd run lint`
  - Result: pass.

## HTML/CSS Style Profile Check
- Verified schedule edit views against `docs/standards/html-css-style-profile.md`:
  - `frontend/src/views/schedule/schedule-edit.html`
  - `frontend/src/views/schedule/schedule-last-edited-view.html`
- Confirmed semantic structure and no inline styles.
