# Tasks: UC-12 Submit completed review

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc12-submit-review/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc12-submit-review/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc12-submit-review/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc12-submit-review/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc12-submit-review/contracts/submit-review.openapi.yaml`

**Tests**: Include contract and integration tests because UC-12 acceptance criteria require submission validation, immutability, version chaining, cancel semantics, and db/notification failure handling.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-12.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-12-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare submit-review endpoints, referee review UI shells, and test scaffolding.

- [X] T001 Create submit-review feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/reviews/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/reviews/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/reviews/`
- [X] T002 [P] Register review-draft and review-submit routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/reviews/routes.js`
- [X] T003 [P] Create referee review form/view UI controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/review-submit.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/reviews/review-submit-controller.js`
- [X] T004 [P] Add UC-12 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/reviews/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/reviews/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared submission validation, immutable submitted records, and version-chain foundations.

- [X] T005 Create `ReviewDraft` model with required-field validation state and informational deadline indicator in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/review-draft.js`
- [X] T006 [P] Create `SubmittedReview` immutable model with version numbering in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/submitted-review.js`
- [X] T007 [P] Create `ReviewVersionLink` model enforcing latest-prior linkage order in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/review-version-link.js`
- [X] T008 Implement active-assignment eligibility and field validation service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/reviews/review-submission-validation-service.js`
- [X] T009 [P] Implement review submission persistence service with immutable commit semantics in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/reviews/review-submission-persistence-service.js`
- [X] T010 [P] Implement post-commit notification adapter preserving committed submissions on failure in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/reviews/review-notification-service.js`
- [X] T011 Implement assignment status transition service (`active -> completed`) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/reviews/review-assignment-status-service.js`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - Submit completed review successfully (Priority: P1) MVP

**Goal**: Let authenticated referees with active assignments submit valid reviews and make them editor-visible.

**Independent Test**: Submit complete valid review for active assignment and verify submitted immutable record, completed status, and editor visibility.

### Tests for User Story 1

- [X] T012 [P] [US1] Add contract test for successful `POST /api/v1/assignments/{assignmentId}/reviews/submit` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/reviews/post-submit-review-success.contract.test.js`
- [X] T013 [P] [US1] Add contract test for `GET /api/v1/assignments/{assignmentId}/review-draft` including informational deadline indicator in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/reviews/get-review-draft.contract.test.js`
- [X] T014 [P] [US1] Add integration test verifying submitted review visibility to authorized editor in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/reviews/submitted-review-editor-visibility.integration.test.js`

### Implementation for User Story 1

- [X] T015 [P] [US1] Implement review draft retrieval controller in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/reviews/get-review-draft-controller.js`
- [X] T016 [US1] Implement review submit controller request handling in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/reviews/post-submit-review-controller.js`
- [X] T017 [US1] Implement successful submission orchestration across validation, persistence, status update, and notification in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/reviews/process-review-submission-service.js`
- [X] T018 [P] [US1] Implement frontend submit form and deadline display (informational only) in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/review-submit.html`
- [X] T019 [US1] Implement frontend submit success state and read-only transition in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/reviews/review-submit-controller.js`

**Checkpoint**: US1 delivers MVP review submission.

---

## Phase 4: User Story 2 - Prevent invalid submission attempts (Priority: P2)

**Goal**: Block incomplete/invalid or inactive-assignment submissions with actionable feedback while allowing active assignments past displayed deadlines.

**Independent Test**: Submit incomplete/invalid review or inactive assignment and verify rejection; submit valid review past displayed deadline with active assignment and verify acceptance.

### Tests for User Story 2

- [X] T020 [P] [US2] Add contract test for required-field/constraint validation failures (`400`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/reviews/post-submit-review-validation-failure.contract.test.js`
- [X] T021 [P] [US2] Add contract test for inactive-assignment submission rejection (`403`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/reviews/post-submit-review-inactive-assignment.contract.test.js`
- [X] T022 [P] [US2] Add integration test confirming deadline indicator does not block active-assignment submission in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/reviews/deadline-informational-only.integration.test.js`

### Implementation for User Story 2

- [X] T023 [US2] Implement field-level validation error mapping in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/reviews/review-validation-error-mapper.js`
- [X] T024 [US2] Implement inactive-assignment guard in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/reviews/review-submission-validation-service.js`
- [X] T025 [P] [US2] Implement frontend actionable validation feedback rendering in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/review-submit-errors.js`
- [X] T026 [US2] Enforce non-enforcement of deadline indicator in submission decision logic in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/reviews/review-submission-validation-service.js`

**Checkpoint**: US2 enforces correct validation and deadline semantics.

---

## Phase 5: User Story 3 - Preserve submitted review integrity and support newer versions (Priority: P3)

**Goal**: Keep submitted reviews immutable and support linked newer submitted versions with safe failure behavior.

**Independent Test**: Reopen submitted review (read-only), submit newer version linked to latest prior, verify cancel/db-failure/notification-failure invariants.

### Tests for User Story 3

- [X] T027 [P] [US3] Add contract test for immutable submitted-review read-only behavior in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/reviews/get-submitted-review-readonly.contract.test.js`
- [X] T028 [P] [US3] Add contract test for newer-version submission returning `previousReviewId` linkage in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/reviews/post-submit-review-new-version.contract.test.js`
- [X] T029 [P] [US3] Add integration test for sequential version-chain linkage correctness in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/reviews/review-version-chain.integration.test.js`
- [X] T030 [P] [US3] Add integration test for cancel/db-failure/notification-failure integrity behavior in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/reviews/submission-failure-integrity.integration.test.js`

### Implementation for User Story 3

- [X] T031 [US3] Block direct edits to submitted content at service/controller layers in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/reviews/submitted-review-immutability-service.js`
- [X] T032 [US3] Implement newer-version submit flow attaching to latest prior submitted review in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/reviews/review-version-linking-service.js`
- [X] T033 [US3] Implement db-failure rollback and notification-failure post-commit messaging in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/reviews/process-review-submission-service.js`
- [X] T034 [P] [US3] Implement frontend cancel-before-confirm no-mutation behavior and notification-failure feedback in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/reviews/review-submit-failure-controller.js`

**Checkpoint**: US3 completes immutable and versioned submission behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize contract/docs parity and complete quality checks.

- [X] T035 [P] Update API contract examples/error payloads for finalized submit-review behavior in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc12-submit-review/contracts/submit-review.openapi.yaml`
- [X] T036 Update quickstart scenarios with final validation/versioning/failure checks in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc12-submit-review/quickstart.md`
- [X] T037 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-12.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-12-AT.md` if user-facing behavior wording changed during implementation
- [X] T038 Run `npm test && npm run lint` and record UC-12 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc12-submit-review/quickstart.md`

- [X] T039 Validate UC-12 narrative and update any changed user-facing behavior details in `/mnt/c/Users/ponti/Desktop/CMS1/UC-12.md`
- [X] T040 Validate UC-12 acceptance tests and update scenarios/expected outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/UC-12-AT.md`

- [X] T041 Validate frontend HTML/CSS compliance against `/mnt/c/Users/ponti/Desktop/CMS1/docs/standards/html-css-style-profile.md` and record checks in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc12-submit-review/quickstart.md`
- [X] T042 Add deterministic review-version chain-integrity verification (sequence monotonicity and latest-link invariants) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/review-submission/review-chain-integrity.integration.test.js`
- [X] T043 Add submission-outcome telemetry by assignment state and validation category for SC-001 measurement in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/reviews/review-submission-observability-service.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks all story phases.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after base submit endpoints exist.
- Phase 6 -> depends on selected story completion.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends on shared submission-validation services.
- US3 (P3) depends on shared persistence/immutability/version-linking services.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and should fail before full pass.
- Service/model behavior before controller error mapping.
- Backend behavior before frontend feedback wiring.

---

## Parallel Opportunities

- Setup: `T002`, `T003`, `T004`.
- Foundational: `T006`, `T007`, `T009`, `T010`.
- US1: `T012`, `T013`, `T014`, `T015`, `T018`.
- US2: `T020`, `T021`, `T022`, `T025`.
- US3: `T027`, `T028`, `T029`, `T030`.

---

## Parallel Example: User Story 3

```bash
Task: "T027 [US3] Add submitted-review read-only contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/reviews/get-submitted-review-readonly.contract.test.js"
Task: "T028 [US3] Add newer-version linkage contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/reviews/post-submit-review-new-version.contract.test.js"
Task: "T029 [US3] Add version-chain integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/reviews/review-version-chain.integration.test.js"
Task: "T030 [US3] Add submission failure-integrity integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/reviews/submission-failure-integrity.integration.test.js"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy submit-review MVP.

### Incremental Delivery

1. Add US2 validation and deadline-indicator behavior.
2. Add US3 immutability and newer-version chaining.
3. Finish polish and full regression.

### Validation Gates

- Deadline display remains informational only and never blocks active-assignment submission.
- Submitted reviews are immutable; newer changes are expressed only via new linked versions.
- Db failures keep draft/unsubmitted status; notification failures preserve committed submission.
