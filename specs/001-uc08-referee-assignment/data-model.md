# Data Model: UC-08 Assign paper referees

## Entity: Paper

- Purpose: Submitted paper awaiting referee assignment.
- Fields:
  - `id` (UUID, primary key)
  - `status` (enum: `SUBMITTED`, `ASSIGNMENT_IN_PROGRESS`, `ASSIGNED`)
  - `title` (string, required)
  - `updated_at` (datetime, required)
- Validation rules:
  - Assignment allowed only when paper is assignment-eligible.

## Entity: Referee

- Purpose: Reviewer candidate available for assignment.
- Fields:
  - `id` (UUID, primary key)
  - `name` (string, required)
  - `eligible` (boolean, required)
  - `current_workload` (integer, required)
  - `max_workload` (integer, required)
- Validation rules:
  - Assignment requires `eligible=true` and `current_workload < max_workload`.

## Entity: AssignmentSet

- Purpose: Proposed referee set selected for one paper confirmation action.
- Fields:
  - `id` (UUID, primary key)
  - `paper_id` (UUID, required)
  - `editor_user_id` (UUID, required)
  - `selected_referee_ids` (array<UUID>, required)
  - `status` (enum: `PENDING`, `FINALIZED`, `ROLLED_BACK`)
  - `created_at` (datetime, required)
- Validation rules:
  - Count of selected referees must be between 1 and 3.
  - Duplicate referee IDs are not allowed.

## Entity: PaperRefereeAssignment

- Purpose: Persisted referee-to-paper assignment record.
- Fields:
  - `id` (UUID, primary key)
  - `paper_id` (UUID, required)
  - `referee_id` (UUID, required)
  - `assigned_at` (datetime, required)
- Validation rules:
  - Created only after all assignment-set validations pass.

## Entity: ReviewInvitation

- Purpose: Notification record for assigned referee invitation.
- Fields:
  - `id` (UUID, primary key)
  - `paper_id` (UUID, required)
  - `referee_id` (UUID, required)
  - `status` (enum: `SENT`, `FAILED`)
  - `sent_at` (datetime, nullable)
- Validation rules:
  - Assignment finalization requires all invitation statuses `SENT`.

## Entity: AssignmentTransactionResult

- Purpose: Captures atomic transaction outcome.
- Fields:
  - `assignment_set_id` (UUID, required)
  - `result` (enum: `SUCCESS`, `VALIDATION_FAILED`, `SYSTEM_FAILED`, `ROLLED_BACK`)
  - `error_details` (array<string>, nullable)

## State Transitions

1. Editor confirms valid selection (1..3 referees):
   - `AssignmentSet.status` -> `PENDING`
   - validations run for eligibility/workload/concurrency.
2. Validation failure:
   - `AssignmentTransactionResult.result` -> `VALIDATION_FAILED`
   - no `PaperRefereeAssignment` records written.
3. Persistence failure:
   - `AssignmentTransactionResult.result` -> `SYSTEM_FAILED`
   - assignment unchanged.
4. Invitation failure after assignments prepared:
   - rollback persisted assignment writes
   - `AssignmentSet.status` -> `ROLLED_BACK`
   - no partial assignments remain.
5. Full success:
   - all assignments written, all invitations sent
   - `AssignmentSet.status` -> `FINALIZED`
   - paper status updated to `ASSIGNED`.
