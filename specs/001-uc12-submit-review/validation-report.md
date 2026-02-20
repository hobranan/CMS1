# Validation Report: UC-12 Submit completed review

## Scope

- Feature spec: `specs/001-uc12-submit-review/spec.md`
- Task plan: `specs/001-uc12-submit-review/tasks.md`
- API contract: `specs/001-uc12-submit-review/contracts/submit-review.openapi.yaml`
- Use case docs: `UC-12.md`, `UC-12-AT.md`

## Implemented checks

- Authenticated-referee active-assignment submission gate.
- Required-field and recommendation validation with field-level errors.
- Deadline indicator returned as informational only (`deadlineEnforced=false`).
- Successful submission persistence with assignment transition to completed.
- Submitted review read-only retrieval endpoint.
- Newer submitted version support with `previousReviewId` chain linking.
- Cancel-before-confirm no-mutation pathway.
- DB failure keeps review unsubmitted and assignment unchanged.
- Notification failure preserves committed submission with failed status.
- Editor visibility for authorized submitted reviews.
- Deterministic version-chain integrity checks (monotonic sequence + latest-link invariants).

## Result

- UC-12 contract and integration tests implemented and passing.
- Quickstart updated with verification commands and style-profile notes.
- UC and AT artifacts synchronized with implemented behavior.
