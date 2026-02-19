# Phase 0 Research: UC-08 Assign paper referees

## Decision 1: Enforce assignment cardinality at confirmation

- Decision: Require one to three selected referees for each assignment action.
- Rationale: Supports conference policy and FR-004/FR-005 behavior.
- Alternatives considered:
  - Allow zero-referee confirmation: rejected as not meaningful assignment.
  - Allow more than three: rejected by rule constraint.

## Decision 2: Eligibility and workload checks are pre-commit gates

- Decision: Validate referee eligibility and workload status for all selections
  before persistence.
- Rationale: Aligns with FR-006 through FR-008 and avoids rollback from preventable invalid requests.
- Alternatives considered:
  - Post-persistence validation cleanup: rejected due to integrity risk.

## Decision 3: All-or-nothing transaction policy

- Decision: Persist assignments and trigger invitations in one transactional
  workflow; if invitation step fails, rollback assignment state.
- Rationale: Directly enforces clarification and FR-013/FR-014.
- Alternatives considered:
  - Keep assignment when invitation fails: rejected as partial outcome.

## Decision 4: Failure feedback strategy

- Decision: Return explicit, selection-level messages for max-referee, ineligible,
  and workload-exceeded rules; return retry guidance for system failures.
- Rationale: Implements FR-005, FR-008, FR-015 with actionable correction paths.
- Alternatives considered:
  - Generic error only: rejected as insufficient for editor correction.

## Decision 5: Concurrency handling

- Decision: Re-check workload and paper assignment lock at confirmation time to
  handle stale selections and concurrent editor attempts.
- Rationale: Covers edge case where state changes between selection and confirm.
- Alternatives considered:
  - Trust initial UI snapshot: rejected due to race-condition risk.

## Resolved Clarifications

- No unresolved NEEDS CLARIFICATION items remain for Phase 1.
