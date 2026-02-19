# Data Model - UC-12 Submit Review

## Entity: ReviewDraft
- Fields:
  - `draft_id` (string, immutable)
  - `assignment_id` (string, required)
  - `paper_id` (string, required)
  - `referee_id` (string, required)
  - `required_fields` (object)
  - `validation_state` (enum: `complete`, `incomplete`, `invalid`)
  - `deadline_indicator` (datetime, nullable, informational)
  - `updated_at` (datetime)
- Validation rules:
  - Required fields and allowed value constraints must pass before submit.

## Entity: SubmittedReview
- Fields:
  - `review_id` (string, immutable)
  - `assignment_id` (string, required)
  - `paper_id` (string, required)
  - `referee_id` (string, required)
  - `version_number` (integer, required)
  - `submitted_at` (datetime, required)
  - `content_snapshot` (object, immutable)
  - `status` (enum: `submitted`)
- Validation rules:
  - Submitted content is read-only after commit.
  - Direct edit operations are forbidden.

## Entity: ReviewVersionLink
- Fields:
  - `link_id` (string)
  - `from_review_id` (string, nullable for first submission)
  - `to_review_id` (string, required)
  - `link_order` (integer, required)
- Validation rules:
  - Each newer submission links to latest prior submitted review.
  - Link sequence must be strictly increasing per assignment.

## Entity: AssignmentStatus
- Fields:
  - `assignment_id` (string)
  - `state` (enum: `active`, `completed`, `inactive`)
  - `completed_at` (datetime, nullable)
- Validation rules:
  - Submit allowed only when `state = active`.
  - Successful submit updates state to `completed`.

## Entity: SubmissionAttemptResult
- Fields:
  - `attempt_id` (string)
  - `assignment_id` (string)
  - `outcome` (enum: `success`, `validation_error`, `inactive_assignment`, `db_error`, `notification_failed`, `cancelled`)
  - `error_code` (string, nullable)
  - `occurred_at` (datetime)

## Relationships
- `ReviewDraft` 1-to-many `SubmittedReview` (version history per assignment)
- `SubmittedReview` chained by `ReviewVersionLink`
- `AssignmentStatus` 1-to-many `SubmissionAttemptResult`

## State Transitions
- `draft -> submitted`
  - Preconditions: authenticated referee, active assignment, valid fields.
  - Effects: new immutable submitted record, status completed, editor visibility enabled.
- `draft -> draft` (validation/inactive/cancel/db failure)
  - Effects: no submitted record, assignment/review status unchanged.
- `submitted(vN) -> submitted(vN+1)`
  - Trigger: newer review submission.
  - Effects: new immutable record linked to latest prior submitted version.
- `submitted` with notification failure
  - Effects: submitted record remains committed; referee receives notification-failure message.
