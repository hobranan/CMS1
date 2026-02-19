# Tasks: UC-13 View completed paper reviews

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc13-anonymized-review-view/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc13-anonymized-review-view/plan.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc13-anonymized-review-view/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc13-anonymized-review-view/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc13-anonymized-review-view/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc13-anonymized-review-view/contracts/view-anonymized-reviews.openapi.yaml`

**Tests**: Include contract and integration tests because UC-13 acceptance criteria require completed-only filtering, anonymization guarantees, authorization blocking, and failure handling.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-13.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-13-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare completed-review viewing endpoints, editor UI shell, and test scaffolding.

- [ ] T001 Create anonymized-review feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/review-view/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/review-view/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/review-view/`
- [ ] T002 [P] Register completed-review list/detail routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/review-view/routes.js`
- [ ] T003 [P] Create editor completed-review list/detail UI/controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/completed-reviews.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/review-view/anonymized-review-view-controller.js`
- [ ] T004 [P] Add UC-13 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/review-view/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/review-view/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared completed-review filtering, anonymized projection, and authorization enforcement.

- [ ] T005 Create `CompletedReviewRecord` model constrained to `submitted` status in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/completed-review-record.js`
- [ ] T006 [P] Create `AnonymizedReviewView` projection model that strips all identity-bearing fields in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/anonymized-review-view.js`
- [ ] T007 [P] Create `PaperReviewAccess` authorization model for editor paper-scope checks in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/paper-review-access.js`
- [ ] T008 Implement editor authorization service for list/detail endpoints in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/review-view/editor-review-authorization-service.js`
- [ ] T009 [P] Implement completed-review query service filtering to submitted-only records in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/review-view/completed-review-query-service.js`
- [ ] T010 [P] Implement anonymization projection service for list/detail payload shaping in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/review-view/anonymized-review-projection-service.js`
- [ ] T011 Implement retrieval outcome/error classification service (`none_available`, `unauthorized`, `retrieval_error`, `review_not_found`) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/review-view/review-retrieval-outcome-service.js`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - View completed reviews list for a paper (Priority: P1) MVP

**Goal**: Let authorized editors open a paper and see only completed (`submitted`) reviews.

**Independent Test**: Open View Reviews for paper with mixed submitted/draft reviews and verify list contains submitted reviews only.

### Tests for User Story 1

- [ ] T012 [P] [US1] Add contract test for successful completed-review list response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/review-view/get-completed-reviews-list.contract.test.js`
- [ ] T013 [P] [US1] Add contract test ensuring draft/incomplete reviews are excluded from list in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/review-view/get-completed-reviews-filtering.contract.test.js`
- [ ] T014 [P] [US1] Add integration test for editor View Reviews list flow with completed-only entries in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/review-view/completed-review-list.integration.test.js`

### Implementation for User Story 1

- [ ] T015 [P] [US1] Implement completed-review list controller in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/review-view/get-completed-reviews-controller.js`
- [ ] T016 [US1] Implement list orchestration combining auth + completed filter + anonymized projection in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/review-view/get-completed-reviews-service.js`
- [ ] T017 [US1] Implement empty-list/no-completed-reviews response branch in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/review-view/get-completed-reviews-service.js`
- [ ] T018 [P] [US1] Implement frontend completed-review list rendering and select-review action in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/completed-reviews.html`
- [ ] T019 [US1] Implement frontend list refresh and stable list state after reload in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/review-view/anonymized-review-view-controller.js`

**Checkpoint**: US1 delivers MVP completed-review listing.

---

## Phase 4: User Story 2 - Open anonymized review content (Priority: P2)

**Goal**: Allow editors to open full completed review content with referee identity fully hidden.

**Independent Test**: Open review detail and verify full content is shown with no identity fields in list/detail/metadata.

### Tests for User Story 2

- [ ] T020 [P] [US2] Add contract test for anonymized review detail response (`identityRemoved=true`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/review-view/get-anonymized-review-detail.contract.test.js`
- [ ] T021 [P] [US2] Add contract test asserting identity-bearing fields are absent from list/detail payloads in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/review-view/get-anonymization-no-identity-fields.contract.test.js`
- [ ] T022 [P] [US2] Add integration test for open-review detail flow from list and return-to-list continuity in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/review-view/open-anonymized-review.integration.test.js`

### Implementation for User Story 2

- [ ] T023 [US2] Implement review detail controller for completed anonymized review open in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/review-view/get-completed-review-detail-controller.js`
- [ ] T024 [US2] Implement detail retrieval + anonymization service path in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/review-view/get-completed-review-detail-service.js`
- [ ] T025 [P] [US2] Implement frontend review detail rendering without identity metadata in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/anonymized-review-detail.html`
- [ ] T026 [US2] Enforce no identity exposure in controller/view mappers for both list and detail in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/review-view/anonymized-review-detail-controller.js`

**Checkpoint**: US2 enforces anonymized review consumption.

---

## Phase 5: User Story 3 - Handle no-data, authorization, and retrieval failures (Priority: P3)

**Goal**: Provide explicit, safe failure feedback for empty, unauthorized, list failure, and detail-open failure cases.

**Independent Test**: Simulate no completed reviews, unauthorized access, list retrieval failure, and missing review detail; verify explicit errors and continued usability.

### Tests for User Story 3

- [ ] T027 [P] [US3] Add contract test for unauthorized list/detail access (`403`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/review-view/get-completed-reviews-unauthorized.contract.test.js`
- [ ] T028 [P] [US3] Add contract test for list retrieval failure (`500`) returning no list data in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/review-view/get-completed-reviews-failure.contract.test.js`
- [ ] T029 [P] [US3] Add contract test for review-open unavailable (`404`) with return-to-list support in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/review-view/get-completed-review-open-failure.contract.test.js`
- [ ] T030 [P] [US3] Add integration test covering no-completed-reviews empty state and single-review open failure recovery in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/review-view/failure-and-empty-states.integration.test.js`

### Implementation for User Story 3

- [ ] T031 [US3] Implement authorization-failure handling with no data leakage in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/review-view/review-view-authorization-error-mapper.js`
- [ ] T032 [US3] Implement list/detail retrieval failure mapping and fallback payload behavior in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/review-view/review-view-failure-mapper.js`
- [ ] T033 [US3] Implement frontend empty-state, unauthorized, and retrieval-failure messaging in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/review-view-state-feedback.js`
- [ ] T034 [P] [US3] Implement frontend review-open failure recovery path back to completed list in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/review-view/review-open-failure-controller.js`

**Checkpoint**: US3 completes robust error handling.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final parity across contracts/docs and quality checks.

- [ ] T035 [P] Update contract examples/error payloads to match final anonymized-view behavior in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc13-anonymized-review-view/contracts/view-anonymized-reviews.openapi.yaml`
- [ ] T036 Update quickstart with final empty/unauthorized/retrieval-failure verification steps in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc13-anonymized-review-view/quickstart.md`
- [ ] T037 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-13.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-13-AT.md` if user-facing behavior wording changed during implementation
- [ ] T038 Run `npm test && npm run lint` and record UC-13 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc13-anonymized-review-view/quickstart.md`

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
- US2 (P2) depends on shared anonymization projection services.
- US3 (P3) depends on shared authorization and retrieval outcome services.

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

## Parallel Example: User Story 1

```bash
Task: "T012 [US1] Add completed-review list contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/review-view/get-completed-reviews-list.contract.test.js"
Task: "T013 [US1] Add completed-only filtering contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/review-view/get-completed-reviews-filtering.contract.test.js"
Task: "T014 [US1] Add completed-review list integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/review-view/completed-review-list.integration.test.js"
Task: "T018 [US1] Implement completed-review list rendering in /mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/completed-reviews.html"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy completed-review list MVP.

### Incremental Delivery

1. Add US2 anonymized detail viewing.
2. Add US3 failure and authorization handling.
3. Complete polish and regression.

### Validation Gates

- Only submitted reviews appear in editor completed-review list.
- All identity-bearing fields are stripped from editor-facing list/detail payloads.
- Unauthorized and retrieval failures return explicit safe feedback with no data leak.
