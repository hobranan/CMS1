# Phase 0 Research - UC-16 Generate Schedule

## Decision 1: Generation trigger model
- Decision: Schedule generation starts only from explicit manual administrator/editor action and never on automatic background events.
- Rationale: Enforces FR-001 and FR-002 with unambiguous operator control.
- Alternatives considered: Automatic regeneration on accepted-paper updates (rejected: conflicts with manual-action clarification), timed batch generation (rejected: not requested by UC-16).

## Decision 2: Initial grid structure
- Decision: Create one room column per configured room, each with the same slot count and sequential slot boundaries separated by configured interval.
- Rationale: Required by FR-006 through FR-009 and clarification on uniform room-column slot structure.
- Alternatives considered: Variable slot count by room (rejected: conflicts with equal-slot requirement), non-column room representation (rejected: conflicts with clarification).

## Decision 3: Initial placement randomization
- Decision: Apply randomized ordering once per generation run before assigning sessions into available sequential slots.
- Rationale: Satisfies FR-010 while keeping deterministic schedule topology (columns/slots) intact.
- Alternatives considered: Fixed deterministic ordering (rejected: violates random-order requirement), repeated re-randomization after manual edits (rejected: disrupts editor adjustments).

## Decision 4: Validation and blocking behavior
- Decision: Block generation when accepted papers are absent or required parameters are incomplete, returning explicit actionable feedback.
- Rationale: Aligns with FR-004, FR-005, and SC-003.
- Alternatives considered: Generate empty/partial draft with warnings (rejected: creates unusable baseline), defer validation until publish (rejected: late failure, poor workflow).

## Decision 5: Conflict handling and finalization
- Decision: Detect conflicts during generation, persist them with draft, highlight in UI, and block publication/finalization until manual resolution.
- Rationale: Enforces FR-011 and FR-012 and matches conflict-focused acceptance scenarios.
- Alternatives considered: Auto-resolve conflicts silently (rejected: hides editorial intent), allow publish with unresolved conflicts (rejected: violates blocking requirement).

## Decision 6: Save/publish state safety
- Decision: Persist successful generation as draft first; publish is explicit confirmation step; save failure results in no stored schedule.
- Rationale: Meets FR-013 through FR-017 and cancellation/error requirements.
- Alternatives considered: Direct publish on generation success (rejected: skips review phase), partial save on failure (rejected: inconsistent schedule state).
