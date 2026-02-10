# Phase 0 Research - UC-10 Invitation Response

## Decision 1: Expiry calculation and boundary behavior
- Decision: Invitations expire exactly 14 calendar days after `issued_at`; any response at or after `issued_at + 14 days` is blocked as expired.
- Rationale: Matches clarified requirement and removes ambiguity at the exact boundary.
- Alternatives considered: End-of-day expiry (rejected: timezone ambiguity), business-day window (rejected: mismatched to clarification).

## Decision 2: Actionable-state validation timing
- Decision: Validate actionable state (pending, not expired, not withdrawn, not already responded) both when details are shown and again immediately before persistence.
- Rationale: Prevents stale actions from list/detail race conditions and multi-session conflicts.
- Alternatives considered: Validate only at list load (rejected: stale state risk), validate only after submit (rejected: poor UX feedback timing).

## Decision 3: Cancellation semantics
- Decision: Cancel before confirmation performs no persistence and keeps invitation status unchanged (`pending`).
- Rationale: Aligns with extension 4a and preserves predictable user behavior.
- Alternatives considered: Soft-save draft response (rejected: outside use-case scope).

## Decision 4: Database failure handling
- Decision: If response status update fails, no response record/status mutation is committed; return system error and keep invitation pending.
- Rationale: Guarantees integrity and satisfies FR-012/SC-005.
- Alternatives considered: Partial write with repair job (rejected: temporary inconsistent state).

## Decision 5: Notification failure handling
- Decision: Notification is post-commit; if notification fails, keep recorded response unchanged and return notification-failure message.
- Rationale: Matches FR-013 and avoids rollback of committed business decision.
- Alternatives considered: Roll back response on notification failure (rejected: can discard valid user decision).

## Decision 6: Assignment activation linkage
- Decision: Assignment activation occurs only on accepted responses and only after successful invitation status update to `accepted`.
- Rationale: Keeps assignment visibility consistent with invitation state.
- Alternatives considered: Pre-activate before status update (rejected: transient inconsistency), activate on both accept/reject (rejected: violates requirements).
