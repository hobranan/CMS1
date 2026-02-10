# Data Model - UC-16 Generate Schedule

## Entity: ScheduleGenerationRequest
- Fields:
  - `request_id` (string, immutable)
  - `conference_id` (string, required)
  - `initiator_id` (string, required)
  - `initiator_role` (enum: `administrator`, `editor`)
  - `trigger_mode` (enum: `manual`)
  - `requested_at` (datetime, required)
- Validation rules:
  - Generation request allowed only for authenticated administrators/editors.
  - `trigger_mode` must be `manual`.

## Entity: ScheduleDraft
- Fields:
  - `draft_id` (string, immutable)
  - `conference_id` (string, required)
  - `status` (enum: `draft`, `published`)
  - `slot_interval_minutes` (integer, required)
  - `slot_count_per_room` (integer, required)
  - `created_at` (datetime, required)
  - `published_at` (datetime, nullable)
- Validation rules:
  - New generation persists as `draft`.
  - Publication requires conflict-free reviewed draft.

## Entity: RoomColumn
- Fields:
  - `column_id` (string, immutable)
  - `draft_id` (string, required)
  - `room_id` (string, required)
  - `column_index` (integer, required)
- Validation rules:
  - Exactly one column per configured room in a draft.

## Entity: TimeSlot
- Fields:
  - `slot_id` (string, immutable)
  - `column_id` (string, required)
  - `slot_sequence` (integer, required)
  - `start_time` (datetime, required)
  - `end_time` (datetime, required)
  - `available` (boolean, required)
- Validation rules:
  - Slot sequences strictly increasing within each room column.
  - Adjacent slots separated by configured interval.
  - Each room column has equal slot counts in initial grid.

## Entity: SessionPlacement
- Fields:
  - `placement_id` (string, immutable)
  - `draft_id` (string, required)
  - `paper_id` (string, required)
  - `slot_id` (string, required)
  - `placement_order_seed` (string, required)
  - `placement_rank` (integer, required)
- Validation rules:
  - Initial placement order derived from randomized ranking per generation.
  - Placement must respect duration and room-availability constraints.

## Entity: ConflictRecord
- Fields:
  - `conflict_id` (string, immutable)
  - `draft_id` (string, required)
  - `conflict_type` (enum: `overlap`, `room_unavailable`, `rule_violation`, `capacity_shortage`)
  - `severity` (enum: `blocking`, `warning`)
  - `details` (string, required)
  - `resolved` (boolean, required)
- Validation rules:
  - Blocking conflicts prevent publication/finalization.
  - Conflicts must be highlighted for manual adjustment workflow.

## Entity: ScheduleGenerationOutcome
- Fields:
  - `request_id` (string, required)
  - `draft_id` (string, nullable)
  - `outcome` (enum: `draft_created`, `blocked_no_accepted_papers`, `blocked_missing_parameters`, `save_failed`)
  - `error_code` (string, nullable)
  - `occurred_at` (datetime, required)

## Relationships
- `ScheduleGenerationRequest` 1-to-1 `ScheduleGenerationOutcome`.
- `ScheduleDraft` 1-to-many `RoomColumn`.
- `RoomColumn` 1-to-many `TimeSlot`.
- `ScheduleDraft` 1-to-many `SessionPlacement`.
- `ScheduleDraft` 1-to-many `ConflictRecord`.

## State Transitions
- `generation request -> draft_created`
  - Preconditions: authenticated admin/editor, accepted papers present, complete parameters.
  - Effects: create room columns + slots, random initial placement, conflicts computed, draft persisted.
- `generation request -> blocked_no_accepted_papers|blocked_missing_parameters`
  - Effects: no draft persisted; actionable feedback returned.
- `draft -> published`
  - Preconditions: explicit publish confirmation and no unresolved blocking conflicts.
  - Effects: status set to `published`, retrievable across sessions.
- `draft -> draft` (publish canceled)
  - Effects: remains non-public and editable.
- `generation request -> save_failed`
  - Effects: system error and no stored schedule.
