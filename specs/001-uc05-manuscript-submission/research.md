# Phase 0 Research: UC-05 Submit paper manuscript

## Decision 1: Required metadata fields are fixed and mandatory

- Decision: Require author names, affiliations, contact information, abstract
  text, keywords, and main reference source on every submission.
- Rationale: Matches clarification and FR-003.
- Alternatives considered:
  - Optional metadata subsets: rejected because requirements mark fields as mandatory.

## Decision 2: File acceptance rules enforced pre-finalization

- Decision: Accept only PDF/Word/LaTeX files and reject size above 7 MB before
  any submission finalization.
- Rationale: Satisfies FR-005 and FR-006 while preventing invalid review entries.
- Alternatives considered:
  - Accept and quarantine unsupported files: rejected because requirements demand rejection.

## Decision 3: Validation feedback policy

- Decision: Return actionable field/file errors with either all-errors mode or
  a consistent first-blocking mode, explicitly documented and stable.
- Rationale: Aligns with FR-011 and acceptance scenario behavior.
- Alternatives considered:
  - Inconsistent ad-hoc error precedence: rejected due to unpredictable UX.

## Decision 4: Upload interruption handling

- Decision: If network interruption occurs during upload, return interruption
  status, do not finalize submission, and require user-initiated retry when
  network is available.
- Rationale: Directly implements clarification and FR-015/FR-016.
- Alternatives considered:
  - Auto-resume upload: rejected because clarification specifies manual retry.

## Decision 5: Finalization atomicity

- Decision: Persist metadata and manuscript reference atomically as a finalized
  submission; on any failure, no finalized submission record is produced.
- Rationale: Satisfies FR-012, FR-014, FR-016, FR-017.
- Alternatives considered:
  - Partial save as finalized metadata-only record: rejected because it violates integrity.

## Decision 6: Storage failure behavior

- Decision: On database/storage failure after valid input, show retry-later
  system error and keep submission out of review workflow.
- Rationale: Matches FR-017 and user story 3.
- Alternatives considered:
  - Silent retry loop: rejected because user requires explicit failure visibility.

## Resolved Clarifications

- No unresolved NEEDS CLARIFICATION items remain for Phase 1.
