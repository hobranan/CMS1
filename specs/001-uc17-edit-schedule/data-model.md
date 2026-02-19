# Data Model - UC-17 Edit Schedule

## Entity: ScheduleEditAccess
- Fields:
  - `schedule_id` (string, required)
  - `editor_id` (string, required)
  - `is_authenticated` (boolean, required)
  - `has_edit_permission` (boolean, required)
  - `policy_locked` (boolean, required)
  - `checked_at` (datetime, required)
- Validation rules:
  - Edit mode allowed only when authenticated, authorized, and not policy locked.

## Entity: ConferenceScheduleState
- Fields:
  - `schedule_id` (string, immutable)
  - `status` (enum: `draft`, `published`)
  - `version` (integer, required)
  - `last_edited_at` (datetime, required)
  - `last_edited_by` (string, required)
- Validation rules:
  - Successful save increments `version` and updates `last_edited_at`.
  - Status remains `published` after successful edit unless explicit unpublish flow elsewhere.

## Entity: ScheduleEditSession
- Fields:
  - `edit_session_id` (string, immutable)
  - `schedule_id` (string, required)
  - `editor_id` (string, required)
  - `base_version` (integer, required)
  - `proposed_changes` (object, required)
  - `state` (enum: `active`, `saved`, `cancelled`, `rejected`)
  - `started_at` (datetime, required)
  - `ended_at` (datetime, nullable)
- Validation rules:
  - `cancelled` state performs no persistence changes.
  - Save requires `base_version` match with current schedule version.

## Entity: ConflictValidationResult
- Fields:
  - `validation_id` (string, immutable)
  - `edit_session_id` (string, required)
  - `is_valid` (boolean, required)
  - `conflicts` (array<object>, required)
  - `invalid_references` (array<object>, required)
  - `validated_at` (datetime, required)
- Validation rules:
  - Save allowed only when `is_valid = true` and no blocking conflicts/references.
  - Rejected saves preserve schedule from last committed state.

## Entity: ScheduleSaveOutcome
- Fields:
  - `schedule_id` (string, required)
  - `edit_session_id` (string, required)
  - `outcome` (enum: `saved`, `validation_failed`, `cancelled`, `locked`, `concurrency_conflict`, `db_error`)
  - `error_code` (string, nullable)
  - `occurred_at` (datetime, required)

## Relationships
- `ScheduleEditAccess` governs creation/use of `ScheduleEditSession`.
- `ScheduleEditSession` 1-to-1 latest `ConflictValidationResult` per save attempt.
- `ScheduleEditSession` successful save updates `ConferenceScheduleState`.
- `ScheduleSaveOutcome` records result for each save/cancel attempt.

## State Transitions
- `active -> saved`
  - Preconditions: authorized access, not locked, validation passes, version check passes.
  - Effects: persist schedule updates, update last-edited timestamp and version.
- `active -> rejected` (validation_failed|concurrency_conflict|locked)
  - Effects: no schedule state change; feedback returned.
- `active -> cancelled`
  - Effects: discard unsaved changes; no persistence side effects.
- `active -> rejected` (db_error)
  - Effects: explicit system error; no persisted schedule change.
