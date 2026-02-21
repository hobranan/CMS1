# Tasks: UC-15 Receive final decision notification

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc15-decision-notification/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc15-decision-notification/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc15-decision-notification/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc15-decision-notification/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc15-decision-notification/contracts/decision-notification.openapi.yaml`

**Tests**: Include contract and integration tests because UC-15 acceptance criteria require ordered notification content, ownership enforcement, under-review handling, and retrieval/delivery failure behavior.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-15.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-15-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare feature scaffolding across backend/frontend test layers.

- [X] T001 Create decision-notification feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/decision-notification/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decision-notification/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/decision-notification/`
- [X] T002 [P] Register decision view and notification routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/decision-notification/routes.js`
- [X] T003 [P] Create frontend decision view/controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/decision-notification/paper-decision-view.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/decision-notification/paper-decision-controller.js`
- [X] T004 [P] Create frontend notification detail view shell in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/decision-notification/decision-notification-view.html`
- [X] T005 [P] Add UC-15 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decision-notification/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decision-notification/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement cross-story core behavior: ownership, states, composition, and error contracts.

- [X] T006 Create decision state model with `accepted`/`rejected`/`under_review` transitions in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/decision-state.js`
- [X] T007 [P] Implement author ownership authorization service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/authorization/author-ownership-policy.js`
- [X] T008 [P] Create shared decision retrieval error model in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/errors/decision-retrieval-error.js`
- [X] T009 [P] Implement ordered notification body composer (`decision_header -> summary_bullets -> full_review`) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decision-notification/notification-body-composer.js`
- [X] T010 Implement API error mapping for unauthorized/under-review/retrieval-failure outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/decision-notification/error-response-mapper.js`

**Checkpoint**: Foundation complete; user stories can proceed.

---

## Phase 3: User Story 1 - View final decision in CMS (Priority: P1) MVP

**Goal**: Authenticated owning author can view final decision status and comment in CMS.

**Independent Test**: Open authored papers with recorded accepted/rejected decisions and confirm correct status/comment visibility.

### Tests for User Story 1

- [X] T011 [P] [US1] Add contract test for successful `GET /api/v1/author/papers/{paperId}/decision` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decision-notification/get-paper-decision.contract.spec.js`
- [X] T012 [P] [US1] Add integration test for accepted decision visibility in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decision-notification/accepted-decision.integration.spec.js`
- [X] T013 [P] [US1] Add integration test for rejected decision visibility in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decision-notification/rejected-decision.integration.spec.js`

### Implementation for User Story 1

- [X] T014 [P] [US1] Implement owning-author decision query repository in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/paper-decision-repository.js`
- [X] T015 [US1] Implement decision-view controller for owned paper in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/decision-notification/get-paper-decision.js`
- [X] T016 [P] [US1] Implement decision view-model mapper in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/models/decision-notification/decision-view-model.js`
- [X] T017 [US1] Implement decision page controller for accepted/rejected rendering in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/decision-notification/paper-decision-controller.js`
- [X] T018 [US1] Implement decision detail UI states in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/decision-notification/paper-decision-view.html`

**Checkpoint**: US1 is independently functional and testable.

---

## Phase 4: User Story 2 - Receive decision notification details (Priority: P2)

**Goal**: Decision notification contains summary bullets first, then full review content.

**Independent Test**: Generate notification and verify strict section order and inclusion behavior.

### Tests for User Story 2

- [X] T019 [P] [US2] Add contract test for successful `GET /api/v1/author/papers/{paperId}/decision-notification` ordering payload in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decision-notification/get-decision-notification.contract.spec.js`
- [X] T020 [P] [US2] Add integration test verifying summary-before-full-review composition in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decision-notification/notification-order.integration.spec.js`
- [X] T021 [P] [US2] Add integration test verifying summary bullets and full review come from the same decision source in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decision-notification/notification-source-consistency.integration.spec.js`

### Implementation for User Story 2

- [X] T022 [P] [US2] Implement post-decision notification generation service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decision-notification/generate-decision-notification.js`
- [X] T023 [US2] Implement review summary-bullet builder in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decision-notification/review-summary-builder.js`
- [X] T024 [US2] Implement full-review section builder appended below summary in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decision-notification/full-review-section-builder.js`
- [X] T025 [US2] Implement decision-notification retrieval controller in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/decision-notification/get-decision-notification.js`
- [X] T026 [US2] Implement frontend notification renderer preserving section order in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/decision-notification/decision-notification-view.html`

**Checkpoint**: US2 independently validates ordered notification content.

---

## Phase 5: User Story 3 - Handle unavailable/unauthorized/failure cases (Priority: P3)

**Goal**: Provide safe, explicit handling for under-review, unauthorized, and retrieval-failure scenarios.

**Independent Test**: Simulate delivery failure, under-review, unauthorized access, and retrieval failure and verify specified outputs.

### Tests for User Story 3

- [X] T027 [P] [US3] Add contract test for under-review decision response (`decisionStatus=under_review`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decision-notification/get-paper-decision-under-review.contract.spec.js`
- [X] T028 [P] [US3] Add contract test for unauthorized owned-paper access (`403`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decision-notification/get-paper-decision-unauthorized.contract.spec.js`
- [X] T029 [P] [US3] Add integration test for delivery-failure fallback to CMS source-of-truth in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decision-notification/delivery-failure-cms-fallback.integration.spec.js`
- [X] T030 [P] [US3] Add integration test for retrieval-failure system error with withheld details in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decision-notification/retrieval-failure.integration.spec.js`

### Implementation for User Story 3

- [X] T031 [P] [US3] Implement under-review response path in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/decision-notification/get-paper-decision.js`
- [X] T032 [P] [US3] Enforce ownership guard for decision and notification endpoints in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/decision-notification/ownership-guard.js`
- [X] T033 [US3] Implement retrieval-failure handling that withholds decision details in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decision-notification/get-decision-with-failure-handling.js`
- [X] T034 [US3] Implement frontend unauthorized/under-review/system-error states in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/decision-notification/decision-error-states.html`
- [X] T035 [US3] Implement CMS fallback indicator for `deliveryStatus=failed` in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/decision-notification/paper-decision-controller.js`

**Checkpoint**: US3 independently handles all failure/edge paths.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final cross-story quality, traceability, and validation.

- [X] T036 [P] Add persistence regression test for refresh/new-session decision visibility in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decision-notification/decision-visibility-persistence.integration.spec.js`
- [X] T037 [P] Add contract/integration test for missing notification (`404`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decision-notification/get-decision-notification-not-found.contract.spec.js`
- [X] T038 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-15.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-15-AT.md` if user-facing wording changed during implementation
- [X] T039 Update quickstart with final fallback/error/ordering verification steps in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc15-decision-notification/quickstart.md`
- [X] T040 Run `npm test && npm run lint` and record UC-15 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc15-decision-notification/quickstart.md`
- [X] T041 Add FR-to-AT traceability mapping validation in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc15-decision-notification/spec.md`
- [X] T042 Add decision/notification retrieval p95 latency verification against 400ms target in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decision-notification/decision-notification-performance.integration.spec.js`

- [ ] T043 Update implementation change log and reconcile UC-15 behavior traceability in `/mnt/c/Users/ponti/Desktop/CMS1/docs/implementation/implementation-log.md`, `/mnt/c/Users/ponti/Desktop/CMS1/UC-15.md`, and `/mnt/c/Users/ponti/Desktop/CMS1/UC-15-AT.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks all story phases.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1 after decision-view baseline exists.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after shared error/ownership services exist.
- Phase 6 -> depends on selected story completion.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends on shared notification composition utilities and decision retrieval baseline.
- US3 (P3) depends on shared ownership/error services and decision/notification endpoints.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and should fail before full pass.
- Service/model behavior before controller response mapping.
- Backend behavior before frontend feedback wiring.

---

## Parallel Opportunities

- Setup: `T002`, `T003`, `T004`, `T005`.
- Foundational: `T007`, `T008`, `T009`.
- US1: `T011`, `T012`, `T013`, `T014`, `T016`.
- US2: `T019`, `T020`, `T021`, `T022`.
- US3: `T027`, `T028`, `T029`, `T030`, `T031`, `T032`.

## Parallel Example: User Story 2

```bash
Task: "T019 [US2] Add decision-notification ordering contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/decision-notification/get-decision-notification.contract.spec.js"
Task: "T020 [US2] Add summary-before-full-review integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decision-notification/notification-order.integration.spec.js"
Task: "T021 [US2] Add summary/full-review same-source integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/decision-notification/notification-source-consistency.integration.spec.js"
Task: "T022 [US2] Implement notification generation service in /mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/decision-notification/generate-decision-notification.js"
```

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy decision-visibility MVP.

### Incremental Delivery

1. Add US2 ordered-notification behavior.
2. Add US3 fallback/error/authorization handling.
3. Complete polish and full regression.

### Validation Gates

- Notification body order remains `decision_header -> summary_bullets -> full_review`.
- CMS decision view remains source-of-truth when notification delivery fails.
- Under-review and retrieval-failure paths do not leak final decision details.


