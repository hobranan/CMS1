# Phase 0 Research: UC-07 Save submission draft

## Decision 1: Draft persistence is manual-save only

- Decision: Persist draft changes only when user explicitly invokes Save or
  when Submit triggers the same save action pre-validation.
- Rationale: Matches FR-011 and new CHK018 clarification.
- Alternatives considered:
  - Background autosave timer: rejected because explicitly out of scope.

## Decision 2: Save-level validation scope

- Decision: Apply save-level validation for fields required to keep draft
  structurally valid; reject save when save-blocking values are present.
- Rationale: Aligns with FR-003 and FR-004 while allowing incomplete drafts.
- Alternatives considered:
  - No validation at save time: rejected because requirements include save-level checks.

## Decision 3: No-change detection behavior

- Decision: Compare current editable state with last successful persisted state;
  if unchanged, return no-change message and avoid write.
- Rationale: Implements FR-005 efficiently and predictably.
- Alternatives considered:
  - Always write on Save: rejected due to unnecessary writes and unclear feedback.

## Decision 4: Last successful save as authoritative persisted state

- Decision: Failed save attempts (validation/storage/network) do not alter stored
  draft state; only successful saves replace persisted version.
- Rationale: Supports FR-009, FR-010, FR-015 and SC-003 data integrity goals.
- Alternatives considered:
  - Partial overwrite on failure: rejected due to data-loss risk.

## Decision 5: Submit-first-save sequencing

- Decision: Submit action executes save-equivalent persistence first; only then
  runs final submission validation.
- Rationale: Addresses CHK018 clarification while preserving unsaved edits when
  final validation fails.
- Alternatives considered:
  - Validate before saving unsaved edits: rejected because user wants edits preserved.
  - Auto-finalize on save success only: rejected because final validation gate remains required.

## Decision 6: Cross-session retrieval requirements

- Decision: Persist drafts durably with retrieval by author identity so same
  state loads after logout/login.
- Rationale: Implements FR-006 and SC-004.
- Alternatives considered:
  - Session-only draft storage: rejected because it loses drafts across logins.

## Decision 7: Final submission blocking

- Decision: Draft save remains allowed for editable data even when final
  submission eligibility fails; final submit endpoint enforces full validation gate.
- Rationale: Matches FR-012 and FR-013.
- Alternatives considered:
  - Block save until full validation passes: rejected because it defeats draft purpose.

## Resolved Clarifications

- No unresolved NEEDS CLARIFICATION items remain for Phase 1.
