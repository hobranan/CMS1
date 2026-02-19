# Data Model: UC-09 Enforce referee workload limits

## Entity: Referee

- Purpose: Reviewer entity with effective assignment workload.
- Fields:
  - `id` (UUID, primary key)
  - `name` (string, required)
  - `current_workload` (integer, required, default 0)
  - `updated_at` (datetime, required)
- Validation rules:
  - `current_workload` must be non-negative.

## Entity: WorkloadLimitRule

- Purpose: Configurable limit policy resolved at assignment time.
- Fields:
  - `id` (UUID, primary key)
  - `scope` (string/enum, e.g., conference/track/global)
  - `max_workload` (integer, required)
  - `active_from` (datetime, required)
  - `active_to` (datetime, nullable)
- Validation rules:
  - `max_workload` must be >= 1.
  - Exactly one applicable rule must resolve for each validation context.

## Entity: PaperAssignmentAttempt

- Purpose: Captures one editor attempt to assign a referee.
- Fields:
  - `id` (UUID, primary key)
  - `paper_id` (UUID, required)
  - `referee_id` (UUID, required)
  - `attempted_by_editor_id` (UUID, required)
  - `attempted_at` (datetime, required)
  - `outcome` (enum: `ACCEPTED`, `REJECTED_LIMIT`, `REJECTED_RETRIEVAL_FAILURE`, `REJECTED_STORAGE_FAILURE`)
  - `resolved_limit` (integer, nullable)
  - `resolved_workload` (integer, nullable)
- Validation rules:
  - `ACCEPTED` only when `resolved_workload < resolved_limit`.

## Entity: AssignmentRecord

- Purpose: Persisted referee-paper assignment created after successful validation and storage.
- Fields:
  - `id` (UUID, primary key)
  - `paper_id` (UUID, required)
  - `referee_id` (UUID, required)
  - `created_at` (datetime, required)
- Validation rules:
  - Created only on successful workload validation and successful commit.

## Entity: WorkloadSnapshot

- Purpose: Point-in-time retrieved workload and limit used for assignment decision.
- Fields:
  - `referee_id` (UUID, required)
  - `workload_value` (integer, required)
  - `limit_value` (integer, required)
  - `captured_at` (datetime, required)
- Validation rules:
  - Snapshot exists for every decision that is not retrieval failure.

## State Transitions

1. Validation pass (`workload < limit`) and storage success:
   - `PaperAssignmentAttempt.outcome` -> `ACCEPTED`
   - `AssignmentRecord` created
   - `Referee.current_workload` incremented.
2. Overload (`workload >= limit`):
   - `PaperAssignmentAttempt.outcome` -> `REJECTED_LIMIT`
   - No assignment persisted.
3. Workload retrieval/config resolution failure:
   - `PaperAssignmentAttempt.outcome` -> `REJECTED_RETRIEVAL_FAILURE`
   - No assignment persisted.
4. Storage commit failure after positive validation:
   - `PaperAssignmentAttempt.outcome` -> `REJECTED_STORAGE_FAILURE`
   - No assignment persisted; workload unchanged.
