# Tasks: UC-10 Respond to review invitation

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc10-invitation-response/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc10-invitation-response/plan.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc10-invitation-response/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc10-invitation-response/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc10-invitation-response/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc10-invitation-response/contracts/invitation-response.openapi.yaml`

**Tests**: Include contract and integration tests because UC-10 acceptance criteria require accept/reject handling, invalid-state blocking, expiry boundary enforcement, cancellation semantics, and db/notification failure behavior.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-10.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-10-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare invitation-response API endpoints, referee invitation UI shells, and test scaffolding.

- [ ] T001 Create invitation-response feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/invitations/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/invitations/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/invitations/`
- [ ] T002 [P] Register invitation pending-list and response routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/invitations/routes.js`
- [ ] T003 [P] Create referee invitation list/detail UI/controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/invitation-list.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/invitations/invitation-response-controller.js`
- [ ] T004 [P] Add UC-10 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/invitations/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/invitations/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared invitation state rules, expiry policy, persistence, and notification integration.

- [ ] T005 Create `ReviewInvitation` model with actionable-state and expiry derivation rules in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/review-invitation.js`
- [ ] T006 [P] Create `InvitationResponse` model with single-effective-response constraints in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/invitation-response.js`
- [ ] T007 [P] Create `ReviewAssignmentActivation` model with accept-only activation invariant in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/review-assignment-activation.js`
- [ ] T008 Implement invitation actionable-state validation service (`pending`, not expired, not withdrawn, not responded) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/invitations/invitation-actionable-validation-service.js`
- [ ] T009 [P] Implement 14-day expiry policy utility with exact boundary behavior (`now >= issued_at + 14 days` => expired) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/invitations/invitation-expiry-service.js`
- [ ] T010 Implement response persistence service with no-mutation-on-db-failure guarantees in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/invitations/invitation-response-persistence-service.js`
- [ ] T011 [P] Implement post-commit notification adapter that reports failure without rolling back response in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/invitations/invitation-notification-service.js`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - Accept or reject a pending invitation (Priority: P1) MVP

**Goal**: Let authenticated referees accept/reject actionable pending invitations with correct status and assignment activation behavior.

**Independent Test**: Respond accept/reject on pending invitation and verify status transition, assignment activation semantics, and confirmation feedback.

### Tests for User Story 1

- [ ] T012 [P] [US1] Add contract test for successful accept response on actionable invitation in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/invitations/post-invitation-response-accept.contract.test.js`
- [ ] T013 [P] [US1] Add contract test for successful reject response on actionable invitation in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/invitations/post-invitation-response-reject.contract.test.js`
- [ ] T014 [P] [US1] Add integration test verifying accepted response activates assignment and rejected response does not in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/invitations/response-assignment-activation.integration.test.js`

### Implementation for User Story 1

- [ ] T015 [P] [US1] Implement pending invitation list controller in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/invitations/get-pending-invitations-controller.js`
- [ ] T016 [US1] Implement invitation response controller for accept/reject requests in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/invitations/post-invitation-response-controller.js`
- [ ] T017 [US1] Implement response orchestration linking persistence, assignment activation, and notification attempt in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/invitations/process-invitation-response-service.js`
- [ ] T018 [P] [US1] Implement frontend pending invitation rendering and Accept/Reject actions in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/invitation-list.html`
- [ ] T019 [US1] Implement frontend response confirmation and status refresh flow in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/invitations/invitation-response-controller.js`

**Checkpoint**: US1 delivers MVP invitation response behavior.

---

## Phase 4: User Story 2 - Prevent responses to invalid invitation states (Priority: P2)

**Goal**: Block responses when invitation is non-actionable (expired, withdrawn, already responded, no pending invitations).

**Independent Test**: Attempt response on expired/withdrawn/responded invitations and at exact 14-day boundary; verify blocked responses and unchanged status.

### Tests for User Story 2

- [ ] T020 [P] [US2] Add contract test for non-actionable invitation state rejection (`400`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/invitations/post-invitation-response-invalid-state.contract.test.js`
- [ ] T021 [P] [US2] Add contract test for exact 14-day boundary expiry blocking in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/invitations/post-invitation-response-expiry-boundary.contract.test.js`
- [ ] T022 [P] [US2] Add integration test for concurrent multi-session stale-response blocking (`409`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/invitations/concurrent-response-conflict.integration.test.js`

### Implementation for User Story 2

- [ ] T023 [US2] Implement invitation-state revalidation immediately before persistence in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/invitations/process-invitation-response-service.js`
- [ ] T024 [US2] Implement invalid-state/expiry error response mapper in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/invitations/invitation-response-error-mapper.js`
- [ ] T025 [P] [US2] Implement no-pending and blocked-action UI messaging in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/invitation-state-feedback.js`
- [ ] T026 [US2] Remove responded invitations from pending view and update invitation history projection in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/invitations/invitation-list-projection-service.js`

**Checkpoint**: US2 enforces actionable-state guardrails.

---

## Phase 5: User Story 3 - Handle cancel and system failures safely (Priority: P3)

**Goal**: Keep invitation integrity on cancel/db failures and preserve committed response on notification failure.

**Independent Test**: Cancel before confirm, simulate db failure, simulate notification failure after commit; verify expected invariants and feedback.

### Tests for User Story 3

- [ ] T027 [P] [US3] Add contract test for db-failure path keeping invitation pending (`500`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/invitations/post-invitation-response-db-failure.contract.test.js`
- [ ] T028 [P] [US3] Add contract test for notification-failure path preserving response with `notificationStatus=failed` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/invitations/post-invitation-response-notification-failure.contract.test.js`
- [ ] T029 [P] [US3] Add integration test for cancel-before-confirm with no status mutation in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/invitations/cancel-no-mutation.integration.test.js`
- [ ] T030 [P] [US3] Add integration test ensuring db failure leaves status unchanged and notification failure preserves committed response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/invitations/failure-integrity.integration.test.js`

### Implementation for User Story 3

- [ ] T031 [US3] Implement cancel-before-confirm no-op pathway in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/invitations/invitation-response-controller.js`
- [ ] T032 [US3] Implement transactional db-failure handling with rollback/no-mutation guarantees in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/invitations/invitation-response-persistence-service.js`
- [ ] T033 [US3] Implement notification-failure post-commit feedback mapping in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/invitations/invitation-notification-failure-mapper.js`
- [ ] T034 [P] [US3] Implement frontend system/notification failure messaging in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/invitations/invitation-failure-controller.js`

**Checkpoint**: US3 completes failure-safe response behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize contract/docs parity and full quality checks.

- [ ] T035 [P] Update contract examples/status codes for finalized invitation response behavior in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc10-invitation-response/contracts/invitation-response.openapi.yaml`
- [ ] T036 Update quickstart scenarios with final boundary and failure validation steps in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc10-invitation-response/quickstart.md`
- [ ] T037 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-10.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-10-AT.md` if user-facing behavior wording changed during implementation
- [ ] T038 Run `npm test && npm run lint` and record UC-10 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc10-invitation-response/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks story work.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after base response endpoints exist.
- Phase 6 -> depends on selected story completion.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends on shared actionable-state validation services.
- US3 (P3) depends on shared persistence/notification services.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and should fail before full pass.
- Service/model behavior before controller response mapping.
- Backend behavior before frontend feedback wiring.

---

## Parallel Opportunities

- Setup: `T002`, `T003`, `T004`.
- Foundational: `T006`, `T007`, `T009`, `T011`.
- US1: `T012`, `T013`, `T014`, `T015`, `T018`.
- US2: `T020`, `T021`, `T022`, `T025`.
- US3: `T027`, `T028`, `T029`, `T030`.

---

## Parallel Example: User Story 2

```bash
Task: "T020 [US2] Add invalid-state rejection contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/invitations/post-invitation-response-invalid-state.contract.test.js"
Task: "T021 [US2] Add expiry-boundary contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/invitations/post-invitation-response-expiry-boundary.contract.test.js"
Task: "T022 [US2] Add concurrent-response conflict integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/invitations/concurrent-response-conflict.integration.test.js"
Task: "T025 [US2] Implement no-pending/blocked feedback UI in /mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/invitation-state-feedback.js"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy invitation response MVP.

### Incremental Delivery

1. Add US2 invalid-state and expiry blocking behavior.
2. Add US3 cancel/system-failure resilience behavior.
3. Run polish and full regression.

### Validation Gates

- Invitation responses only mutate status for actionable pending invitations.
- 14-day expiry boundary is enforced deterministically.
- Db failures keep status unchanged; notification failures preserve committed response.
