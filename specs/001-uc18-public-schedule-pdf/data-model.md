# Data Model - UC-18 Public Schedule PDF

## Entity: PublicScheduleAvailability
- Fields:
  - `conference_id` (string, required)
  - `schedule_status` (enum: `published`, `unpublished`)
  - `checked_at` (datetime, required)
- Validation rules:
  - Public final schedule payloads served only when `schedule_status = published`.
  - Unpublished status returns not-available response with no final schedule content.

## Entity: PublishedSchedule
- Fields:
  - `schedule_id` (string, immutable)
  - `conference_id` (string, required)
  - `published_at` (datetime, required)
  - `days` (array<object>, required)
  - `entries` (array<object>, required)
- Validation rules:
  - Must include day/session grouping and core fields (time/location).
  - Content remains stable across refresh and return visits unless republished externally.

## Entity: ScheduleEntry
- Fields:
  - `entry_id` (string, immutable)
  - `schedule_id` (string, required)
  - `day_label` (string, required)
  - `session_label` (string, required)
  - `title` (string, required)
  - `time_range` (string, required)
  - `location` (string, required)
  - `optional_fields` (object, nullable)
- Validation rules:
  - Required core fields must be present for public display.
  - Optional fields may be unavailable and should be marked as unavailable in details.

## Entity: ScheduleDetailProjection
- Fields:
  - `entry_id` (string, required)
  - `visible_fields` (object, required)
  - `restricted_fields` (array<string>, required)
  - `unavailable_fields` (array<string>, required)
- Validation rules:
  - Restricted fields are omitted from visible fields.
  - Non-restricted fields remain visible even when some fields are restricted.

## Entity: PublicPdfArtifact
- Fields:
  - `artifact_id` (string, immutable)
  - `schedule_id` (string, required)
  - `format` (enum: `pdf`)
  - `generated_at` (datetime, required)
  - `download_url` (string, required)
- Validation rules:
  - View and export document format must be PDF.

## Entity: ScheduleAccessOutcome
- Fields:
  - `request_type` (enum: `view_schedule`, `view_detail`, `view_pdf`, `export_pdf`)
  - `schedule_id` (string, nullable)
  - `outcome` (enum: `success`, `not_available`, `retrieval_error`)
  - `error_code` (string, nullable)
  - `occurred_at` (datetime, required)

## Relationships
- `PublicScheduleAvailability` gates access to `PublishedSchedule` and `PublicPdfArtifact`.
- `PublishedSchedule` 1-to-many `ScheduleEntry`.
- `ScheduleEntry` 1-to-1 `ScheduleDetailProjection` per public detail response context.
- `PublishedSchedule` 1-to-many `PublicPdfArtifact` versions over time.

## State Transitions
- `unpublished -> published`
  - Trigger: schedule publication in scheduling workflow.
  - Effects: public schedule + PDF endpoints become available.
- `published access -> success`
  - Effects: return grouped schedule/details/PDF according to endpoint.
- `published access -> retrieval_error`
  - Effects: return system error with no schedule content.
- `published -> unpublished` (outside UC-18 lifecycle control)
  - Effects: future public requests return not-available response.
