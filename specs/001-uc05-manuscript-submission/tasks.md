# Tasks: UC-05 Submit paper manuscript

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/plan.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/contracts/manuscript-submission.openapi.yaml`

**Tests**: Include contract and integration tests because UC-05 acceptance criteria and plan testing strategy explicitly require validation, failure-mode, and visibility verification.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-05.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-05-AT.md` in sync whenever behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare shared scaffolding for submission APIs, frontend entry points, and test harness.

- [ ] T001 Create submission feature folder structure in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/submissions/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/submissions/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/submission/`
- [ ] T002 [P] Register submission API router shell in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/submissions/routes.js`
- [ ] T003 [P] Create frontend submission page/controller shell in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/submission-form.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/submission/submission-form-controller.js`
- [ ] T004 [P] Add test suite placeholders for UC-05 in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/submission/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/submission/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared domain infrastructure and policies that all user stories depend on.

- [ ] T005 Create `PaperSubmission` model with state transitions in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/paper-submission.js`
- [ ] T006 [P] Create `PaperMetadata` model and field normalization rules in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/paper-metadata.js`
- [ ] T007 [P] Create `ManuscriptFile` model with format and size guards in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/manuscript-file.js`
- [ ] T008 Implement submission validation service (`ALL_ERRORS` vs `FIRST_BLOCKING` policy) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/submissions/submission-validation-service.js`
- [ ] T009 [P] Implement atomic persistence adapter for metadata+file reference finalization in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/submissions/submission-persistence-service.js`
- [ ] T010 Wire authenticated author and submission-window guard middleware into submission routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/submissions/routes.js`

**Checkpoint**: Foundation complete; user stories can now be implemented independently.

---

## Phase 3: User Story 1 - Submit a complete manuscript package (Priority: P1) MVP

**Goal**: Allow authenticated authors to submit required metadata and a valid manuscript file and receive finalization confirmation.

**Independent Test**: Submit valid metadata + valid file (<= 7 MB, allowed type) and verify `201`, finalized status, redirect, and listing visibility.

### Tests for User Story 1

- [ ] T011 [P] [US1] Add contract test for `POST /api/v1/submissions` success response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/submission/post-submissions-success.contract.test.js`
- [ ] T012 [P] [US1] Add integration test for end-to-end successful submission flow in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/submission/successful-submission.integration.test.js`

### Implementation for User Story 1

- [ ] T013 [P] [US1] Implement multipart request parsing and request DTO mapping in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/submissions/submission-controller.js`
- [ ] T014 [US1] Implement finalize-submission orchestration with atomic write behavior in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/submissions/submission-finalization-service.js`
- [ ] T015 [US1] Implement successful response payload (`FINALIZED`, `submission_id`, redirect) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/submissions/submission-response-mapper.js`
- [ ] T016 [P] [US1] Implement frontend submission form fields for required metadata in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/submission-form.html`
- [ ] T017 [US1] Implement frontend submit handler and success redirect in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/submission/submission-form-controller.js`
- [ ] T018 [US1] Implement `GET /api/v1/submissions/mine` listing endpoint with metadata+manuscript reference mapping in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/submissions/list-author-submissions-controller.js`

**Checkpoint**: US1 delivers MVP manuscript submission.

---

## Phase 4: User Story 2 - Correct invalid metadata or file input (Priority: P2)

**Goal**: Reject invalid attempts with actionable and consistent metadata/file feedback without finalizing submission.

**Independent Test**: Trigger missing fields, invalid contact format, missing file, unsupported format, oversized file, and multiple simultaneous errors.

### Tests for User Story 2

- [ ] T019 [P] [US2] Add contract test for metadata validation failure response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/submission/post-submissions-metadata-errors.contract.test.js`
- [ ] T020 [P] [US2] Add contract test for file constraint failures (missing/invalid/oversize) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/submission/post-submissions-file-errors.contract.test.js`
- [ ] T021 [P] [US2] Add integration test for multiple simultaneous validation failures policy in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/submission/multi-error-policy.integration.test.js`

### Implementation for User Story 2

- [ ] T022 [US2] Implement metadata completeness and quality checks (including contact format) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/submissions/submission-validation-service.js`
- [ ] T023 [US2] Implement file-type sniffing and 7 MB size enforcement in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/submissions/file-constraint-service.js`
- [ ] T024 [US2] Implement consistent validation error aggregation/precedence policy output in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/submissions/submission-error-mapper.js`
- [ ] T025 [P] [US2] Implement frontend inline field/file error rendering and focus management in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/submission-form-errors.js`
- [ ] T026 [US2] Ensure failed validation attempts never create finalized records in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/submissions/submission-finalization-service.js`

**Checkpoint**: US2 ensures safe and recoverable invalid-input handling.

---

## Phase 5: User Story 3 - Handle upload/storage failures without finalizing (Priority: P3)

**Goal**: Surface interruption/storage errors clearly and preserve non-finalized state until user retry.

**Independent Test**: Simulate upload interruption and storage failure with valid input; verify error messaging and no review entry.

### Tests for User Story 3

- [ ] T027 [P] [US3] Add contract test for `POST /api/v1/submissions/upload-status` interruption response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/submission/post-upload-status-interrupted.contract.test.js`
- [ ] T028 [P] [US3] Add integration test for upload interruption non-finalization behavior in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/submission/upload-interruption.integration.test.js`
- [ ] T029 [P] [US3] Add integration test for storage failure `503` and retry-later guidance in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/submission/storage-failure.integration.test.js`

### Implementation for User Story 3

- [ ] T030 [US3] Implement interruption status endpoint and retry guidance message in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/submissions/upload-status-controller.js`
- [ ] T031 [US3] Implement upload interruption and storage failure state transitions in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/submissions/submission-state-service.js`
- [ ] T032 [US3] Implement frontend interruption/system-error messaging with explicit retry instructions in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/submission/submission-error-controller.js`

**Checkpoint**: US3 guarantees integrity for operational failures.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, compliance, and documentation updates across stories.

- [ ] T033 [P] Update API contract examples and response error codes for UC-05 parity in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/contracts/manuscript-submission.openapi.yaml`
- [ ] T034 Update quickstart verification steps for final implementation behavior in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/quickstart.md`
- [ ] T035 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-05.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-05-AT.md` if user-facing behavior wording changed during implementation
- [ ] T036 Run `npm test && npm run lint` and record UC-05 results in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/quickstart.md`

- [ ] T037 Validate frontend HTML/CSS compliance against `/mnt/c/Users/ponti/Desktop/CMS1/docs/standards/html-css-style-profile.md` and record checks in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc05-manuscript-submission/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks all story phases.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2; can run in parallel with US1 after core route wiring exists.
- Phase 5 (US3) -> depends on Phase 2; can run in parallel with US2 and after base submission lifecycle APIs exist.
- Phase 6 -> depends on completion of all targeted story phases.

### User Story Dependencies

- US1 (P1) is MVP and has no dependency on US2/US3.
- US2 (P2) depends on shared validation/finalization foundation but is independently testable.
- US3 (P3) depends on shared lifecycle/state foundation but is independently testable.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and must fail before full implementation passes.
- Models/services before controllers.
- Controller behavior before frontend wiring.

---

## Parallel Opportunities

- Setup tasks `T002`, `T003`, and `T004` can run in parallel.
- Foundational tasks `T006`, `T007`, and `T009` can run in parallel after `T005` starts model baseline.
- US1 tasks `T011`, `T012`, `T013`, and `T016` can run in parallel.
- US2 tasks `T019`, `T020`, `T021`, and `T025` can run in parallel.
- US3 tasks `T027`, `T028`, and `T029` can run in parallel.

---

## Parallel Example: User Story 2

```bash
Task: "T019 [US2] Add contract metadata-error tests in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/submission/post-submissions-metadata-errors.contract.test.js"
Task: "T020 [US2] Add contract file-error tests in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/submission/post-submissions-file-errors.contract.test.js"
Task: "T021 [US2] Add integration multi-error policy test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/submission/multi-error-policy.integration.test.js"
Task: "T025 [US2] Implement frontend inline error rendering in /mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/submission-form-errors.js"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete US1 (Phase 3) and validate independent acceptance.
3. Demo/deploy MVP behavior.

### Incremental Delivery

1. Add US2 validation hardening and verify no-finalization-on-error.
2. Add US3 interruption/storage failure handling.
3. Run full regression and polish tasks.

### Validation Gates

- Every story must be independently testable.
- No failure path may produce a finalized submission.
- UC artifacts remain aligned with implemented user-facing behavior.
