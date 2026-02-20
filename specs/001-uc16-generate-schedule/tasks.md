# Tasks: UC-16 Generate conference schedule

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc16-generate-schedule/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc16-generate-schedule/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc16-generate-schedule/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc16-generate-schedule/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc16-generate-schedule/contracts/generate-schedule.openapi.yaml`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc16-generate-schedule/quickstart.md`

**Tests**: Include contract and integration tests because UC-16 requires validation blocking, randomized initial placement, conflict blocking, and draft/publish lifecycle guarantees.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-16.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-16-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare schedule-generation modules, routes, views, and test scaffolding.

- [ ] T001 Create schedule-generation feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/schedule/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/schedule/`
- [ ] T002 [P] Register generate/publish/retrieve schedule routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/schedule/routes.js`
- [ ] T003 [P] Create frontend draft review and publish view/controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/schedule/schedule-draft.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/schedule/schedule-draft-controller.js`
- [ ] T004 [P] Add UC-16 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared auth, slot-grid, placement, conflict, and persistence primitives.

- [ ] T005 Create `ScheduleGenerationRequest` model with manual-trigger validation in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/schedule-generation-request.js`
- [ ] T006 [P] Create `ScheduleDraft` model with `draft/published` state transitions in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/schedule-draft.js`
- [ ] T007 [P] Create `RoomColumn` and `TimeSlot` models with equal-slot and sequential-slot invariants in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/schedule-grid.js`
- [ ] T008 [P] Create `SessionPlacement` model with randomized placement rank fields in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/session-placement.js`
- [ ] T009 [P] Create `ConflictRecord` model with blocking/warning semantics in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/conflict-record.js`
- [ ] T010 Implement admin/editor authentication and role guard middleware in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/middleware/schedule-role-guard.js`
- [ ] T011 Implement conference prerequisite retrieval service (accepted papers + parameters + rooms) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule/schedule-input-loader.js`
- [ ] T012 [P] Implement room-column slot-grid builder enforcing equal slot counts and interval spacing in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule/slot-grid-builder.js`
- [ ] T013 [P] Implement randomized initial placement service (seed-aware for tests) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule/randomized-placement-service.js`
- [ ] T014 [P] Implement scheduling-rule and conflict detection service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule/conflict-detection-service.js`
- [ ] T015 Implement draft-first persistence transaction service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule/schedule-draft-persistence-service.js`
- [ ] T016 Implement schedule API error mapper for blocked/conflict/save-failure outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/schedule/schedule-error-mapper.js`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - Generate draft schedule from accepted papers (Priority: P1) MVP

**Goal**: Allow authenticated admin/editor to manually generate draft and publish reviewed draft.

**Independent Test**: Trigger generation with valid inputs and verify persisted draft; then confirm publish and verify published retrieval.

### Tests for User Story 1

- [ ] T017 [P] [US1] Add contract test for successful `POST /api/v1/conferences/{conferenceId}/schedule/generate` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule/post-generate-schedule.contract.test.js`
- [ ] T018 [P] [US1] Add contract test for successful `POST /api/v1/conferences/{conferenceId}/schedule/drafts/{draftId}/publish` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule/post-publish-schedule.contract.test.js`
- [ ] T019 [P] [US1] Add integration test for manual generation draft creation flow in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule/manual-generate-draft.integration.test.js`
- [ ] T020 [P] [US1] Add integration test for publish confirmation and published retrieval flow in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule/publish-reviewed-draft.integration.test.js`

### Implementation for User Story 1

- [ ] T021 [US1] Implement generate-schedule controller orchestration in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/schedule/post-generate-schedule-controller.js`
- [ ] T022 [US1] Implement publish-schedule controller with explicit confirmation requirement in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/schedule/post-publish-schedule-controller.js`
- [ ] T023 [US1] Implement published-schedule retrieval controller in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/schedule/get-published-schedule-controller.js`
- [ ] T024 [P] [US1] Implement frontend manual generate action and draft rendering in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/schedule/schedule-draft-controller.js`
- [ ] T025 [US1] Implement frontend publish confirmation flow and success state in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/schedule/schedule-publish-controller.js`
- [ ] T026 [US1] Implement draft and publish UI states in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/schedule/schedule-draft.html`

**Checkpoint**: US1 delivers MVP generation/publish flow.

---

## Phase 4: User Story 2 - Build room-column slot grid with randomized initial ordering (Priority: P2)

**Goal**: Produce draft grid with one column per room, uniform sequential slots, and randomized initial session order.

**Independent Test**: Generated draft shows room-column grid invariants and randomized initial placement.

### Tests for User Story 2

- [ ] T027 [P] [US2] Add contract test for room column count and slot invariants in generate response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule/post-generate-grid-structure.contract.test.js`
- [ ] T028 [P] [US2] Add integration test for equal slot counts and configured interval separation in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule/slot-grid-intervals.integration.test.js`
- [ ] T029 [P] [US2] Add integration test for randomized initial placement behavior with seed support in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule/randomized-placement.integration.test.js`
- [ ] T030 [P] [US2] Add integration test for cancel-before-publish keeping draft non-public in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule/cancel-publish-keeps-draft.integration.test.js`

### Implementation for User Story 2

- [ ] T031 [US2] Implement generation pipeline stage combining slot-grid builder and randomized placement in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule/generate-schedule-pipeline.js`
- [ ] T032 [US2] Implement room unavailability handling during slot construction in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule/room-availability-service.js`
- [ ] T033 [US2] Implement frontend room-column sequential slot rendering in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/schedule/schedule-grid-view.html`
- [ ] T034 [US2] Implement frontend draft-cancel behavior preserving draft state in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/schedule/schedule-publish-controller.js`

**Checkpoint**: US2 guarantees expected baseline schedule structure.

---

## Phase 5: User Story 3 - Block generation on invalid setup and report failures (Priority: P3)

**Goal**: Block invalid generation attempts, surface conflicts, and prevent storage on save failure.

**Independent Test**: No accepted papers, missing parameters, unresolved conflicts, and save failure all return correct blocking behavior.

### Tests for User Story 3

- [ ] T035 [P] [US3] Add contract test for blocked generation with no accepted papers (`400`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule/post-generate-no-accepted-papers.contract.test.js`
- [ ] T036 [P] [US3] Add contract test for blocked generation with missing parameters (`400`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule/post-generate-missing-params.contract.test.js`
- [ ] T037 [P] [US3] Add contract test for blocked publish when unresolved conflicts exist (`400`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule/post-publish-blocking-conflicts.contract.test.js`
- [ ] T038 [P] [US3] Add contract test for save failure during generation (`500`) with no draft stored in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule/post-generate-save-failure.contract.test.js`
- [ ] T039 [P] [US3] Add integration test for conflict highlighting and finalization blocking in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule/conflict-highlight-block-publish.integration.test.js`
- [ ] T040 [P] [US3] Add integration test for published schedule persistence across refresh/new session in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule/published-schedule-persistence.integration.test.js`

### Implementation for User Story 3

- [ ] T041 [US3] Implement pre-generation blocking checks for accepted papers and required parameters in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule/generation-prereq-validator.js`
- [ ] T042 [US3] Implement conflict highlight mapper and publish-block enforcement in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/schedule/conflict-highlight-mapper.js`
- [ ] T043 [US3] Implement save-failure rollback/no-store handling in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule/schedule-draft-persistence-service.js`
- [ ] T044 [US3] Implement frontend invalid-setup/conflict/save-failure feedback states in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/schedule/schedule-error-feedback-controller.js`

**Checkpoint**: US3 completes blocking/error-safe behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final parity, observability, and verification.

- [ ] T045 [P] Add generation telemetry for latency and blocked-reason counters in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule/schedule-generation-observability-service.js`
- [ ] T046 [P] Add performance verification test for generation latency target in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule/generation-latency.integration.test.js`
- [ ] T047 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-16.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-16-AT.md` if user-facing behavior wording changed during implementation
- [ ] T048 Run `npm test && npm run lint` and record UC-16 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc16-generate-schedule/quickstart.md`

- [ ] T049 Validate frontend HTML/CSS compliance against `/mnt/c/Users/ponti/Desktop/CMS1/docs/standards/html-css-style-profile.md` and record checks in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc16-generate-schedule/quickstart.md`
- [ ] T050 Add contract and UI feedback test for `GET /schedule` unpublished `404` response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule/get-published-schedule-not-available.contract.test.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks all story phases.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1 after generation API baseline exists.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after conflict/persistence foundations exist.
- Phase 6 -> depends on selected story completion.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends on shared slot-grid and randomized placement services.
- US3 (P3) depends on shared prereq-validation, conflict, and persistence services.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and should fail before full pass.
- Service/model behavior before controller response mapping.
- Backend behavior before frontend feedback wiring.

---

## Parallel Opportunities

- Setup: `T002`, `T003`, `T004`.
- Foundational: `T006`, `T007`, `T008`, `T009`, `T012`, `T013`, `T014`.
- US1: `T017`, `T018`, `T019`, `T020`, `T024`.
- US2: `T027`, `T028`, `T029`, `T030`, `T033`.
- US3: `T035`, `T036`, `T037`, `T038`, `T039`, `T040`.

---

## Parallel Example: User Story 2

```bash
Task: "T027 [US2] Add generate-response grid structure contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule/post-generate-grid-structure.contract.test.js"
Task: "T028 [US2] Add slot interval/equal-count integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule/slot-grid-intervals.integration.test.js"
Task: "T029 [US2] Add randomized placement integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule/randomized-placement.integration.test.js"
Task: "T033 [US2] Implement frontend room-column slot rendering in /mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/schedule/schedule-grid-view.html"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy manual draft generation + publish confirmation MVP.

### Incremental Delivery

1. Add US2 baseline room-column slot-grid and randomization behavior.
2. Add US3 blocking and failure-safe behavior.
3. Complete polish and full regression.

### Validation Gates

- Generation remains manual-only and role-restricted.
- Initial draft always uses one room column per room with equal sequential slots.
- Unresolved blocking conflicts always prevent publication.
- Save failure never leaves persisted partial draft.
