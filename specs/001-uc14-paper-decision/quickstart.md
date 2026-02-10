# Quickstart - UC-14 Paper Decision

## Goal
Allow authorized editors to record final Accept/Reject decisions for eligible papers with confirmation-time validation and consistent failure handling.

## Prerequisites
- Dependencies installed
- Test command available: `npm test && npm run lint`
- UC files present: `UC-14.md`, `UC-14-AT.md`

## Implementation Steps
1. Add decision action on eligible paper details for authenticated authorized editors.
2. Display completed reviews and decision options (Accept, Reject) with optional comment input.
3. Require explicit confirmation before decision persistence.
4. Re-validate eligibility at confirmation time:
   - authenticated + authorized editor
   - completed reviews present unless override policy allows bypass
   - paper not already decided
   - decision period open.
5. On valid confirmation, persist decision record and update paper status atomically.
6. On cancel before confirmation, perform no persistence and keep paper status unchanged.
7. On save failure, return system error and keep paper status unchanged.
8. After successful save, attempt author notification.
9. If notification fails, keep decision/status committed and return notification-failure feedback.
10. Prevent concurrent late decision overwrite by returning conflict/ineligible outcome for already finalized papers.

## Validation Scenarios
- Eligible paper + confirm Accept -> decision stored, status Accepted, confirmation shown.
- Eligible paper + confirm Reject -> decision stored, status Rejected, confirmation shown.
- No completed reviews (without override) -> blocked with explanatory feedback.
- Already decided paper or closed decision period -> blocked with explanatory feedback.
- Cancel before confirmation -> no decision/status change.
- Save failure -> explicit error, no status change.
- Notification failure after save -> decision remains stored, editor informed.
- Refresh/new session after success -> decision/status persist.
- Concurrent near-simultaneous decisions -> first succeeds, later attempt blocked.

## Verification
- Run `npm test && npm run lint`.
- Execute contract/integration tests for eligibility, persistence consistency, cancellation, and failure-handling paths.
