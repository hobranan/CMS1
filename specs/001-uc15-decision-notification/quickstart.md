# Quickstart - UC-15 Decision Notification

## Goal
Allow owning authors to view final decisions in CMS and retrieve structured decision notifications with summary bullets first and full review content below.

## Validation Scenarios
- Owning author sees Accepted/Rejected decision status and comment.
- Under-review papers return `decisionStatus=under_review` with no final decision details.
- Unauthorized author access returns `403`.
- Notification payload order is fixed: `decision_header -> summary_bullets -> full_review`.
- Summary bullets and full review content come from the same editor decision source.
- Notification delivery failure still exposes CMS decision details as source-of-truth.
- Retrieval failure returns `500` and withholds decision details.
- Missing notification returns `404`.
- Decision visibility persists across repeated requests.
- p95 retrieval latency stays under 400ms in local integration harness.

## Verification Run (Executed)
- `node --test tests/contract/decision-notification/*.spec.js tests/integration/decision-notification/*.spec.js`
  - Result: 13 passed, 0 failed.
- `npm.cmd test`
  - Result: pass (full suite).
- `npm.cmd run lint`
  - Result: pass.

## HTML/CSS Style Profile Check
- Verified views against `docs/standards/html-css-style-profile.md`:
  - `frontend/src/views/decision-notification/paper-decision-view.html`
  - `frontend/src/views/decision-notification/decision-notification-view.html`
  - `frontend/src/views/decision-notification/decision-error-states.html`
- Confirmed semantic containers, lowercase attributes, and no inline styles.
