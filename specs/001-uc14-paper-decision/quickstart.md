# Quickstart - UC-14 Paper Decision

## Goal
Allow authorized editors to record a final Accept/Reject decision for a paper, with safe handling for ineligible, save-failure, and notification-failure paths.

## Validation Scenarios
- Successful Accept updates paper status to `accepted`.
- Successful Reject updates paper status to `rejected`.
- Decision is blocked when no completed reviews exist (unless override is explicitly set).
- Decision is blocked when paper is already decided or decision period is closed.
- Cancel before confirm causes no mutation.
- Save failure returns `500` and keeps status unchanged.
- Notification failure keeps committed decision and returns `notificationStatus=failed`.
- Near-simultaneous second decision attempt returns conflict.

## Verification Run (Executed)
- `node --test tests/contract/decisions/*.test.js tests/contract/paper-decision/*.test.js tests/integration/decisions/*.test.js`
  - Result: 11 passed, 0 failed.
- `npm.cmd test`
  - Result: pass (full suite).
- `npm.cmd run lint`
  - Result: pass.

## HTML/CSS Style Profile Check
- Verified `frontend/src/views/paper-decision.html` against `docs/standards/html-css-style-profile.md`:
  - semantic section structure
  - lowercase element/attribute naming
  - no inline style declarations
