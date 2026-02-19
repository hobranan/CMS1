# Tasks: UC-07 Save submission draft

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc07-save-draft/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc07-save-draft/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc07-save-draft/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc07-save-draft/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc07-save-draft/contracts/save-draft.openapi.yaml`

**Tests**: Include contract and integration tests because UC-07 acceptance scenarios require save outcomes, no-change detection, failure integrity, cross-session retrieval, and submit-prevalidation sequencing.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-07.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-07-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare draft API endpoints, frontend save controls, and test scaffolding.

- [ ] T001 Create draft feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/drafts/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/drafts/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/draft/`
- [ ] T002 [P] Register draft routes (`save`, `get`, `finalize`) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/drafts/routes.js`
- [ ] T003 [P] Create frontend draft editor shell with manual save trigger in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/draft-editor.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/draft/draft-editor-controller.js`
- [ ] T004 [P] Add UC-07 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/draft/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/draft/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared draft persistence, save-attempt outcomes, and validation scaffolding.

- [ ] T005 Create `SubmissionDraft` model with status/version fields in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/submission-draft.js`
- [ ] T006 [P] Create `DraftFieldState` model with authoritative persisted payload hashing in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/draft-field-state.js`
- [ ] T007 [P] Create `SaveAttempt` model with outcome taxonomy in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/save-attempt.js`
- [ ] T008 Implement save-level validation service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/drafts/draft-save-validation-service.js`
- [ ] T009 [P] Implement no-change detection service against last saved hash in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/drafts/draft-change-detection-service.js`
- [ ] T010 Implement atomic draft persistence service that updates state only on `SAVED` outcome in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/drafts/draft-persistence-service.js`
- [ ] T011 Wire authenticated non-finalized draft guards in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/drafts/routes.js`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - Manually save draft progress (Priority: P1) MVP

**Goal**: Allow authenticated authors to manually persist partial draft edits and recover them later.

**Independent Test**: Save partial data, verify confirmation and retrieval after logout/login matches last successful saved state.

### Tests for User Story 1

- [ ] T012 [P] [US1] Add contract test for `POST /api/v1/drafts/{draftId}/save` saved response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/draft/post-save-success.contract.test.js`
- [ ] T013 [P] [US1] Add contract test for `GET /api/v1/drafts/{draftId}` persisted payload retrieval in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/draft/get-draft.contract.test.js`
- [ ] T014 [P] [US1] Add integration test for cross-session draft retrieval after relogin in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/draft/cross-session-retrieval.integration.test.js`

### Implementation for User Story 1

- [ ] T015 [P] [US1] Implement save controller handling manual `editable_state` payload in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/drafts/save-draft-controller.js`
- [ ] T016 [US1] Implement manual save orchestration and success response mapping in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/drafts/save-draft-orchestrator.js`
- [ ] T017 [US1] Implement draft retrieval controller for persisted state in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/drafts/get-draft-controller.js`
- [ ] T018 [P] [US1] Implement frontend manual Save action and success confirmation rendering in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/draft/draft-editor-controller.js`
- [ ] T019 [US1] Implement frontend draft hydration from persisted state on editor load in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/models/draft-editor-state.js`

**Checkpoint**: US1 provides MVP draft persistence.

---

## Phase 4: User Story 2 - Handle no-change and invalid-save conditions (Priority: P2)

**Goal**: Provide deterministic feedback for no-change saves and save-level invalid values while preventing unintended persistence.

**Independent Test**: Save unchanged draft and save invalid draft; verify `NO_CHANGES` or validation failure and unchanged persisted data.

### Tests for User Story 2

- [ ] T020 [P] [US2] Add contract test for `NO_CHANGES` response on unchanged save in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/draft/post-save-no-changes.contract.test.js`
- [ ] T021 [P] [US2] Add contract test for save-level validation failure response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/draft/post-save-validation-failure.contract.test.js`
- [ ] T022 [P] [US2] Add integration test ensuring failed save does not overwrite last persisted draft in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/draft/failed-save-no-overwrite.integration.test.js`

### Implementation for User Story 2

- [ ] T023 [US2] Implement save-level invalid field detection and field-level error mapping in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/drafts/draft-save-validation-service.js`
- [ ] T024 [US2] Implement no-change result path with write bypass in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/drafts/save-draft-orchestrator.js`
- [ ] T025 [P] [US2] Implement frontend no-change and validation feedback banner/errors in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/draft-save-feedback.js`
- [ ] T026 [US2] Ensure save-attempt outcomes are recorded for `NO_CHANGES` and `VALIDATION_FAILED` in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/drafts/save-attempt-logging-service.js`

**Checkpoint**: US2 enforces predictable save feedback and integrity.

---

## Phase 5: User Story 3 - Recover from save failures and continue editing (Priority: P3)

**Goal**: Keep editing continuity during failures and enforce submit-prevalidation-save sequencing without false finalization.

**Independent Test**: Simulate storage/network failure and submit with unsaved edits where final validation fails; verify persisted edits retained and finalization blocked.

### Tests for User Story 3

- [ ] T027 [P] [US3] Add contract test for save system/network failure responses in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/draft/post-save-system-failure.contract.test.js`
- [ ] T028 [P] [US3] Add contract test for `POST /api/v1/drafts/{draftId}/finalize` returning `409` while retaining prevalidation save in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/draft/post-finalize-validation-failure.contract.test.js`
- [ ] T029 [P] [US3] Add integration test for storage/network failure keeping last successful draft unchanged in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/draft/save-failure-retains-last-state.integration.test.js`
- [ ] T030 [P] [US3] Add integration test for submit-triggered prevalidation save sequencing in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/draft/finalize-prevalidation-save.integration.test.js`

### Implementation for User Story 3

- [ ] T031 [US3] Implement save failure handling (`SYSTEM_FAILURE`, `NETWORK_FAILURE`) with retry guidance in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/drafts/save-error-mapper.js`
- [ ] T032 [US3] Implement finalize controller orchestration to run save-equivalent persistence before final validation in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/drafts/finalize-draft-controller.js`
- [ ] T033 [US3] Implement final validation gate that blocks submission but preserves prevalidation-saved state in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/drafts/finalize-draft-service.js`
- [ ] T034 [P] [US3] Implement frontend messaging for save failures and submit-blocked validation results in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/draft/draft-submit-feedback-controller.js`

**Checkpoint**: US3 completes resilience and submit sequencing behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final parity across contracts, docs, and compliance gates.

- [ ] T035 [P] Update API contract examples/status codes for implemented outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc07-save-draft/contracts/save-draft.openapi.yaml`
- [ ] T036 Update quickstart scenarios with final save/finalize behavior in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc07-save-draft/quickstart.md`
- [ ] T037 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-07.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-07-AT.md` if user-facing wording changed during implementation
- [ ] T038 Run `npm test && npm run lint` and record UC-07 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc07-save-draft/quickstart.md`

- [ ] T039 Validate UC-07 narrative and update any changed user-facing behavior details in `/mnt/c/Users/ponti/Desktop/CMS1/UC-07.md`
- [ ] T040 Validate UC-07 acceptance tests and update scenarios/expected outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/UC-07-AT.md`

- [ ] T041 Validate frontend HTML/CSS compliance against `/mnt/c/Users/ponti/Desktop/CMS1/docs/standards/html-css-style-profile.md` and record checks in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc07-save-draft/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks all story phases.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after save/finalize route scaffolding exists.
- Phase 6 -> depends on all selected stories.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends only on shared save validation/change detection services.
- US3 (P3) depends on foundational persistence/finalization gate services.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and must fail before full pass.
- Service/model behavior before controller mapping.
- Backend behavior before frontend feedback wiring.

---

## Parallel Opportunities

- Setup: `T002`, `T003`, `T004`.
- Foundational: `T006`, `T007`, `T009`.
- US1: `T012`, `T013`, `T014`, `T015`, `T018`.
- US2: `T020`, `T021`, `T022`, `T025`.
- US3: `T027`, `T028`, `T029`, `T030`.

---

## Parallel Example: User Story 1

```bash
Task: "T012 [US1] Add save success contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/draft/post-save-success.contract.test.js"
Task: "T013 [US1] Add draft retrieval contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/draft/get-draft.contract.test.js"
Task: "T014 [US1] Add cross-session retrieval integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/draft/cross-session-retrieval.integration.test.js"
Task: "T018 [US1] Implement frontend manual save action in /mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/draft/draft-editor-controller.js"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy draft-save MVP behavior.

### Incremental Delivery

1. Add US2 no-change and validation-failure paths.
2. Add US3 failure resilience and submit-prevalidation sequencing.
3. Run polish and full regression.

### Validation Gates

- Persisted draft changes only on successful save-equivalent operations.
- No autosave behavior is introduced.
- Submit with unsaved edits always executes prevalidation save before final validation.
