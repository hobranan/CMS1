# Tasks: UC-22 View public announcements

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc22-public-announcements/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc22-public-announcements/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc22-public-announcements/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc22-public-announcements/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc22-public-announcements/contracts/public-announcements.openapi.yaml`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc22-public-announcements/quickstart.md`

**Tests**: Include contract and integration tests because UC-22 requires guest-access list/detail behavior, deterministic ordering, and explicit no-data/error/unavailable recovery states.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-22.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-22-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare public announcement list/detail modules and test scaffolding.

- [ ] T001 Create public-announcements feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-announcements/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-announcements/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-announcements/`
- [ ] T002 [P] Register public announcement list/detail routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-announcements/routes.js`
- [ ] T003 [P] Create frontend announcements list/detail view/controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/public-announcements/announcements-list.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-announcements/announcements-list-controller.js`
- [ ] T004 [P] Add UC-22 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-announcements/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-announcements/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement public-visibility filtering, deterministic ordering, detail projection, and safe error/no-data mapping.

- [ ] T005 Create `PublicAnnouncement` model with public visibility and availability-state checks in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/public-announcement.js`
- [ ] T006 [P] Create `AnnouncementListProjection` model with ordering invariant `published_at_desc_then_id_desc` in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/announcement-list-projection.js`
- [ ] T007 [P] Create `AnnouncementDetailProjection` model in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/announcement-detail-projection.js`
- [ ] T008 [P] Create `AnnouncementAccessOutcome` model for success/no_data/retrieval_error/unavailable paths in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/announcement-access-outcome.js`
- [ ] T009 Implement public-announcement visibility filter service (`is_public=true`) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-announcements/public-announcement-visibility-service.js`
- [ ] T010 [P] Implement deterministic ordering service (date desc + id desc fallback) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-announcements/public-announcement-ordering-service.js`
- [ ] T011 [P] Implement no-data and retrieval-failure mapping service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-announcements/public-announcement-fallback-service.js`
- [ ] T012 Implement API error mapper for `204`/`404`/`500` paths in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-announcements/public-announcements-error-mapper.js`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - View list of public announcements (Priority: P1) MVP

**Goal**: Guest can access public announcements list ordered newest first and retain visibility across refresh.

**Independent Test**: Guest opens announcements page and sees publicly visible list in deterministic newest-first order, including consistent refresh behavior.

### Tests for User Story 1

- [ ] T013 [P] [US1] Add contract test for successful public list retrieval `GET /api/v1/public/announcements` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-announcements/get-announcements-list-success.contract.test.js`
- [ ] T014 [P] [US1] Add contract test for no-announcements `204` response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-announcements/get-announcements-list-no-data.contract.test.js`
- [ ] T015 [P] [US1] Add integration test for deterministic ordering including identical-date fallback in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-announcements/ordered-list-deterministic.integration.test.js`
- [ ] T016 [P] [US1] Add integration test for refresh/return consistency in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-announcements/refresh-return-consistency.integration.test.js`

### Implementation for User Story 1

- [ ] T017 [US1] Implement public announcements list controller in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-announcements/get-public-announcements-list-controller.js`
- [ ] T018 [US1] Implement frontend guest list loader/controller in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-announcements/announcements-list-controller.js`
- [ ] T019 [US1] Implement announcements list view rendering in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/public-announcements/announcements-list.html`
- [ ] T020 [US1] Implement no-announcements empty-state view in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/public-announcements/announcements-empty-state.html`

**Checkpoint**: US1 delivers MVP guest list visibility.

---

## Phase 4: User Story 2 - Read full announcement content (Priority: P2)

**Goal**: Guest can open full announcement detail and return safely to list.

**Independent Test**: Guest selects listed announcement, sees full content, and can return to list for continued browsing.

### Tests for User Story 2

- [ ] T021 [P] [US2] Add contract test for announcement detail success `GET /api/v1/public/announcements/{announcementId}` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-announcements/get-announcement-detail-success.contract.test.js`
- [ ] T022 [P] [US2] Add integration test for list-to-detail-to-list navigation flow in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-announcements/detail-return-navigation.integration.test.js`
- [ ] T023 [P] [US2] Add integration test for single-item list detail flow in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-announcements/single-item-detail-flow.integration.test.js`

### Implementation for User Story 2

- [ ] T024 [US2] Implement public announcement detail controller in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-announcements/get-public-announcement-detail-controller.js`
- [ ] T025 [US2] Implement frontend announcement detail controller with safe return path in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-announcements/announcement-detail-controller.js`
- [ ] T026 [US2] Implement full announcement detail view template in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/public-announcements/announcement-detail.html`

**Checkpoint**: US2 completes detail reading and return navigation.

---

## Phase 5: User Story 3 - Handle unavailable and error states gracefully (Priority: P3)

**Goal**: No-data, retrieval-failure, and unavailable-selection cases produce explicit feedback with safe recovery.

**Independent Test**: Simulated no-data, list retrieval failure, and unavailable detail selection show correct error messaging and safe return behavior.

### Tests for User Story 3

- [ ] T027 [P] [US3] Add contract test for list retrieval failure `500` response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-announcements/get-announcements-list-failure.contract.test.js`
- [ ] T028 [P] [US3] Add contract test for unavailable/not-found detail `404` response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-announcements/get-announcement-detail-unavailable.contract.test.js`
- [ ] T029 [P] [US3] Add integration test for unavailable selection returning user to list safely in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-announcements/unavailable-selection-safe-return.integration.test.js`
- [ ] T030 [P] [US3] Add integration test for intermittent retrieval failure then successful retry in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-announcements/intermittent-failure-recovery.integration.test.js`

### Implementation for User Story 3

- [ ] T031 [US3] Implement retrieval-failure response handling service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-announcements/public-announcement-fallback-service.js`
- [ ] T032 [US3] Implement unavailable-selection detail handler and redirect logic in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-announcements/get-public-announcement-detail-controller.js`
- [ ] T033 [US3] Implement frontend retrieval-error and unavailable-state controller in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-announcements/announcements-error-feedback-controller.js`
- [ ] T034 [US3] Implement frontend unavailable announcement message and safe-return view in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/public-announcements/announcement-unavailable-state.html`

**Checkpoint**: US3 completes resilient no-data/error/unavailable handling.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final observability, traceability, and verification.

- [ ] T035 [P] Add announcement list/detail telemetry for retrieval outcomes and latency in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-announcements/public-announcements-observability-service.js`
- [ ] T036 [P] Add performance verification tests for list/detail retrieval latency in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-announcements/public-announcements-latency.integration.test.js`
- [ ] T037 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-22.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-22-AT.md` if user-facing wording changed during implementation
- [ ] T038 Run `npm test && npm run lint` and record UC-22 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc22-public-announcements/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks all story phases.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1 after list baseline exists.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after fallback primitives exist.
- Phase 6 -> depends on selected story completion.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends on shared list/detail retrieval services.
- US3 (P3) depends on shared fallback/error and availability-state services.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and should fail before full pass.
- Service/model behavior before controller response mapping.
- Backend behavior before frontend feedback wiring.

---

## Parallel Opportunities

- Setup: `T002`, `T003`, `T004`.
- Foundational: `T006`, `T007`, `T008`, `T010`, `T011`.
- US1: `T013`, `T014`, `T015`, `T016`.
- US2: `T021`, `T022`, `T023`.
- US3: `T027`, `T028`, `T029`, `T030`.

---

## Parallel Example: User Story 1

```bash
Task: "T013 [US1] Add public announcement list success contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-announcements/get-announcements-list-success.contract.test.js"
Task: "T014 [US1] Add no-data 204 list contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-announcements/get-announcements-list-no-data.contract.test.js"
Task: "T015 [US1] Add deterministic ordering integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-announcements/ordered-list-deterministic.integration.test.js"
Task: "T016 [US1] Add refresh consistency integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-announcements/refresh-return-consistency.integration.test.js"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy guest public-announcements list MVP.

### Incremental Delivery

1. Add US2 full-content detail and return-to-list behavior.
2. Add US3 no-data/error/unavailable recovery behavior.
3. Complete polish and full regression.

### Validation Gates

- Guests can view only announcements marked public.
- List ordering is newest-first with deterministic same-date fallback.
- No-data, retrieval-failure, and unavailable-selection flows always show explicit safe feedback.
- Refresh/return navigation preserves consistent public list visibility when data source is healthy.
