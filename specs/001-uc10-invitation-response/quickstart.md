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
