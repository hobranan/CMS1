# Data Model: UC-06 Upload manuscript file

## Entity: ManuscriptFileCandidate

- Purpose: Represents a user-selected local file pending validation/upload.
- Fields:
  - `client_file_name` (string, required)
  - `extension` (string, required)
  - `size_bytes` (integer, required)
  - `selected_at` (datetime, required)
- Validation rules:
  - Extension-only type validation (case-insensitive).
  - Allowed types correspond to PDF/Word/LaTeX configured extension set.
  - Size must be <= 7 MB.

## Entity: UploadAttempt

- Purpose: Represents one upload execution for a candidate file.
- Fields:
  - `id` (UUID, primary key)
  - `submission_draft_id` (UUID, required)
  - `file_fingerprint` (string, required)
  - `status` (enum: `IN_PROGRESS`, `INTERRUPTED`, `FAILED_STORAGE`, `UPLOADED`)
  - `started_at` (datetime, required)
  - `ended_at` (datetime, nullable)
  - `error_code` (string, nullable)
- Validation rules:
  - `UPLOADED` only when file transfer completes to storage.
- Relationships:
  - One-to-one with `UploadProgressState` per active attempt.

## Entity: UploadProgressState

- Purpose: Tracks resumable position for interrupted upload retries.
- Fields:
  - `id` (UUID, primary key)
  - `upload_attempt_id` (UUID, foreign key)
  - `last_confirmed_offset` (integer, required, default 0)
  - `resume_expires_at` (datetime, required, 30 minutes after interruption)
- Validation rules:
  - Resume allowed only when retry is same file and current time <= `resume_expires_at`.
  - Retry after `resume_expires_at` restarts from offset 0.

## Entity: FileAttachmentRecord

- Purpose: Represents manuscript file reference attached to submission draft.
- Fields:
  - `id` (UUID, primary key)
  - `submission_draft_id` (UUID, required)
  - `storage_uri` (string, required)
  - `attached` (boolean, required)
  - `attached_at` (datetime, nullable)
- Validation rules:
  - `attached = true` only when upload is complete and association persisted.
- Relationships:
  - Belongs to `SubmissionDraft`.

## Entity: SubmissionDraft

- Purpose: In-progress paper submission context owning manuscript attachment.
- Fields:
  - `id` (UUID, primary key)
  - `author_user_id` (UUID, required)
  - `attachment_record_id` (UUID, nullable)
- Validation rules:
  - Must not claim manuscript attached if association write fails.

## State Transitions

1. File selected and validated:
   - Candidate passes extension and size checks.
2. Successful upload and association:
   - `UploadAttempt.status` -> `UPLOADED`
   - `FileAttachmentRecord.attached` -> `true`
3. File picker canceled:
   - No upload attempt created; attachment state unchanged.
4. Interruption during upload:
   - `UploadAttempt.status` -> `INTERRUPTED`
   - `UploadProgressState` stores last confirmed offset and 30-minute resume expiry.
5. Retry within 30 minutes with same file:
   - Resume from `last_confirmed_offset`.
6. Retry after 30 minutes:
   - Start new transfer from offset 0.
7. Storage or association failure:
   - `UploadAttempt.status` -> `FAILED_STORAGE` or association error
   - `FileAttachmentRecord.attached` remains `false`.
