# Tasks: UC-09 Enforce referee workload limits

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/plan.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/contracts/workload-limits.openapi.yaml`

**Tests**: Include contract and integration tests because UC-09 acceptance criteria require limit-threshold behavior, retrieval/storage failure safety, and immediate configuration change application.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-09.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-09-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare workload-enforcement API surface, editor assignment UI hooks, and test scaffolding.

- [ ] T001 Create workload feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/workload/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/workload/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/workload/`
- [ ] T002 [P] Register workload enforcement routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/workload/routes.js`
- [ ] T003 [P] Create editor workload-check UI/controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/workload-assignment-panel.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/workload/workload-assignment-controller.js`
- [ ] T004 [P] Add UC-09 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/workload/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/workload/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared workload limit resolution, validation, and safe persistence foundations.

- [ ] T005 Create `WorkloadLimitRule` model with active rule resolution constraints in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/workload-limit-rule.js`
- [ ] T006 [P] Create `PaperAssignmentAttempt` model and outcome taxonomy in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/paper-assignment-attempt.js`
- [ ] T007 [P] Create `WorkloadSnapshot` model for decision-time values in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/workload-snapshot.js`
- [ ] T008 Implement configurable workload-limit resolution service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/workload/workload-limit-resolution-service.js`
- [ ] T009 [P] Implement current workload retrieval service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/workload/referee-workload-retrieval-service.js`
- [ ] T010 Implement assignment decision engine enforcing `workload < limit` rule in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/workload/workload-assignment-decision-service.js`
- [ ] T011 Implement atomic assignment persistence service that increments workload only on successful commit in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/workload/workload-assignment-persistence-service.js`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - Assign referee within allowed workload (Priority: P1) MVP

**Goal**: Allow assignment when selected referee is below currently configured workload limit.

**Independent Test**: Assign referee with workload below active limit; verify assignment stored and workload incremented for subsequent checks.

### Tests for User Story 1

- [ ] T012 [P] [US1] Add contract test for successful `POST /api/v1/papers/{paperId}/assign-referee` below limit in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/workload/post-assign-referee-success.contract.test.js`
- [ ] T013 [P] [US1] Add contract test for `GET /api/v1/referees/{refereeId}/workload` snapshot retrieval in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/workload/get-referee-workload.contract.test.js`
- [ ] T014 [P] [US1] Add integration test validating workload increment after accepted assignment in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/workload/workload-increment.integration.test.js`

### Implementation for User Story 1

- [ ] T015 [P] [US1] Implement assign-referee controller request mapping in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/workload/assign-referee-controller.js`
- [ ] T016 [US1] Implement accepted-assignment orchestration using retrieved workload + resolved limit in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/workload/assign-referee-with-limit-service.js`
- [ ] T017 [US1] Implement workload snapshot endpoint controller in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/workload/get-workload-controller.js`
- [ ] T018 [P] [US1] Implement frontend assignment action with success state rendering in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/workload/workload-assignment-controller.js`
- [ ] T019 [US1] Implement frontend workload display refresh after successful assignment in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/models/referee-workload-view-model.js`

**Checkpoint**: US1 delivers MVP workload-aware assignment.

---

## Phase 4: User Story 2 - Reject overloaded referee assignment (Priority: P2)

**Goal**: Reject assignments at/equal-or-above configured limit with clear feedback and no persistence.

**Independent Test**: Attempt assignment at limit and above limit; verify rejection message and unchanged assignment state.

### Tests for User Story 2

- [ ] T020 [P] [US2] Add contract test for `400` rejection when workload equals limit in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/workload/post-assign-referee-equal-limit.contract.test.js`
- [ ] T021 [P] [US2] Add contract test for `400` rejection when workload exceeds limit in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/workload/post-assign-referee-over-limit.contract.test.js`
- [ ] T022 [P] [US2] Add integration test ensuring overload rejections do not create assignment records in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/workload/overload-no-persist.integration.test.js`

### Implementation for User Story 2

- [ ] T023 [US2] Implement threshold comparator enforcing strict-below rule in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/workload/workload-assignment-decision-service.js`
- [ ] T024 [US2] Implement workload-limit rejection error mapper with clear guidance in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/workload/workload-error-mapper.js`
- [ ] T025 [P] [US2] Implement frontend workload-limit feedback messaging in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/workload-limit-errors.js`
- [ ] T026 [US2] Record `REJECTED_LIMIT` attempt outcomes for traceability in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/workload/workload-attempt-logging-service.js`

**Checkpoint**: US2 enforces overload rejection policy.

---

## Phase 5: User Story 3 - Handle retrieval and storage failures safely (Priority: P3)

**Goal**: Fail safely on retrieval/storage errors and ensure no invalid assignment is persisted.

**Independent Test**: Simulate workload retrieval failure and storage failure; verify `503` with unchanged assignment/workload state.

### Tests for User Story 3

- [ ] T027 [P] [US3] Add contract test for retrieval/config resolution failure (`503`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/workload/post-assign-referee-retrieval-failure.contract.test.js`
- [ ] T028 [P] [US3] Add contract test for storage failure after positive validation (`503`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/workload/post-assign-referee-storage-failure.contract.test.js`
- [ ] T029 [P] [US3] Add integration test verifying no persisted assignment on retrieval failure in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/workload/retrieval-failure-no-persist.integration.test.js`
- [ ] T030 [P] [US3] Add integration test verifying no persisted assignment/workload increment on storage failure in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/workload/storage-failure-no-persist.integration.test.js`

### Implementation for User Story 3

- [ ] T031 [US3] Implement fail-closed behavior for workload retrieval/config failures in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/workload/assign-referee-with-limit-service.js`
- [ ] T032 [US3] Implement transactional rollback for storage failure paths in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/workload/workload-assignment-persistence-service.js`
- [ ] T033 [US3] Implement system error response mapping/retry guidance for failure modes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/workload/workload-failure-response-mapper.js`
- [ ] T034 [P] [US3] Implement frontend system-failure messaging for retrieval/storage errors in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/workload/workload-failure-controller.js`

**Checkpoint**: US3 completes failure-safe enforcement.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize contract/docs parity and quality checks.

- [ ] T035 [P] Update contract examples/error payloads for finalized workload behavior in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/contracts/workload-limits.openapi.yaml`
- [ ] T036 Update quickstart with final config-change and failure verification steps in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/quickstart.md`
- [ ] T037 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-09.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-09-AT.md` if user-facing behavior wording changed during implementation
- [ ] T038 Run `npm test && npm run lint` and record UC-09 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/quickstart.md`

- [ ] T039 Validate frontend HTML/CSS compliance against `/mnt/c/Users/ponti/Desktop/CMS1/docs/standards/html-css-style-profile.md` and record checks in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc09-workload-limits/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks all story phases.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after base controller/services exist.
- Phase 6 -> depends on selected story completion.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends on shared workload decision engine.
- US3 (P3) depends on shared retrieval/persistence services.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and should fail before full pass.
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

## Parallel Example: User Story 3

```bash
Task: "T027 [US3] Add retrieval-failure contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/workload/post-assign-referee-retrieval-failure.contract.test.js"
Task: "T028 [US3] Add storage-failure contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/workload/post-assign-referee-storage-failure.contract.test.js"
Task: "T029 [US3] Add retrieval-failure integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/workload/retrieval-failure-no-persist.integration.test.js"
Task: "T030 [US3] Add storage-failure integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/workload/storage-failure-no-persist.integration.test.js"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy workload-limit MVP behavior.

### Incremental Delivery

1. Add US2 overload rejection and feedback.
2. Add US3 retrieval/storage failure resilience.
3. Finish polish and regression.

### Validation Gates

- Assignment accepted only when `workload < configured limit` at validation time.
- Config changes are applied to subsequent checks without client changes.
- No failure path persists invalid assignment or workload increments.
