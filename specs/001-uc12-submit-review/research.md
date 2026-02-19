# Phase 0 Research - UC-12 Submit Review

## Decision 1: Deadline semantics
- Decision: Deadline is displayed as informational metadata only and never blocks submission or changes validation behavior.
- Rationale: Matches explicit clarification and FR-005/FR-006.
- Alternatives considered: Hard deadline enforcement (rejected: contradicts clarification), soft warning with partial blocking (rejected: behavior ambiguity).

## Decision 2: Submission eligibility
- Decision: Submission is allowed only for authenticated referees with active assignment and valid required fields.
- Rationale: Aligns with FR-001 through FR-004 and preserves workflow integrity.
- Alternatives considered: Allow inactive-assignment submit with warning (rejected: invalid workflow state).

## Decision 3: Immutability model
- Decision: Submitted reviews are immutable records; direct edits to submitted versions are blocked.
- Rationale: Required by FR-010 and SC-003 for auditability.
- Alternatives considered: Editable submitted record with audit log (rejected: conflicts with explicit immutability rule).

## Decision 4: Newer review version chaining
- Decision: A newer submission creates a new submitted record linked to the latest submitted version for the same assignment.
- Rationale: Satisfies FR-011/FR-012 and supports controlled post-submit updates.
- Alternatives considered: Overwrite existing submitted review (rejected: breaks history), free-form branching tree (rejected: unnecessary complexity).

## Decision 5: Failure handling
- Decision: Database save failure leaves review in draft and assignment/review status unchanged; notification failure after commit does not roll back submitted state.
- Rationale: Meets FR-013/FR-014 while preserving data integrity.
- Alternatives considered: Rollback committed review on notification failure (rejected: loses valid decision).

## Decision 6: Cancel behavior
- Decision: Cancel before final confirmation performs no persistence and keeps review in draft.
- Rationale: Aligns with FR-015 and avoids unintended state transitions.
- Alternatives considered: Auto-save on cancel submit flow (rejected: out of scope for submit confirmation semantics).
