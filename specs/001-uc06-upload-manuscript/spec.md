# Feature Specification: Upload manuscript file

**Feature Branch**: `001-uc06-upload-manuscript`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "UC-06.md contains the use case flows (the Main Success Scenario and all Extensions). Extract the functional requirements from these flows. The UC-06-AT.md contains the acceptance tests for the UC-06.md file, you can additionally use this in helping to determine the those requirements. Also, I need a new branch made for this use case. For preemptive clarifications, this UC-06.md has Open Issues where I want you validat file types simply by extension. Also, to clarify, you should pick a good and simple practice for resumable upload behavior for interrupted transfers."
**Use Case Sources**: `UC-06.md`, `UC-06-AT.md`

## Clarifications

### Session 2026-02-08

- Q: How should allowed file type validation be performed? -> A: File type validation is performed by file extension only.
- Q: What resumable upload behavior should apply after interrupted transfers? -> A: The system supports simple resume by allowing retry of the same file within 30 minutes, continuing from the last confirmed uploaded portion; after 30 minutes the upload restarts from the beginning.
- Q: Which exact extensions are allowed for PDF, Word, and LaTeX? -> A: Allowed extensions are `.pdf`, `.doc`, `.docx`, and `.tex` (case-insensitive).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload and attach a valid manuscript (Priority: P1)

An authenticated author uploads a manuscript file in an allowed format and size so it is attached to the current paper submission.

**Why this priority**: This is required for completing a valid submission workflow.

**Independent Test**: Can be tested by uploading an allowed file (`PDF`, `Word`, or `LaTeX`) within the 7 MB limit and verifying successful attachment.

**Acceptance Scenarios**:

1. **Given** an authenticated author is in manuscript upload, **When** they select a file with an allowed extension and size within 7 MB, **Then** the system uploads the file, associates it with the current submission, and confirms successful attachment.
2. **Given** a file is attached successfully, **When** the author refreshes or returns to the submission draft, **Then** the file remains shown as attached.

---

### User Story 2 - Reject invalid file selections clearly (Priority: P2)

An author receives immediate, actionable feedback when they cancel selection or choose an invalid file type/size.

**Why this priority**: Clear validation feedback prevents invalid uploads and reduces author confusion.

**Independent Test**: Can be tested by canceling file selection, uploading unsupported extensions, and uploading oversized files, then verifying no file attachment.

**Acceptance Scenarios**:

1. **Given** the author opens the file picker and cancels, **When** no file is selected, **Then** no upload occurs and no file is attached.
2. **Given** a selected file extension is not allowed, **When** the author selects the file, **Then** the system rejects it, shows allowed formats, and does not attach a file.
3. **Given** a selected file exceeds 7 MB, **When** the author selects the file, **Then** the system rejects it, shows the size-limit message, and does not attach a file.

---

### User Story 3 - Recover from interruption and service failures (Priority: P3)

An author is guided to retry when uploads fail from network interruption, storage error, or association error, without false attachment state.

**Why this priority**: Reliable error handling preserves submission integrity and supports successful retries.

**Independent Test**: Can be tested by simulating interrupted transfer, storage failure, and database association failure, then verifying non-attachment and retry guidance.

**Acceptance Scenarios**:

1. **Given** network interruption occurs during upload, **When** transfer fails, **Then** the system reports connectivity failure, keeps file as not attached, and allows retry.
2. **Given** upload retry starts within 30 minutes for the same file after interruption, **When** retry is initiated, **Then** upload resumes from the last confirmed uploaded portion.
3. **Given** upload retry starts after 30 minutes, **When** retry is initiated, **Then** upload restarts from the beginning.
4. **Given** storage service fails or file-reference association fails, **When** upload request completes, **Then** the system reports error, does not mark file attached, and prompts retry.

---

### Edge Cases

- Author cancels file picker repeatedly before selecting a file.
- File extension casing differs (for example `.PDF`).
- File has multiple dots in the filename (for example `paper.final.v2.pdf`).
- File extension is allowed but file size is greater than 7 MB.
- Network interruption happens near upload completion.
- Upload succeeds to storage but association to submission fails.
- Author retries interrupted upload with a different file name.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow manuscript upload only for authenticated authors in a submission workflow.
- **FR-002**: System MUST allow the author to select a local manuscript file or cancel file selection without side effects.
- **FR-003**: System MUST validate allowed file types by extension only.
- **FR-004**: System MUST accept only these manuscript file extensions: `.pdf`, `.doc`, `.docx`, `.tex` (case-insensitive).
- **FR-005**: System MUST validate file size and reject files larger than 7 MB.
- **FR-006**: System MUST reject unsupported extensions with an error message listing allowed formats.
- **FR-007**: System MUST reject oversized files with an error message indicating the size limit.
- **FR-008**: System MUST upload files that pass type and size checks to file storage.
- **FR-009**: System MUST store and associate uploaded-file reference/metadata to the current submission only after successful upload.
- **FR-010**: System MUST display clear confirmation when a file is successfully attached.
- **FR-011**: System MUST keep file attachment state unchanged when file selection is canceled.
- **FR-012**: System MUST handle upload failures caused by network interruption or timeout by displaying retry guidance and leaving file as not attached.
- **FR-013**: System MUST support resumable retry for interrupted uploads of the same file within 30 minutes, continuing from the last confirmed uploaded portion.
- **FR-014**: System MUST restart interrupted uploads from the beginning when retry occurs after 30 minutes.
- **FR-015**: System MUST handle storage/service upload failure by displaying a system error and not attaching the file.
- **FR-016**: System MUST handle file-association database failure by informing the author the file is not attached and prompting retry.
- **FR-017**: System MUST ensure a file is considered attached only when both upload and submission association complete successfully.
- **FR-018**: System MUST persist successful attachment visibility across page refresh and navigation back to the submission draft.

### Assumptions

- Maximum manuscript size for UC-06 is 7 MB.
- Allowed format validation is based on filename extension, not content inspection.
- "Same file" for resumable behavior means the author retries the same selected file for the same submission draft.
- Interrupted upload retry is user-initiated.

### Key Entities *(include if feature involves data)*

- **Manuscript File Candidate**: The selected local file pending validation and upload.
- **Upload Attempt**: A single upload transfer execution with result (success, interrupted, failed).
- **Upload Progress State**: The last confirmed uploaded portion used for resumable retry within policy window.
- **File Attachment Record**: The stored manuscript file reference associated to a specific submission.
- **Submission Draft**: The in-progress paper submission to which manuscript attachment belongs.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of files with allowed extension and size <= 7 MB are uploadable and attach successfully to the current submission.
- **SC-002**: 100% of unsupported-extension or oversized files are rejected with clear feedback and no attachment.
- **SC-003**: 100% of interrupted uploads remain unattached and provide retry guidance.
- **SC-004**: At least 95% of interrupted uploads retried within 30 minutes complete successfully via resume behavior.
- **SC-005**: 100% of storage/service or association failures result in non-attachment state with explicit retry messaging.
