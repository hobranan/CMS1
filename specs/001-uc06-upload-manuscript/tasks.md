# Tasks: UC-06 Upload manuscript file

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/plan.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/contracts/upload-manuscript.openapi.yaml`

**Tests**: Include contract and integration tests because UC-06 acceptance scenarios and plan testing require validation, resume-policy, failure handling, and visibility persistence checks.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-06.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-06-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare upload API surface, frontend upload entry points, and test scaffolding.

- [ ] T001 Create upload feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/uploads/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/uploads/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/upload/`
- [ ] T002 [P] Register manuscript upload routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/uploads/routes.js`
- [ ] T003 [P] Create frontend upload view/controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/manuscript-upload.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/upload/manuscript-upload-controller.js`
- [ ] T004 [P] Add UC-06 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/upload/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/upload/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared upload domain components and attachment integrity guarantees for all stories.

- [ ] T005 Create `UploadAttempt` model and status transitions in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/upload-attempt.js`
- [ ] T006 [P] Create `UploadProgressState` model with 30-minute resume expiry in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/upload-progress-state.js`
- [ ] T007 [P] Create `FileAttachmentRecord` model with attached-state invariants in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/file-attachment-record.js`
- [ ] T008 Implement extension-only validation and 7 MB size rules in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/uploads/upload-validation-service.js`
- [ ] T009 [P] Implement storage transfer service with progress checkpoint hooks in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/uploads/upload-transfer-service.js`
- [ ] T010 Implement attachment association service that marks attached only after storage+association success in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/uploads/attachment-association-service.js`
- [ ] T011 Wire auth and submission-workflow guard middleware for upload endpoints in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/uploads/routes.js`

**Checkpoint**: Upload foundation complete; stories can be implemented independently.

---

## Phase 3: User Story 1 - Upload and attach a valid manuscript (Priority: P1) MVP

**Goal**: Allow authenticated authors to upload a valid manuscript and keep it attached to the current draft.

**Independent Test**: Upload valid allowed-extension file <= 7 MB and verify attachment success persists after refresh/navigation.

### Tests for User Story 1

- [ ] T012 [P] [US1] Add contract test for `POST /api/v1/submissions/{submissionId}/manuscript` success in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/upload/post-manuscript-success.contract.test.js`
- [ ] T013 [P] [US1] Add integration test for successful upload and association flow in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/upload/successful-upload.integration.test.js`
- [ ] T014 [P] [US1] Add integration test for attachment visibility persistence after refresh in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/upload/attachment-visibility.integration.test.js`

### Implementation for User Story 1

- [ ] T015 [P] [US1] Implement upload controller multipart handling in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/uploads/upload-manuscript-controller.js`
- [ ] T016 [US1] Implement upload-and-attach orchestration in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/uploads/upload-attachment-orchestrator.js`
- [ ] T017 [US1] Implement success response mapper (`ATTACHED`, `submission_id`, `attached=true`) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/uploads/upload-response-mapper.js`
- [ ] T018 [P] [US1] Implement frontend file picker and selected-file display in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/manuscript-upload.html`
- [ ] T019 [US1] Implement frontend upload submit flow and attached confirmation rendering in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/upload/manuscript-upload-controller.js`

**Checkpoint**: US1 provides MVP attachment workflow.

---

## Phase 4: User Story 2 - Reject invalid file selections clearly (Priority: P2)

**Goal**: Provide immediate actionable feedback for cancel, unsupported extension, and oversized files with no attachment side effects.

**Independent Test**: Cancel picker, choose unsupported extension, choose >7 MB file; verify no upload/attachment and clear messages.

### Tests for User Story 2

- [ ] T020 [P] [US2] Add contract test for unsupported extension rejection in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/upload/post-manuscript-unsupported-extension.contract.test.js`
- [ ] T021 [P] [US2] Add contract test for oversize rejection in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/upload/post-manuscript-oversize.contract.test.js`
- [ ] T022 [P] [US2] Add integration test for cancel-without-side-effects behavior in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/upload/cancel-selection.integration.test.js`

### Implementation for User Story 2

- [ ] T023 [US2] Implement extension normalization (case-insensitive) and allowed-extension whitelist enforcement (`.pdf`, `.doc`, `.docx`, `.tex`) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/uploads/upload-validation-service.js`
- [ ] T024 [US2] Implement oversize rejection messaging with explicit 7 MB limit in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/uploads/upload-error-mapper.js`
- [ ] T025 [P] [US2] Implement frontend cancel/no-file handling to preserve current attachment state in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/upload/manuscript-upload-controller.js`
- [ ] T026 [US2] Implement frontend inline validation messages listing allowed formats and size limit in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/manuscript-upload-errors.js`

**Checkpoint**: US2 ensures deterministic invalid-input handling.

---

## Phase 5: User Story 3 - Recover from interruption and service failures (Priority: P3)

**Goal**: Handle interruptions/storage/association failures with resumable retry rules and no false attached state.

**Independent Test**: Simulate interruption and failures; verify non-attachment, retry guidance, resume within 30 minutes, restart after expiry.

### Tests for User Story 3

- [ ] T027 [P] [US3] Add contract test for `POST /api/v1/submissions/{submissionId}/manuscript/retry` resume/restart modes in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/upload/post-manuscript-retry-mode.contract.test.js`
- [ ] T028 [P] [US3] Add integration test for interrupted upload retry within 30 minutes resuming from checkpoint in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/upload/retry-resume-window.integration.test.js`
- [ ] T029 [P] [US3] Add integration test for retry after 30 minutes restart-from-beginning behavior in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/upload/retry-restart-expired.integration.test.js`
- [ ] T030 [P] [US3] Add integration test for storage and association failure non-attachment state in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/upload/failure-non-attachment.integration.test.js`

### Implementation for User Story 3

- [ ] T031 [US3] Implement retry endpoint logic selecting `RESUME` vs `RESTART` based on fingerprint and expiry in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/uploads/retry-upload-controller.js`
- [ ] T032 [US3] Implement interruption checkpoint persistence, 30-minute resume window, and expired-checkpoint cleanup on restart in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/uploads/upload-progress-service.js`
- [ ] T033 [US3] Implement storage/association failure handling that preserves unattached state in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/uploads/upload-attachment-orchestrator.js`
- [ ] T034 [US3] Implement frontend retry guidance messaging for interruption and service errors in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/upload/upload-error-controller.js`

**Checkpoint**: US3 completes resilient upload recovery behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize docs, contracts, and cross-story quality gates.

- [ ] T035 [P] Update API contract examples/error codes to match implemented behavior in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/contracts/upload-manuscript.openapi.yaml`
- [ ] T036 Update quickstart verification with final resume/failure scenarios in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/quickstart.md`
- [ ] T037 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-06.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-06-AT.md` if behavior wording changed during implementation
- [ ] T038 Run `npm test && npm run lint` and record UC-06 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/quickstart.md`

- [ ] T039 Validate frontend HTML/CSS compliance against `/mnt/c/Users/ponti/Desktop/CMS1/docs/standards/html-css-style-profile.md` and record checks in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/quickstart.md`
- [ ] T040 Add pre-upload validation p95 latency verification against 300ms target in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/upload/upload-validation-performance.integration.test.js`
- [ ] T041 Add telemetry for resume-vs-restart outcomes and 30-minute success-rate reporting in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/uploads/upload-observability-service.js`
- [ ] T042 Record SC-004 resume-success calculation and evidence in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc06-upload-manuscript/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks all user stories.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after base upload endpoints exist.
- Phase 6 -> depends on selected story completion.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends on shared validation and UI scaffolding only.
- US3 (P3) depends on shared upload state/progress infrastructure only.

### Within Each Story

- Contract/integration tests should be authored before or alongside implementation and fail before full pass.
- Model/service updates before controller orchestration.
- Backend behavior before frontend message wiring.

---

## Parallel Opportunities

- Setup: `T002`, `T003`, `T004`.
- Foundational: `T006`, `T007`, `T009`.
- US1: `T012`, `T013`, `T014`, `T015`, `T018`.
- US2: `T020`, `T021`, `T022`, `T025`.
- US3: `T027`, `T028`, `T029`, `T030`.

---

## Parallel Example: User Story 3

```bash
Task: "T027 [US3] Add retry mode contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/upload/post-manuscript-retry-mode.contract.test.js"
Task: "T028 [US3] Add resume-window integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/upload/retry-resume-window.integration.test.js"
Task: "T029 [US3] Add expired-window restart integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/upload/retry-restart-expired.integration.test.js"
Task: "T030 [US3] Add failure non-attachment integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/upload/failure-non-attachment.integration.test.js"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy MVP upload-attachment behavior.

### Incremental Delivery

1. Add US2 validation/error UX.
2. Add US3 interruption recovery and failure integrity.
3. Finish polish and full regression.

### Validation Gates

- Attachment state is true only after upload+association succeed.
- Any interruption/storage/association failure keeps file unattached.
- Resume/restart behavior follows 30-minute policy.
