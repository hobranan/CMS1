# Tasks: UC-08 Assign paper referees

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/plan.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/contracts/referee-assignment.openapi.yaml`

**Tests**: Include contract and integration tests because UC-08 acceptance criteria require validation outcomes, rollback semantics, concurrency handling, and assignment visibility guarantees.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-08.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-08-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare assignment endpoints, editor assignment UI shell, and test scaffolding.

- [ ] T001 Create referee-assignment feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/assignments/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assignments/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/assignment/`
- [ ] T002 [P] Register assignment routes for confirm/get in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/assignments/routes.js`
- [ ] T003 [P] Create editor assignment view/controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/referee-assignment.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/assignment/referee-assignment-controller.js`
- [ ] T004 [P] Add UC-08 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assignment/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/assignment/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared assignment domain models, validation gates, and all-or-nothing transaction support.

- [ ] T005 Create `AssignmentSet` model with 1..3 selection constraints and duplicate detection in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/assignment-set.js`
- [ ] T006 [P] Create `PaperRefereeAssignment` model for persisted paper-referee links in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/paper-referee-assignment.js`
- [ ] T007 [P] Create `AssignmentTransactionResult` model for success/failure/rollback outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/assignment-transaction-result.js`
- [ ] T008 Implement eligibility and workload validation service using UC-09 DB-config limits in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assignments/referee-eligibility-validation-service.js`
- [ ] T009 [P] Implement assignment transaction service with rollback hooks in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assignments/referee-assignment-transaction-service.js`
- [ ] T010 [P] Implement invitation dispatch adapter with failure signaling in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assignments/review-invitation-service.js`
- [ ] T011 Wire authenticated-editor and paper-state guard middleware into assignment routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/assignments/routes.js`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - Assign valid referees successfully (Priority: P1) MVP

**Goal**: Let authenticated editors assign a valid referee set and finalize invitations successfully.

**Independent Test**: Select valid referees (1..3), confirm assignment, verify invitations sent and assignment details reflect finalized set.

### Tests for User Story 1

- [ ] T012 [P] [US1] Add contract test for successful `POST /api/v1/papers/{paperId}/assignments` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assignment/post-assignments-success.contract.test.js`
- [ ] T013 [P] [US1] Add contract test for `GET /api/v1/papers/{paperId}/assignments` visibility in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assignment/get-assignments.contract.test.js`
- [ ] T014 [P] [US1] Add integration test for full successful assignment+invitation flow in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/assignment/successful-assignment.integration.test.js`

### Implementation for User Story 1

- [ ] T015 [P] [US1] Implement assignment confirmation controller input mapping in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/assignments/confirm-assignment-controller.js`
- [ ] T016 [US1] Implement finalize-assignment orchestration across validation, persistence, and invitations in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assignments/finalize-referee-assignment-service.js`
- [ ] T017 [US1] Implement assignment details retrieval controller in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/assignments/get-assignment-details-controller.js`
- [ ] T018 [P] [US1] Implement frontend referee selection UI (max 3) in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/referee-assignment.html`
- [ ] T019 [US1] Implement frontend confirmation flow and success state rendering in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/assignment/referee-assignment-controller.js`

**Checkpoint**: US1 delivers MVP referee assignment flow.

---

## Phase 4: User Story 2 - Prevent invalid referee selections (Priority: P2)

**Goal**: Reject invalid assignments with actionable selection-level feedback while preserving existing assignment state.

**Independent Test**: Attempt zero, over-three, duplicate, ineligible, and workload-exceeded selections; verify rejection and unchanged assignment.

### Tests for User Story 2

- [ ] T020 [P] [US2] Add contract test for over-limit and zero-selection validation failures in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assignment/post-assignments-count-validation.contract.test.js`
- [ ] T021 [P] [US2] Add contract test for ineligible/workload-exceeded/duplicate selection failures in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assignment/post-assignments-selection-validation.contract.test.js`
- [ ] T022 [P] [US2] Add integration test ensuring invalid attempts keep assignment unchanged in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/assignment/invalid-selection-no-change.integration.test.js`

### Implementation for User Story 2

- [ ] T023 [US2] Implement selection cardinality and duplicate checks in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assignments/referee-selection-rule-service.js`
- [ ] T024 [US2] Implement eligibility/workload violation aggregation in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assignments/referee-eligibility-validation-service.js`
- [ ] T025 [P] [US2] Implement frontend inline validation feedback for violating selections in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/referee-assignment-errors.js`
- [ ] T026 [US2] Implement validation error response mapper with clear field/selection references in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/assignments/assignment-error-mapper.js`

**Checkpoint**: US2 enforces assignment rules and correction guidance.

---

## Phase 5: User Story 3 - Handle persistence/notification failures atomically (Priority: P3)

**Goal**: Guarantee all-or-nothing assignment outcomes under persistence, invitation, or concurrency failures.

**Independent Test**: Simulate DB failure, invitation failure, and concurrent assignment conflict; verify rollback/no partial assignment.

### Tests for User Story 3

- [ ] T027 [P] [US3] Add contract test for `503` assignment persistence failure in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assignment/post-assignments-system-failure.contract.test.js`
- [ ] T028 [P] [US3] Add contract test for `503` invitation failure with rollback semantics in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assignment/post-assignments-invitation-failure.contract.test.js`
- [ ] T029 [P] [US3] Add contract test for `409` concurrency/stale workload conflict in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assignment/post-assignments-conflict.contract.test.js`
- [ ] T030 [P] [US3] Add integration test proving no partial assignment remains after failure in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/assignment/atomic-rollback.integration.test.js`

### Implementation for User Story 3

- [ ] T031 [US3] Implement transactional rollback behavior for persistence+invitation failures in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assignments/referee-assignment-transaction-service.js`
- [ ] T032 [US3] Implement concurrency revalidation at confirmation time using current UC-09 DB-config workload values in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assignments/referee-assignment-concurrency-service.js`
- [ ] T033 [US3] Implement failure response mapping and retry guidance for system/conflict errors in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/assignments/assignment-failure-response-mapper.js`
- [ ] T034 [P] [US3] Implement frontend recovery messaging for rollback/conflict outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/assignment/assignment-failure-controller.js`

**Checkpoint**: US3 completes atomic failure handling.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize contract/doc parity and quality gates across stories.

- [ ] T035 [P] Update contract examples/error payloads for final assignment behavior in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/contracts/referee-assignment.openapi.yaml`
- [ ] T036 Update quickstart with implemented concurrency and rollback verification steps in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/quickstart.md`
- [ ] T037 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-08.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-08-AT.md` if user-facing behavior wording changed during implementation
- [ ] T038 Run `npm test && npm run lint` and record UC-08 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/quickstart.md`
- [ ] T039 Add assignment-confirmation p95 latency verification against 500ms target in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/assignment/assignment-confirmation-performance.integration.test.js`
- [ ] T040 Add telemetry for one-attempt-valid-assignment completion metric (SC-005) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assignments/assignment-observability-service.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks story work.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after route/controller scaffolding exists.
- Phase 6 -> depends on selected story completion.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends on shared validation services only.
- US3 (P3) depends on shared transaction and notification infrastructure only.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and should fail before full pass.
- Validation/services before controller response mapping.
- Backend flow before frontend feedback wiring.

---

## Parallel Opportunities

- Setup: `T002`, `T003`, `T004`.
- Foundational: `T006`, `T007`, `T009`, `T010`.
- US1: `T012`, `T013`, `T014`, `T015`, `T018`.
- US2: `T020`, `T021`, `T022`, `T025`.
- US3: `T027`, `T028`, `T029`, `T030`.

---

## Parallel Example: User Story 2

```bash
Task: "T020 [US2] Add count-validation contract tests in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assignment/post-assignments-count-validation.contract.test.js"
Task: "T021 [US2] Add selection-validation contract tests in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assignment/post-assignments-selection-validation.contract.test.js"
Task: "T022 [US2] Add invalid-selection no-change integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/assignment/invalid-selection-no-change.integration.test.js"
Task: "T025 [US2] Implement frontend selection validation error rendering in /mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/referee-assignment-errors.js"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy assignment MVP.

### Incremental Delivery

1. Add US2 validation hardening.
2. Add US3 atomic rollback and concurrency handling.
3. Complete polish and regression.

### Validation Gates

- Assignment is finalized only when validation, persistence, and invitation sending all succeed.
- Any failure must leave assignment unchanged (no partial outcome).
- Selection constraints (1..3, unique, eligible, workload-valid) are enforced at confirmation time.
