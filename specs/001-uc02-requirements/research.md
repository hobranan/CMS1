# Phase 0 Research: UC-02 Validate user-provided information

## Decision 1: Centralize validation as composable rule sets per form

- Decision: Define form-specific rule metadata (required, format, constraints)
  and execute through shared validation engine.
- Rationale: Keeps behavior consistent across forms while allowing form-specific
  rules, matching FR-001/FR-002/FR-003 assumptions.
- Alternatives considered:
  - Hardcoded per-controller checks: rejected due to duplication and drift risk.
  - Database-only constraints: rejected because UX needs field-specific feedback.

## Decision 2: Validation pipeline order

- Decision: Execute required-field checks first, then format checks, then
  business rules/constraints.
- Rationale: Produces deterministic error ordering and avoids expensive rules on
  obviously missing data.
- Alternatives considered:
  - Fully parallel checks: rejected because ordering/consistency becomes noisy.
  - Business rules first: rejected because dependent fields may be absent.

## Decision 3: Error response contract

- Decision: Return stable error payload with top-level code/message and
  `errors[]` entries containing `field`, `code`, and `message`.
- Rationale: Satisfies FR-005 and acceptance tests requiring clear field-specific
  feedback.
- Alternatives considered:
  - Single generic message: rejected as non-actionable.
  - Free-text only without codes: rejected because clients cannot reliably map.

## Decision 4: Atomic persistence strategy

- Decision: Perform validation fully before persistence; wrap write/update in one
  transaction and rollback on any failure.
- Rationale: Directly enforces FR-006 and AT-UC02-06 no-partial-update behavior.
- Alternatives considered:
  - Best-effort partial writes: rejected because explicitly disallowed.
  - Sequential field saves: rejected because it risks inconsistent state.

## Decision 5: Multi-error reporting mode

- Decision: Default to collecting all validation errors; allow early-stop option
  only where product flow explicitly requires it.
- Rationale: Better correction UX while still compliant with acceptance criteria
  allowing all-errors or first-blocking when consistent.
- Alternatives considered:
  - Always first-blocking only: rejected due to slower correction cycles.

## Decision 6: Authentication and authorization guard

- Decision: Require authenticated user context before validation execution for
  protected forms.
- Rationale: UC-02 precondition requires logged-in user and avoids unnecessary
  validation work for unauthorized requests.
- Alternatives considered:
  - Validate before auth check: rejected because unauthorized requests should fail early.

## Resolved Clarifications

- No unresolved NEEDS CLARIFICATION items remain for Phase 1.
