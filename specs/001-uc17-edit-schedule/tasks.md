# Tasks: UC-17 Edit conference schedule

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc17-edit-schedule/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc17-edit-schedule/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc17-edit-schedule/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc17-edit-schedule/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc17-edit-schedule/contracts/edit-schedule.openapi.yaml`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc17-edit-schedule/quickstart.md`

**Tests**: Include contract and integration tests because UC-17 requires permission gating, save/cancel semantics, published-edit behavior, timestamp updates, lock-policy handling, and failure-safe persistence.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-17.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-17-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare schedule-edit routes, controllers, views, and test scaffolding.

- [ ] T001 Create schedule-edit feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/schedule-edit/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule-edit/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/schedule-edit/`
- [ ] T002 [P] Register load/edit/save/cancel schedule routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/schedule-edit/routes.js`
- [ ] T003 [P] Create frontend edit-mode and save-feedback view/controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/schedule/schedule-edit.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/schedule-edit/schedule-edit-controller.js`
- [ ] T004 [P] Add UC-17 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule-edit/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule-edit/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared access, validation, versioning, lock policy, and persistence primitives.

- [ ] T005 Create `ScheduleEditAccess` model for auth/permission/lock policy checks in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/schedule-edit-access.js`
- [ ] T006 [P] Create `ConferenceScheduleState` model with `version`, `status`, and `last_edited_at` fields in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/conference-schedule-state.js`
- [ ] T007 [P] Create `ScheduleEditSession` model with base-version tracking and edit lifecycle states in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/schedule-edit-session.js`
- [ ] T008 [P] Create `ConflictValidationResult` model for conflict/reference validation outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/conflict-validation-result.js`
- [ ] T009 [P] Create `ScheduleSaveOutcome` model for saved/rejected/cancelled/error outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/schedule-save-outcome.js`
- [ ] T010 Implement schedule-edit role/permission middleware in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/middleware/schedule-edit-role-guard.js`
- [ ] T011 [P] Implement policy-lock enforcement service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule-edit/policy-lock-service.js`
- [ ] T012 [P] Implement save-time schedule validation service (constraints + references + conflict checks) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule-edit/schedule-edit-validation-service.js`
- [ ] T013 Implement optimistic concurrency version-check service for stale-save detection in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule-edit/schedule-version-check-service.js`
- [ ] T014 [P] Implement transactional edit persistence service with rollback guarantees in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule-edit/schedule-edit-persistence-service.js`
- [ ] T015 Implement last-edited timestamp updater service (successful commit only) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule-edit/last-edited-timestamp-service.js`
- [ ] T016 Implement schedule-edit API error mapper for invalid/conflict/locked/concurrency/db failures in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/schedule-edit/schedule-edit-error-mapper.js`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - Edit and save schedule updates (Priority: P1) MVP

**Goal**: Authorized editor can load schedule, make valid edits, save, and see persisted updates across sessions.

**Independent Test**: Open schedule in edit mode, save valid changes, refresh/re-login, and verify saved state remains.

### Tests for User Story 1

- [ ] T017 [P] [US1] Add contract test for loading editable schedule details in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule-edit/get-editable-schedule.contract.test.js`
- [ ] T018 [P] [US1] Add contract test for successful schedule save in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule-edit/post-save-schedule.contract.test.js`
- [ ] T019 [P] [US1] Add integration test for valid edit save and success feedback in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule-edit/save-valid-edit.integration.test.js`
- [ ] T020 [P] [US1] Add integration test for saved edits persistence across refresh/new session in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule-edit/persisted-edits-across-session.integration.test.js`

### Implementation for User Story 1

- [ ] T021 [US1] Implement editable schedule load controller with sessions/papers/rooms/times/conflict indicators in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/schedule-edit/get-editable-schedule-controller.js`
- [ ] T022 [US1] Implement save-edit controller orchestration (validate -> version check -> transactional save) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/schedule-edit/post-save-schedule-controller.js`
- [ ] T023 [P] [US1] Implement frontend edit-mode data loader and local edit buffer management in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/schedule-edit/schedule-edit-controller.js`
- [ ] T024 [US1] Implement frontend save-success feedback and conflict-status refresh in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/schedule-edit/schedule-edit-save-feedback-controller.js`
- [ ] T025 [US1] Implement schedule edit UI rendering for editable entities in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/schedule/schedule-edit.html`

**Checkpoint**: US1 delivers MVP edit/save flow.

---

## Phase 4: User Story 2 - Edit published schedules with visible last-edited timestamp (Priority: P2)

**Goal**: Authorized editors can edit published schedules while preserving published status and showing latest successful edit timestamp.

**Independent Test**: Save valid edits on published schedule; verify status remains published and last-edited timestamp updates/displayed.

### Tests for User Story 2

- [ ] T026 [P] [US2] Add contract test for successful save on published schedule preserving published status in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule-edit/post-save-published-schedule.contract.test.js`
- [ ] T027 [P] [US2] Add integration test for published schedule edit-save behavior in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule-edit/edit-published-schedule.integration.test.js`
- [ ] T028 [P] [US2] Add integration test for last-edited timestamp update on successful save in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule-edit/last-edited-updated.integration.test.js`
- [ ] T029 [P] [US2] Add integration test for multiple same-day edits showing latest timestamp in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule-edit/latest-timestamp-wins.integration.test.js`

### Implementation for User Story 2

- [ ] T030 [US2] Implement published-schedule edit allowance in access/permission service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule-edit/published-edit-policy-service.js`
- [ ] T031 [US2] Implement save pipeline rule that preserves published status after successful edit in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule-edit/schedule-edit-persistence-service.js`
- [ ] T032 [US2] Implement last-edited timestamp projection for API responses in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/schedule-edit/schedule-edit-response-mapper.js`
- [ ] T033 [US2] Implement frontend last-edited timestamp display component in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/schedule/schedule-last-edited-view.html`

**Checkpoint**: US2 guarantees published-edit behavior and timestamp visibility.

---

## Phase 5: User Story 3 - Reject invalid edits and handle failures safely (Priority: P3)

**Goal**: Invalid/conflicting edits, policy locks, cancellations, concurrency races, and DB failures are handled without persisting bad state.

**Independent Test**: Trigger conflicting/invalid edits, cancel flow, lock-policy block, stale concurrent save, and DB failure; verify no unintended persistence.

### Tests for User Story 3

- [ ] T034 [P] [US3] Add contract test for conflict-based save rejection with unchanged schedule in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule-edit/post-save-conflict-rejected.contract.test.js`
- [ ] T035 [P] [US3] Add contract test for invalid references save rejection in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule-edit/post-save-invalid-reference.contract.test.js`
- [ ] T036 [P] [US3] Add contract test for locked schedule edit/save blocked in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule-edit/post-save-locked-schedule.contract.test.js`
- [ ] T037 [P] [US3] Add contract test for database save failure returning error with no persisted changes in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule-edit/post-save-db-failure.contract.test.js`
- [ ] T038 [P] [US3] Add integration test for cancel edit discarding unsaved changes in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule-edit/cancel-discards-unsaved.integration.test.js`
- [ ] T039 [P] [US3] Add integration test for concurrent stale save conflict handling in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule-edit/concurrent-stale-save.integration.test.js`

### Implementation for User Story 3

- [ ] T040 [US3] Implement save rejection branch for conflict and invalid-reference violations in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule-edit/schedule-edit-validation-service.js`
- [ ] T041 [US3] Implement cancel-edit endpoint and discard semantics in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/schedule-edit/post-cancel-schedule-edit-controller.js`
- [ ] T042 [US3] Implement lock-policy explanatory feedback mapping in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/schedule-edit/schedule-lock-feedback-mapper.js`
- [ ] T043 [US3] Implement DB failure rollback/no-change guarantee in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule-edit/schedule-edit-persistence-service.js`
- [ ] T044 [US3] Implement frontend error-state handling for conflict/invalid/locked/concurrency/db-failure outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/schedule-edit/schedule-edit-error-feedback-controller.js`

**Checkpoint**: US3 completes failure-safe and lock-safe schedule editing.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final traceability, observability, and verification.

- [ ] T045 [P] Add edit-save telemetry (validation failure reason, lock-block reason, save latency) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/schedule-edit/schedule-edit-observability-service.js`
- [ ] T046 [P] Add performance verification test for edit load/validate/save latency target in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule-edit/edit-save-latency.integration.test.js`
- [ ] T047 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-17.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-17-AT.md` if user-facing wording changed during implementation
- [ ] T048 Run `npm test && npm run lint` and record UC-17 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc17-edit-schedule/quickstart.md`

- [ ] T049 Validate frontend HTML/CSS compliance against `/mnt/c/Users/ponti/Desktop/CMS1/docs/standards/html-css-style-profile.md` and record checks in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc17-edit-schedule/quickstart.md`
- [ ] T050 Add contract payload-shape assertions (`code/message`) across stale-version, lock-policy, and save-conflict failures in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule-edit/schedule-edit-failure-payloads.contract.test.js`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks all story phases.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1 after save pipeline baseline exists.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after validation/persistence foundations exist.
- Phase 6 -> depends on selected story completion.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends on shared save pipeline and timestamp update service.
- US3 (P3) depends on shared validation, lock-policy, concurrency, and persistence services.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and should fail before full pass.
- Service/model behavior before controller response mapping.
- Backend behavior before frontend feedback wiring.

---

## Parallel Opportunities

- Setup: `T002`, `T003`, `T004`.
- Foundational: `T006`, `T007`, `T008`, `T009`, `T011`, `T012`, `T014`.
- US1: `T017`, `T018`, `T019`, `T020`, `T023`.
- US2: `T026`, `T027`, `T028`, `T029`.
- US3: `T034`, `T035`, `T036`, `T037`, `T038`, `T039`.

---

## Parallel Example: User Story 3

```bash
Task: "T034 [US3] Add conflict rejection contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule-edit/post-save-conflict-rejected.contract.test.js"
Task: "T035 [US3] Add invalid-reference contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/schedule-edit/post-save-invalid-reference.contract.test.js"
Task: "T038 [US3] Add cancel-discards-unsaved integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule-edit/cancel-discards-unsaved.integration.test.js"
Task: "T039 [US3] Add concurrent stale-save integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/schedule-edit/concurrent-stale-save.integration.test.js"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy edit/save MVP for authorized editors.

### Incremental Delivery

1. Add US2 published-edit and last-edited timestamp behavior.
2. Add US3 invalid/failure/lock/concurrency safeguards.
3. Complete polish and full regression.

### Validation Gates

- Valid edits persist and remain visible across refresh/new sessions.
- Published schedules remain published after successful authorized edits.
- Last-edited date/time updates only on successful saves.
- Failed/conflicting/locked/canceled saves persist no unintended changes.
