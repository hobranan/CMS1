# Phase 0 Research: UC-09 Enforce referee workload limits

## Decision 1: Limit is configurable and resolved at validation time

- Decision: Resolve the applicable workload limit from configuration service on
  each assignment validation attempt.
- Rationale: Directly satisfies clarification and FR-003/FR-012.
- Alternatives considered:
  - Static hardcoded limit: rejected because policy must be configurable.

## Decision 2: Threshold semantics are strict

- Decision: Allow assignment only when workload is strictly below the configured
  maximum; reject when equal or above.
- Rationale: Aligns with FR-004/FR-005 and acceptance scenarios.
- Alternatives considered:
  - Allow assignment at exact maximum: rejected by requirements.

## Decision 3: Retrieval failure is fail-closed

- Decision: If workload data cannot be retrieved, reject assignment and return
  system error feedback.
- Rationale: Implements FR-009 and prevents unsafe assignments.
- Alternatives considered:
  - Best-effort assignment without workload check: rejected as non-compliant.

## Decision 4: Storage failure preserves integrity

- Decision: If storage fails after validation, reject attempt and persist no
  assignment changes.
- Rationale: Implements FR-010 and FR-011.
- Alternatives considered:
  - Deferred retry write queue without immediate failure: rejected because user must receive explicit failure.

## Decision 5: Workload count update timing

- Decision: Increment effective workload only after assignment storage commit.
- Rationale: Ensures SC-004 and avoids drift from failed writes.
- Alternatives considered:
  - Pre-emptive increment before commit: rejected due to rollback complexity.

## Decision 6: Concurrency-safe validation

- Decision: Re-evaluate current workload and limit at confirmation time inside
  transactional boundary to handle concurrent updates.
- Rationale: Covers edge case where workload changes between selection and confirm.
- Alternatives considered:
  - UI-snapshot-only validation: rejected due to race conditions.

## Resolved Clarifications

- No unresolved NEEDS CLARIFICATION items remain for Phase 1.
