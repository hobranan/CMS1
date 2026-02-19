# Phase 0 Research - UC-20 Online Payment

## Decision 1: Initiation eligibility gate
- Decision: Payment initiation is allowed only for authenticated attendees with a selected registration category and unpaid registration state.
- Rationale: Enforces FR-001 and prevents invalid/duplicate initiation paths.
- Alternatives considered: Allow initiation before category selection (rejected: pricing ambiguity), allow paid users to re-initiate by default (rejected: duplicate-payment risk).

## Decision 2: Gateway confirmation trust boundary
- Decision: Registration status changes to Paid/Confirmed only after verified gateway success and successful internal payment record persistence.
- Rationale: Required by FR-004 and FR-005; protects against false confirmation.
- Alternatives considered: Mark confirmed immediately on redirect return (rejected: spoof/timeout risk), mark confirmed before DB commit (rejected: inconsistency risk).

## Decision 3: Decline/cancel/invalid-detail handling
- Decision: Gateway cancel, invalid details, and provider decline all end with unpaid registration state and explicit attendee feedback.
- Rationale: Satisfies FR-008 through FR-010 and SC-002.
- Alternatives considered: Pending state for all non-success responses (rejected: overstates unresolved cases), silent failure (rejected: poor UX and supportability).

## Decision 4: Timeout/missing-confirmation flow
- Decision: Missing confirmation or callback timeout enters unresolved pending/failed messaging state and blocks Paid/Confirmed status until explicit resolution.
- Rationale: Aligns with FR-011 and SC-003.
- Alternatives considered: Auto-confirm after timeout window (rejected: false positives), auto-fail permanently without recovery path (rejected: ignores delayed callbacks).

## Decision 5: Save-failure reconciliation
- Decision: If gateway success cannot be persisted, registration remains unconfirmed, error is shown, and reconciliation item is created for follow-up.
- Rationale: Meets FR-012 and SC-004 while preserving integrity.
- Alternatives considered: Retry indefinitely before response (rejected: latency/unbounded failures), mark confirmed without payment record (rejected: audit failure).
