# Feature Specification: Submit paper manuscript

**Feature Branch**: `001-uc05-manuscript-submission`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "UC-05.md contains the use case flows (the Main Success Scenario and all Extensions). Extract the functional requirements from these flows. The UC-05-AT.md contains the acceptance tests for the UC-05.md file, you can additionally use this in helping to determine the those requirements. Also, I need a new branch made for this use case. For preemptive clarifications, this UC-05.md has Open Issues where I want you report network interruptions if it happens during uploads (and to just redo the upload when the network is available). I also want you to know that the paper metadata includes: Name of authors, their affiliation and contact information, Abstract text, Keywords of the paper, Main reference source of the paper."
**Use Case Sources**: `UC-05.md`, `UC-05-AT.md`

## Clarifications

### Session 2026-02-08

- Q: Which manuscript metadata fields are required for submission? -> A: Required metadata fields are author names, author affiliations, author contact information, abstract text, paper keywords, and main reference source.
- Q: How should upload network interruptions be handled? -> A: If a network interruption happens during upload, the system reports the interruption, does not finalize the submission, and instructs the author to retry the upload once network connectivity is available.
- Q: What exact contact-information format rules apply? -> A: Contact information must include a valid primary email address; optional phone values may use digits, spaces, `+`, `-`, and parentheses, and must normalize to 7-15 digits.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submit a complete manuscript package (Priority: P1)

An authenticated author submits a new paper by entering required metadata and uploading a valid manuscript file so the paper enters review workflow.

**Why this priority**: This is the core business objective of the use case and the only path to start paper review.

**Independent Test**: Can be tested by submitting all required metadata with a valid file (allowed type and <= 7 MB) and verifying successful storage and confirmation.

**Acceptance Scenarios**:

1. **Given** an authenticated author and open submission window, **When** the author submits complete required metadata and a valid manuscript file, **Then** the system validates the input, stores metadata plus manuscript reference, confirms success, and redirects to the author home page.
2. **Given** a successful submission, **When** the author opens their submissions list, **Then** the newly submitted paper appears with its metadata and manuscript association.

---

### User Story 2 - Correct invalid metadata or file input (Priority: P2)

An author receives actionable validation feedback when metadata is incomplete/invalid or manuscript upload constraints are violated.

**Why this priority**: Validation feedback prevents bad submissions from entering review and helps authors recover quickly.

**Independent Test**: Can be tested by separately triggering each validation failure (missing metadata, invalid metadata, missing file, unsupported format, oversized file) and verifying no finalized submission.

**Acceptance Scenarios**:

1. **Given** one or more required metadata fields are missing, **When** the author submits, **Then** the system rejects submission, highlights missing fields, shows error feedback, and keeps the author on the submission page.
2. **Given** metadata contains invalid values, **When** the author submits, **Then** the system rejects submission, marks invalid fields, shows correction feedback, and keeps the author on the submission page.
3. **Given** no file is uploaded, **When** the author submits, **Then** the system rejects submission, shows a required-file error, and keeps the author on the submission page.
4. **Given** an uploaded file is not PDF/Word/LaTeX or exceeds 7 MB, **When** the author submits, **Then** the system rejects submission, explains format/size constraints, and keeps the author on the submission page.
5. **Given** multiple validation issues exist in one attempt, **When** the author submits, **Then** the system rejects submission and reports all actionable errors (or a single consistent first-blocking error policy).

---

### User Story 3 - Handle upload/storage failures without finalizing (Priority: P3)

An author is informed when upload or storage fails and can retry later without partial submission finalization.

**Why this priority**: Failure handling protects submission integrity and avoids false acceptance into review.

**Independent Test**: Can be tested by simulating upload interruption and storage failure while submitting valid data, then verifying no finalized submission and clear retry guidance.

**Acceptance Scenarios**:

1. **Given** network connectivity is interrupted during file upload, **When** upload fails, **Then** the system reports the interruption, does not finalize the submission, and instructs the author to retry upload once network is available.
2. **Given** storage fails while saving a valid submission, **When** the author submits, **Then** the system shows a system error, does not finalize submission, and advises retry later.
3. **Given** any validation or system failure occurs, **When** the request completes, **Then** the paper is not marked as entered into review workflow.

---

### Edge Cases

- Required metadata is complete except one author contact field.
- Keywords are provided but blank/whitespace only.
- File is exactly at the 7 MB limit.
- File format extension suggests allowed type but actual content is invalid or unreadable.
- Network interruption occurs after metadata entry but before upload completion.
- Storage fails after validation passes.
- Author submits with both metadata errors and file errors in the same attempt.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide manuscript submission functionality only to authenticated authors while submissions are open.
- **FR-002**: System MUST display a submission form requiring metadata and manuscript upload.
- **FR-003**: System MUST require these metadata fields: author names, author affiliations, author contact information (primary email required, phone optional), abstract text, paper keywords, and main reference source.
- **FR-004**: System MUST require a manuscript file before accepting submission.
- **FR-005**: System MUST accept manuscript files only in PDF, Word, or LaTeX formats.
- **FR-006**: System MUST reject manuscript files larger than 7 MB.
- **FR-007**: System MUST validate required metadata completeness before finalizing submission.
- **FR-008**: System MUST validate metadata value quality before finalizing submission, including contact rules: primary email must be syntactically valid, and optional phone must normalize to 7-15 digits using only digits, spaces, `+`, `-`, and parentheses.
- **FR-009**: System MUST reject submissions with missing or invalid metadata and provide actionable error feedback.
- **FR-010**: System MUST reject submissions with missing/invalid files and provide actionable file-constraint feedback.
- **FR-011**: System MUST enforce a consistent policy for multiple simultaneous validation failures and communicate it clearly.
- **FR-012**: System MUST store validated metadata and manuscript file reference together as one finalized submission record.
- **FR-013**: System MUST confirm successful submission acceptance and redirect the author to home/dashboard.
- **FR-014**: System MUST ensure failed validation attempts do not create finalized submissions.
- **FR-015**: System MUST report upload network interruptions when they occur and inform the author to retry upload when network connectivity returns.
- **FR-016**: System MUST not finalize or enter a submission into review when upload is interrupted.
- **FR-017**: System MUST handle storage/database failure by showing a retry-later system error and preventing submission finalization.
- **FR-018**: System MUST make successful submissions visible in the author's submissions list with associated metadata and manuscript reference.

### Assumptions

- Each paper submission is authored by at least one registered author.
- Required metadata fields listed in this spec are mandatory for all UC-05 submissions.
- Retry after network interruption is a user-initiated re-upload (no automatic resume behavior required).
- "Finalized submission" means eligible for conference review workflow.

### Key Entities *(include if feature involves data)*

- **Paper Submission**: A manuscript submission package containing metadata, manuscript reference, and finalization status.
- **Paper Metadata**: Required descriptive information: author names, affiliations, contact information, abstract, keywords, and main reference source.
- **Manuscript File**: Uploaded paper document constrained by allowed format and size limit.
- **Submission Validation Result**: Outcome of metadata/file checks with actionable error details.
- **Submission Status**: State indicating whether the submission is finalized and entered into review workflow.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of submissions with complete valid metadata and valid manuscript files are finalized, confirmed, and redirected to home/dashboard.
- **SC-002**: 100% of submissions with missing/invalid metadata or file violations are rejected with clear corrective feedback and are not finalized.
- **SC-003**: 100% of upload interruptions and storage failures return an explicit error message and do not finalize submission.
- **SC-004**: 100% of finalized submissions appear in the author's submissions list with associated metadata and manuscript reference.
- **SC-005**: At least 95% of authors encountering validation or upload errors can successfully resubmit within 2 additional attempts.
