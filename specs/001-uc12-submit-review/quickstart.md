# Quickstart - UC-12 Submit Review

## Goal
Allow referees with active assignments to submit completed reviews, enforce validation, keep submissions immutable, and support newer linked versions.

## Prerequisites
- Dependencies installed
- Test command available: `npm test && npm run lint`
- UC files present: `UC-12.md`, `UC-12-AT.md`

## Implementation Steps
1. Implement review draft retrieval showing deadline as informational only.
2. Add submission endpoint validating:
   - authenticated referee
   - active assignment
   - required fields complete and constraints valid.
3. On success, persist immutable submitted review record and mark assignment/review as completed.
4. Block direct edits to submitted records.
5. Implement newer-version submission as a new submitted record linked to latest prior submitted version.
6. Keep cancel-before-confirmation in draft state with no persistence side effects.
7. On database failure, keep review unsubmitted and status unchanged.
8. On notification failure post-commit, keep submitted record and return notification-failure feedback.

## Validation Scenarios
- Valid complete review + active assignment -> submitted successfully.
- Missing/invalid fields -> blocked with field-level feedback.
- Inactive assignment -> blocked.
- Passed displayed deadline + active assignment -> still accepted.
- Submitted review reopened -> read-only.
- Newer review version submitted -> new immutable record linked to previous latest.
- Cancel before confirm -> draft unchanged.
- DB failure on submit -> no submission persisted.
- Notification failure post-submit -> submission remains committed.

## Verification
- Run `npm test && npm run lint`.
- Execute contract/integration tests for all scenarios above, including sequential newer-version submissions.

## Automated test execution

```bash
node --test tests/contract/reviews/*.test.js tests/integration/reviews/*.test.js tests/integration/review-submission/*.test.js
```

Expected:
- All UC-12 review contract and integration tests pass.

## Style profile verification (HTML/CSS subset)

- Verified `frontend/src/views/review-submit.html` against `docs/standards/html-css-style-profile.md`.
- Confirmed semantic section structure, lower-case tags, and no inline style/script usage.

## Verification notes

- SC-003 evidence:
  - `tests/contract/reviews/get-submitted-review-readonly.contract.test.js` verifies read-only behavior.
- SC-004 evidence:
  - `tests/contract/reviews/post-submit-review-new-version.contract.test.js`
  - `tests/integration/reviews/review-version-chain.integration.test.js`
  - `tests/integration/review-submission/review-chain-integrity.integration.test.js`
- SC-005 evidence:
  - `tests/integration/reviews/deadline-informational-only.integration.test.js` confirms deadline does not block active assignment.
