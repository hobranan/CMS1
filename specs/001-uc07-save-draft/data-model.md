# Data Model: UC-07 Save submission draft

## Entity: SubmissionDraft

- Purpose: Persisted working copy of an in-progress submission.
- Fields:
  - `id` (UUID, primary key)
  - `author_user_id` (UUID, required)
  - `status` (enum: `DRAFT`, `READY_FOR_SUBMISSION`, `SUBMITTED`)
  - `last_saved_at` (datetime, nullable)
  - `version` (integer, required, default 0)
- Validation rules:
  - `SUBMITTED` status cannot be reached until final validation passes.
- Relationships:
  - One-to-one with `DraftFieldState`.
  - One-to-many with `SaveAttempt`.

## Entity: DraftFieldState

- Purpose: Stores editable field values captured at last successful save.
- Fields:
  - `draft_id` (UUID, foreign key)
  - `payload` (object/json, required)
  - `saved_hash` (string, required)
  - `updated_at` (datetime, required)
- Validation rules:
  - Updated only on successful explicit Save or submit-triggered pre-validation save.
  - Represents authoritative persisted state for reloads.

## Entity: SaveAttempt

- Purpose: Auditable record of each save-equivalent persistence request.
- Fields:
  - `id` (UUID, primary key)
  - `draft_id` (UUID, required)
  - `attempt_type` (enum: `MANUAL_SAVE`, `SUBMIT_PREVALIDATION_SAVE`)
  - `attempted_at` (datetime, required)
  - `outcome` (enum: `SAVED`, `NO_CHANGES`, `VALIDATION_FAILED`, `SYSTEM_FAILURE`, `NETWORK_FAILURE`)
  - `message_code` (string, required)
- Validation rules:
  - `SAVED` increments draft `version` and updates `last_saved_at`.
  - Non-`SAVED` outcomes must not alter `DraftFieldState`.

## Entity: DraftValidationResult (application model)

- Purpose: Captures save-level and final-level validation outcomes.
- Fields:
  - `is_valid` (boolean)
  - `errors` (array of `{ field, code, message }`)
  - `scope` (enum: `SAVE_LEVEL`, `FINAL_SUBMISSION_LEVEL`)
- Validation rules:
  - Save-level failures block persistence.
  - Final-level failures block finalization but do not undo a successful pre-validation save.

## Entity: FinalSubmissionEligibility

- Purpose: Represents whether draft is currently eligible for final submission.
- Fields:
  - `draft_id` (UUID, foreign key)
  - `eligible` (boolean)
  - `failed_rules` (array of strings)
  - `evaluated_at` (datetime)
- Validation rules:
  - `eligible = false` must block transition to `SUBMITTED`.
  - Ineligible status does not prevent save-equivalent persistence.

## State Transitions

1. Manual save with changes and valid save-level input:
   - `SaveAttempt.outcome = SAVED`
   - `DraftFieldState` replaced with current editable values.
2. Manual save with no changes:
   - `SaveAttempt.outcome = NO_CHANGES`
   - Draft state unchanged.
3. Save-level validation failure:
   - `SaveAttempt.outcome = VALIDATION_FAILED`
   - Persisted draft unchanged.
4. Storage/network save failure:
   - `SaveAttempt.outcome = SYSTEM_FAILURE` or `NETWORK_FAILURE`
   - Persisted draft unchanged.
5. Submit with unsaved edits:
   - Execute `SUBMIT_PREVALIDATION_SAVE`.
   - If save succeeds, run final validation.
   - If final validation fails, remain in `DRAFT` with newly saved edits retained.
6. Final submission attempt with eligible draft:
   - Transition `SubmissionDraft.status` -> `SUBMITTED`.
