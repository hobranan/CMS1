# Data Model: UC-05 Submit paper manuscript

## Entity: PaperSubmission

- Purpose: Represents one paper submission attempt and finalization state.
- Fields:
  - `id` (UUID, primary key)
  - `author_user_id` (UUID, required)
  - `metadata_id` (UUID, required)
  - `manuscript_file_id` (UUID, required when finalized)
  - `status` (enum: `DRAFT`, `VALIDATION_FAILED`, `UPLOAD_INTERRUPTED`, `STORAGE_FAILED`, `FINALIZED`)
  - `entered_review_at` (datetime, nullable)
  - `created_at` (datetime, required)
  - `updated_at` (datetime, required)
- Validation rules:
  - `FINALIZED` allowed only when metadata and valid manuscript reference both exist.
- Relationships:
  - One-to-one with `PaperMetadata`.
  - One-to-one with `ManuscriptFile`.

## Entity: PaperMetadata

- Purpose: Stores required descriptive fields for manuscript submission.
- Fields:
  - `id` (UUID, primary key)
  - `author_names` (array/string, required, non-empty)
  - `author_affiliations` (array/string, required, non-empty)
  - `author_contact_info` (array/string, required, valid format)
  - `abstract_text` (text, required, non-empty)
  - `keywords` (array/string, required, non-empty, non-whitespace)
  - `main_reference_source` (text/string, required, non-empty)
- Validation rules:
  - Every required field must be present and valid before finalization.
- Relationships:
  - Belongs to `PaperSubmission`.

## Entity: ManuscriptFile

- Purpose: Tracks uploaded manuscript file metadata and storage reference.
- Fields:
  - `id` (UUID, primary key)
  - `original_filename` (string, required)
  - `content_type` (string, required)
  - `detected_format` (enum: `PDF`, `WORD`, `LATEX`, `UNSUPPORTED`)
  - `size_bytes` (integer, required)
  - `storage_uri` (string, nullable until upload complete)
  - `upload_status` (enum: `PENDING`, `COMPLETE`, `INTERRUPTED`, `FAILED`)
  - `uploaded_at` (datetime, nullable)
- Validation rules:
  - Format must be one of PDF/WORD/LATEX.
  - Size must be <= 7 MB (7 * 1024 * 1024 bytes).
  - `upload_status = COMPLETE` required before submission can be finalized.
- Relationships:
  - Belongs to `PaperSubmission`.

## Entity: SubmissionValidationResult

- Purpose: Captures metadata/file validation outcomes and actionable feedback.
- Fields:
  - `is_valid` (boolean)
  - `errors` (array of `{ code, field, message }`)
  - `policy_mode` (enum: `ALL_ERRORS`, `FIRST_BLOCKING`)
- Validation rules:
  - `errors` empty only when `is_valid = true`.
  - `policy_mode` must be consistent across submissions.

## State Transitions

1. Valid metadata + valid file upload complete:
   - `PaperSubmission.status` -> `FINALIZED`
   - `entered_review_at` set.
2. Metadata/file validation failure:
   - `PaperSubmission.status` -> `VALIDATION_FAILED`
   - No finalized record in review workflow.
3. Upload interruption:
   - `ManuscriptFile.upload_status` -> `INTERRUPTED`
   - `PaperSubmission.status` -> `UPLOAD_INTERRUPTED`
   - User instructed to retry upload.
4. Storage/database failure after validation:
   - `PaperSubmission.status` -> `STORAGE_FAILED`
   - Finalization prevented (rollback of finalized state).
