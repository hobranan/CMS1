# Phase 0 Research: UC-06 Upload manuscript file

## Decision 1: File-type validation by extension only

- Decision: Validate manuscript type exclusively by file extension, case-insensitive.
- Rationale: Directly implements clarification and FR-003.
- Alternatives considered:
  - MIME/content inspection: rejected because requirement explicitly chooses extension-only.

## Decision 2: Allowed extension set

- Decision: Permit extensions representing PDF, Word, and LaTeX as configured allowed set.
- Rationale: Satisfies FR-004 and acceptance expectations.
- Alternatives considered:
  - Broad document-type acceptance: rejected as outside defined formats.

## Decision 3: Size enforcement

- Decision: Reject any file strictly larger than 7 MB before transfer commit.
- Rationale: Enforces FR-005 and avoids wasted storage work.
- Alternatives considered:
  - Post-upload size rejection only: rejected because it increases needless transfer cost.

## Decision 4: Resume policy for interrupted uploads

- Decision: Support user-initiated retry of same file within 30 minutes, resuming
  from last confirmed uploaded portion; after 30 minutes restart from byte 0.
- Rationale: Exactly matches clarification and FR-013/FR-014.
- Alternatives considered:
  - Always restart uploads: rejected because within-window resume is required.
  - Unlimited resume window: rejected as not aligned with clarified simplicity.

## Decision 5: Attachment state integrity

- Decision: Mark file as attached only after storage success and submission
  association success; otherwise keep unattached state.
- Rationale: Enforces FR-009, FR-016, FR-017 and prevents false-positive attachment.
- Alternatives considered:
  - Mark attached after storage only: rejected due to association failure risk.

## Decision 6: Failure feedback strategy

- Decision: Return explicit actionable errors for unsupported extension, oversize,
  interruption, storage failure, and association failure.
- Rationale: Supports FR-006, FR-007, FR-012, FR-015, FR-016.
- Alternatives considered:
  - Generic upload failure message: rejected as insufficiently actionable.

## Resolved Clarifications

- No unresolved NEEDS CLARIFICATION items remain for Phase 1.
