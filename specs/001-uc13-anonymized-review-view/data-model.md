# Data Model - UC-13 Anonymized Review View

## Entity: PaperReviewAccess
- Fields:
  - `paper_id` (string, required)
  - `editor_id` (string, required)
  - `authorized` (boolean, required)
  - `checked_at` (datetime, required)
- Validation rules:
  - Access to review list/detail requires `authorized = true`.

## Entity: CompletedReviewRecord
- Fields:
  - `review_id` (string, immutable)
  - `paper_id` (string, required)
  - `status` (enum: `submitted`)
  - `submitted_at` (datetime, required)
  - `content` (object, required)
  - `recommendation` (string, required)
- Validation rules:
  - Only `status = submitted` is eligible for UC-13 list/detail.
  - Non-submitted records are excluded from completed list.

## Entity: AnonymizedReviewView
- Fields:
  - `review_id` (string, required)
  - `paper_id` (string, required)
  - `submitted_at` (datetime, required)
  - `summary` (string, optional)
  - `content` (object, required for detail view)
  - `identity_removed` (boolean, required, always true)
- Validation rules:
  - Referee identity attributes are omitted from list, detail, and metadata payloads.
  - Identity-bearing fields from source data cannot be propagated to editor response.

## Entity: ReviewRetrievalOutcome
- Fields:
  - `paper_id` (string, required)
  - `operation` (enum: `list_completed`, `open_review`)
  - `outcome` (enum: `success`, `none_available`, `unauthorized`, `retrieval_error`, `review_not_found`)
  - `error_code` (string, nullable)
  - `occurred_at` (datetime, required)

## Relationships
- `PaperReviewAccess` 1-to-many `CompletedReviewRecord` for authorized paper scope.
- `CompletedReviewRecord` 1-to-1 `AnonymizedReviewView` projection per editor-facing response.
- `ReviewRetrievalOutcome` references `paper_id` and optionally `review_id` for operation auditing.

## State Transitions
- `list request -> success`
  - Preconditions: authenticated editor + authorized paper.
  - Effects: return only anonymized `submitted` reviews.
- `list request -> none_available`
  - Preconditions: authenticated editor + authorized paper + zero submitted reviews.
  - Effects: explicit no-completed-reviews response.
- `list request -> unauthorized`
  - Preconditions: authentication or authorization failure.
  - Effects: block data and return authorization error.
- `list request -> retrieval_error`
  - Preconditions: backend retrieval failure.
  - Effects: return system error and no review list.
- `open review -> review_not_found`
  - Preconditions: selected review unavailable after list load.
  - Effects: return open-failure feedback; keep list accessible.
