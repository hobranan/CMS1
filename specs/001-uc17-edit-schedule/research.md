# Phase 0 Research - UC-17 Edit Schedule

## Decision 1: Published schedule editability
- Decision: Authorized editors can edit and save published schedules; successful edits keep schedule status as published.
- Rationale: Directly required by clarification and FR-003/FR-010.
- Alternatives considered: Lock published schedules for read-only mode (rejected: contradicts clarification), auto-unpublish on any edit (rejected: conflicts with FR-010).

## Decision 2: Last-edited timestamp behavior
- Decision: Last-edited timestamp updates only on successful save commit and is displayed on schedule views as date/time.
- Rationale: Meets FR-009 and avoids misleading recency from failed/canceled edits.
- Alternatives considered: Timestamp on entering edit mode (rejected: inaccurate), timestamp on validation pass before commit (rejected: may still fail save).

## Decision 3: Validation and conflict rejection
- Decision: Server-side validation executes at save time for constraints and references; conflicting/invalid edits are rejected with actionable feedback and no persisted changes.
- Rationale: Satisfies FR-004, FR-005, and FR-006 with authoritative consistency.
- Alternatives considered: Client-only validation (rejected: bypass risk), partial save of valid subset (rejected: unpredictable state).

## Decision 4: Cancel semantics
- Decision: Cancel exits edit session and discards unsaved in-memory modifications with no database writes.
- Rationale: Required by FR-007 and SC-004.
- Alternatives considered: Auto-save on cancel (rejected: violates discard expectation), prompt to save partial draft for this UC (rejected: out of scope).

## Decision 5: Lock-policy enforcement
- Decision: Explicit policy-locked schedules block entering or saving edits and return explanatory feedback.
- Rationale: Aligns with FR-014 and edge-case requirements.
- Alternatives considered: Allow edit but block publish only (rejected: conflicts with explicit edit block), silent lock ignore (rejected: governance and UX risk).

## Decision 6: Concurrency and save failure handling
- Decision: Save uses version-check/optimistic concurrency semantics; stale saves fail with conflict feedback, and database failures persist no changes.
- Rationale: Covers FR-012, SC-005, and concurrent-editor edge cases.
- Alternatives considered: Last-write-wins overwrite (rejected: data loss risk), pessimistic global lock on open (rejected: heavy UX/operational cost).
