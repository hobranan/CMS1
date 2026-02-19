# Phase 0 Research - UC-14 Paper Decision

## Decision 1: Eligibility check timing
- Decision: Decision eligibility is validated at confirmation time using current paper/review state.
- Rationale: Directly aligns with FR-005 and edge case where eligibility can change between selection and confirmation.
- Alternatives considered: Validate only at decision-option display time (rejected: stale state risk), validate only at final save call without user-facing check (rejected: weaker UX predictability).

## Decision 2: Completed review prerequisite and policy override
- Decision: Default behavior blocks decision when no completed reviews; optional override is controlled by explicit policy flag read during eligibility validation.
- Rationale: Meets FR-006 while preserving the stated policy-based exception.
- Alternatives considered: Always require completed reviews (rejected: ignores policy exception), always allow without reviews (rejected: violates guardrail intent).

## Decision 3: Save consistency model
- Decision: Decision record creation and paper status update execute as one atomic persistence action.
- Rationale: Satisfies FR-009 and FR-010 by preventing partial commits.
- Alternatives considered: Sequential independent writes (rejected: inconsistency risk), eventual status sync job (rejected: delayed correctness).

## Decision 4: Notification failure semantics
- Decision: Notification runs after successful atomic save; notification failure does not roll back stored decision/status and returns explicit failure feedback.
- Rationale: Matches FR-011 and FR-012 while protecting finalized editorial outcomes.
- Alternatives considered: Roll back decision on notification failure (rejected: destroys valid saved decision), suppress notification failures (rejected: lacks required feedback).

## Decision 5: Cancellation behavior
- Decision: Cancel before confirmation performs no persistence and leaves paper status/decision unchanged.
- Rationale: Required by FR-008 and SC-003.
- Alternatives considered: Auto-save draft decision intent (rejected: out of scope and risks accidental transitions).

## Decision 6: Concurrent decision attempts
- Decision: First confirmed successful decision finalizes paper; later concurrent attempts receive conflict/ineligible response due to already-decided state.
- Rationale: Consistent with FR-007 and edge-case concurrency handling.
- Alternatives considered: Last-write-wins overwrite (rejected: unsafe and non-deterministic), queue both and require manual reconciliation (rejected: unnecessary complexity).
