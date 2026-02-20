# Tasks: UC-14 Record paper decision

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc14-paper-decision/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc14-paper-decision/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc14-paper-decision/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc14-paper-decision/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc14-paper-decision/contracts/paper-decision.openapi.yaml`

**Tests**: Include contract and integration tests because UC-14 acceptance criteria require confirmation-time eligibility checks, atomic decision persistence, cancellation behavior, and save/notification failure handling.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-14.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-14-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare paper-decision endpoints, editor decision UI shell, and test scaffolding.

- [X] T001 Create paper-decision feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/decisions/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decisions/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/decisions/`
- [X] T002 [P] Register decision-context and record-decision routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/decisions/routes.js`
- [X] T003 [P] Create editor decision view/controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/paper-decision.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/decisions/paper-decision-controller.js`
- [X] T004 [P] Add UC-14 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decisions/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decisions/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared decision eligibility, atomic persistence, and notification outcome foundations.

- [X] T005 Create `PaperDecisionEligibility` model with confirm-time gating rules in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/paper-decision-eligibility.js`
- [X] T006 [P] Create `DecisionRecord` model with Accept/Reject and optional comment fields in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/decision-record.js`
- [X] T007 [P] Create `PaperStatusSnapshot` model with allowed status transitions in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/paper-status-snapshot.js`
- [X] T008 Implement decision eligibility validation service (auth, authorization, completed reviews, period open, already-decided checks) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decisions/paper-decision-eligibility-service.js`
- [X] T009 [P] Implement atomic decision persistence service for decision record + status update in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decisions/paper-decision-persistence-service.js`
- [X] T010 [P] Implement post-commit author notification service with failure reporting in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decisions/paper-decision-notification-service.js`
- [X] T011 Implement concurrent-decision conflict detection service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decisions/paper-decision-conflict-service.js`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - Record final accept/reject decision (Priority: P1) MVP

**Goal**: Allow authorized editors to confirm and persist final Accept/Reject decisions for eligible papers.

**Independent Test**: For eligible paper, confirm Accept or Reject and verify stored decision plus updated paper status.

### Tests for User Story 1

- [X] T012 [P] [US1] Add contract test for successful `GET /api/v1/papers/{paperId}/decision-context` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decisions/get-decision-context.contract.test.js`
- [X] T013 [P] [US1] Add contract test for successful Accept decision record in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decisions/post-decision-accept.contract.test.js`
- [X] T014 [P] [US1] Add contract test for successful Reject decision record in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decisions/post-decision-reject.contract.test.js`

### Implementation for User Story 1

- [X] T015 [P] [US1] Implement decision-context controller showing completed reviews and options in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/decisions/get-decision-context-controller.js`
- [X] T016 [US1] Implement record-decision controller requiring explicit confirmation in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/decisions/post-paper-decision-controller.js`
- [X] T017 [US1] Implement success orchestration for eligibility -> atomic save -> notification attempt in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decisions/process-paper-decision-service.js`
- [X] T018 [P] [US1] Implement frontend decision options, optional comment input, and confirm action in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/paper-decision.html`
- [X] T019 [US1] Implement frontend decision success state and persisted status display in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/decisions/paper-decision-controller.js`

**Checkpoint**: US1 delivers MVP paper-decision recording.

---

## Phase 4: User Story 2 - Block disallowed decision attempts (Priority: P2)

**Goal**: Prevent invalid decisions (no completed reviews unless override, already decided, closed period, cancel before confirm).

**Independent Test**: Attempt disallowed decisions and verify explanatory feedback with unchanged status.

### Tests for User Story 2

- [X] T020 [P] [US2] Add contract test for no-completed-reviews ineligible decision (`403`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decisions/post-decision-no-completed-reviews.contract.test.js`
- [X] T021 [P] [US2] Add contract test for already-decided/closed-period ineligible decision (`403`/`409`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decisions/post-decision-ineligible-state.contract.test.js`
- [X] T022 [P] [US2] Add integration test for cancel-before-confirm leaving decision/status unchanged in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decisions/cancel-no-mutation.integration.test.js`

### Implementation for User Story 2

- [X] T023 [US2] Implement eligibility revalidation at confirmation time in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decisions/paper-decision-eligibility-service.js`
- [X] T024 [US2] Implement policy-override check for no-completed-reviews rule in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decisions/paper-decision-eligibility-service.js`
- [X] T025 [P] [US2] Implement frontend ineligibility/cancel feedback and no-change behavior in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/decisions/paper-decision-state-feedback-controller.js`
- [X] T026 [US2] Implement ineligibility error mapping with explanatory reasons in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/decisions/paper-decision-error-mapper.js`

**Checkpoint**: US2 enforces decision-eligibility guardrails.

---

## Phase 5: User Story 3 - Handle save/notification failures safely (Priority: P3)

**Goal**: Preserve consistent decision state through persistence failures and notification failures.

**Independent Test**: Simulate db failure and notification failure; verify save failure keeps status unchanged and notification failure preserves committed decision.

### Tests for User Story 3

- [X] T027 [P] [US3] Add contract test for decision save failure (`500`) with unchanged status in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decisions/post-decision-save-failure.contract.test.js`
- [X] T028 [P] [US3] Add contract test for notification failure with committed decision (`notificationStatus=failed`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decisions/post-decision-notification-failure.contract.test.js`
- [X] T029 [P] [US3] Add integration test for persisted decision/status across refresh/new session after success in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decisions/decision-persistence-across-session.integration.test.js`
- [X] T030 [P] [US3] Add integration test for concurrent near-simultaneous decision attempts with conflict on second request in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decisions/concurrent-decision-conflict.integration.test.js`

### Implementation for User Story 3

- [X] T031 [US3] Implement db-failure rollback behavior preserving unchanged status in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decisions/paper-decision-persistence-service.js`
- [X] T032 [US3] Implement notification-failure post-commit messaging in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/decisions/paper-decision-notification-failure-mapper.js`
- [X] T033 [US3] Implement conflict handling for already-finalized/concurrent decisions in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decisions/paper-decision-conflict-service.js`
- [X] T034 [P] [US3] Implement frontend failure feedback for save/notification/conflict outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/decisions/paper-decision-failure-controller.js`

**Checkpoint**: US3 completes failure-safe decision handling.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize contract/docs parity and quality checks.

- [X] T035 [P] Update API contract examples/error payloads for final decision behavior in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc14-paper-decision/contracts/paper-decision.openapi.yaml`
- [X] T036 Update quickstart with final ineligibility/failure/concurrency verification steps in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc14-paper-decision/quickstart.md`
- [X] T037 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-14.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-14-AT.md` if user-facing behavior wording changed during implementation
- [X] T038 Run `npm test && npm run lint` and record UC-14 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc14-paper-decision/quickstart.md`

- [X] T039 Validate UC-14 narrative and update any changed user-facing behavior details in `/mnt/c/Users/ponti/Desktop/CMS1/UC-14.md`
- [X] T040 Validate UC-14 acceptance tests and update scenarios/expected outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/UC-14-AT.md`

- [X] T041 Validate frontend HTML/CSS compliance against `/mnt/c/Users/ponti/Desktop/CMS1/docs/standards/html-css-style-profile.md` and record checks in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc14-paper-decision/quickstart.md`
- [X] T042 Add contract/integration assertions for notification-failure payload shape with preserved decision status in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/paper-decision/notification-failure-payload.contract.test.js`
- [X] T043 Add decision outcome and blocked-attempt telemetry instrumentation for SC-001/SC-002 validation in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/paper-decision/paper-decision-observability-service.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks all story phases.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after base routes/controllers exist.
- Phase 6 -> depends on selected story completion.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends on shared eligibility services and decision context.
- US3 (P3) depends on shared persistence/notification/conflict services.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and should fail before full pass.
- Service/model behavior before controller response mapping.
- Backend behavior before frontend feedback wiring.

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
Task: "T020 [US2] Add no-completed-reviews ineligible decision contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decisions/post-decision-no-completed-reviews.contract.test.js"
Task: "T021 [US2] Add ineligible-state decision contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decisions/post-decision-ineligible-state.contract.test.js"
Task: "T022 [US2] Add cancel-before-confirm integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decisions/cancel-no-mutation.integration.test.js"
Task: "T025 [US2] Implement frontend ineligibility/cancel feedback in /mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/decisions/paper-decision-state-feedback-controller.js"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy paper decision MVP.

### Incremental Delivery

1. Add US2 disallowed-attempt blocking behavior.
2. Add US3 failure and concurrency handling.
3. Complete polish and full regression.

### Validation Gates

- Decision eligibility is revalidated at confirmation time.
- Decision record and paper status update are atomic.
- Save failure leaves state unchanged; notification failure preserves committed decision.

