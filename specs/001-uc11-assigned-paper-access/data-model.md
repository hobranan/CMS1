# Data Model - UC-11 Assigned Paper Access

## Entity: AssignedPaper
- Fields:
  - `assignment_id` (string, immutable)
  - `paper_id` (string, required)
  - `referee_id` (string, required)
  - `assignment_status` (enum: `active`, `inactive`)
  - `assigned_at` (datetime)
- Validation rules:
  - Access requires `assignment_status = active` and `referee_id` match.

## Entity: ManuscriptViewResource
- Fields:
  - `paper_id` (string, required)
  - `storage_key` (string, required)
  - `availability_status` (enum: `available`, `unavailable`)
  - `access_mode` (enum: `view_only`)
- Validation rules:
  - `access_mode` must remain `view_only` for this use case.
  - Download/export links are not provided.

## Entity: ReviewForm
- Fields:
  - `review_form_id` (string, immutable)
  - `paper_id` (string, required)
  - `referee_id` (string, required)
  - `generation_status` (enum: `pre_generated`, `missing`)
  - `form_schema_version` (string)
- Validation rules:
  - Access requires existing `pre_generated` record.
  - On-demand generation is disallowed in this flow.

## Entity: AccessAttemptResult
- Fields:
  - `attempt_id` (string)
  - `referee_id` (string)
  - `resource_type` (enum: `assigned_list`, `paper_detail`, `manuscript`, `review_form`)
  - `outcome` (enum: `success`, `unauthorized`, `unavailable`, `system_error`)
  - `error_code` (string, nullable)
  - `occurred_at` (datetime)

## Relationships
- `AssignedPaper` 1-to-1 `ManuscriptViewResource` by `paper_id`
- `AssignedPaper` 1-to-1 `ReviewForm` by (`paper_id`, `referee_id`)
- `AccessAttemptResult` records access outcomes for any of the resources above

## State Transitions
- Successful access:
  - `assigned_list`/`paper_detail`/`manuscript`/`review_form` request with valid assignment -> `success`
- Unauthorized access:
  - non-assigned direct or indirect request -> `unauthorized`, no resource disclosure
- Unavailable access:
  - assigned resource missing/unavailable -> `unavailable`, retry guidance shown
- System error:
  - retrieval/authorization service failure -> `system_error`, no partial unauthorized data
