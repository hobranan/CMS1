# Quickstart - UC-10 Invitation Response

## Goal
Deliver invitation accept/reject behavior with 14-day expiry enforcement, actionable-state validation, safe failure handling, and assignment activation on acceptance.

## Prerequisites
- Project dependencies installed
- Test command available: `npm test && npm run lint`
- UC artifacts present: `UC-10.md`, `UC-10-AT.md`

## Implementation Steps
1. Add invitation response controller endpoints in backend API.
2. Implement model/service validation for actionable invitations:
   - authenticated referee
   - invitation still pending
   - not expired (`now < issued_at + 14 days`)
   - not withdrawn or already responded.
3. Persist accepted/rejected response and invitation status atomically.
4. Activate review assignment only for accepted responses.
5. Attempt notification after successful persistence.
6. If notification fails, keep response committed and return notification-failure feedback.
7. On database/persistence failure, keep invitation status unchanged and return system error.
8. Update frontend invitation list/detail controller+views to show actions only for actionable pending invitations.

## Validation Scenarios
- Accept pending invitation -> status `accepted`, assignment active.
- Reject pending invitation -> status `rejected`, assignment inactive.
- Response at exactly 14-day boundary -> blocked as expired.
- Withdrawn/already-responded invitation -> blocked with no mutation.
- Cancel before confirmation -> no changes.
- DB failure on submit -> no response recorded, status remains pending.
- Notification failure post-commit -> response remains recorded, failure feedback shown.

## Verification
- Run `npm test && npm run lint`.
- Execute integration/contract tests for scenarios above, including concurrent multi-session response attempts.

## Automated test execution

```bash
node --test tests/contract/invitations/*.test.js tests/integration/invitations/*.test.js
```

Expected:
- All UC-10 invitation contract and integration tests pass.

## Style profile verification (HTML/CSS subset)

- Verified `frontend/src/views/invitation-list.html` against `docs/standards/html-css-style-profile.md`.
- Confirmed semantic section structure, lower-case tags, and no inline style/script usage.

## Verification notes

- SC-003 evidence:
  - `tests/contract/invitations/post-invitation-response-expiry-boundary.contract.test.js`
- SC-005 evidence:
  - `tests/contract/invitations/post-invitation-response-db-failure.contract.test.js`
  - `tests/contract/invitations/post-invitation-response-notification-failure.contract.test.js`
  - `tests/integration/invitations/failure-integrity.integration.test.js`
- Performance evidence:
  - `tests/integration/invitations/invitation-response-performance.integration.test.js` verifies p95 < 300ms.
