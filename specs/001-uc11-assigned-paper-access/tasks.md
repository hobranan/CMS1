# Tasks: UC-11 Access assigned papers and review forms

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/plan.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/contracts/assigned-paper-access.openapi.yaml`

**Tests**: Include contract and integration tests because UC-11 acceptance criteria require assignment-scoped access, view-only manuscript enforcement, pre-generated form access, and failure-path handling.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-11.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-11-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare assigned-paper access endpoints, referee access UI shells, and test scaffolding.

- [X] T001 Create assigned-access feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/assigned-access/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assigned-access/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/assigned-access/`
- [X] T002 [P] Register assigned-papers/manuscript-view/review-form routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/assigned-access/routes.js`
- [X] T003 [P] Create referee assigned-paper list/detail UI/controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/assigned-papers.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/assigned-access/assigned-paper-access-controller.js`
- [X] T004 [P] Add UC-11 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assigned-access/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/assigned-access/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared assignment authorization, resource retrieval, and view-only enforcement foundations.

- [X] T005 Create `AssignedPaper` model with assignment-status access guards in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/assigned-paper.js`
- [X] T006 [P] Create `ManuscriptViewResource` model enforcing `view_only` mode in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/manuscript-view-resource.js`
- [X] T007 [P] Create `ReviewForm` access model requiring pre-generated form availability in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/review-form-access.js`
- [X] T008 Implement assignment ownership authorization service for list/detail/resource requests in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assigned-access/assignment-authorization-service.js`
- [X] T009 [P] Implement assigned-paper query service scoped to logged-in referee in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assigned-access/assigned-paper-query-service.js`
- [X] T010 [P] Implement manuscript and review-form retrieval service with unavailable-resource classification in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assigned-access/assigned-resource-retrieval-service.js`
- [X] T011 Implement access outcome/error mapping service (`unauthorized`, `unavailable`, `system_error`) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assigned-access/access-outcome-mapping-service.js`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - Access assigned papers and open resources (Priority: P1) MVP

**Goal**: Allow authenticated referees to see assigned papers, open manuscript in view-only mode, and open pre-generated review forms.

**Independent Test**: Load assigned list, open assigned paper manuscript and review form, verify manuscript is view-only and review form is shown.

### Tests for User Story 1

- [X] T012 [P] [US1] Add contract test for `GET /api/v1/referees/{refereeId}/assigned-papers` success/empty responses in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assigned-access/get-assigned-papers.contract.test.js`
- [X] T013 [P] [US1] Add contract test for `GET /api/v1/papers/{paperId}/manuscript-view` returning `accessMode=view_only` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assigned-access/get-manuscript-view.contract.test.js`
- [X] T014 [P] [US1] Add contract test for `GET /api/v1/papers/{paperId}/review-form` pre-generated form access in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assigned-access/get-review-form.contract.test.js`

### Implementation for User Story 1

- [X] T015 [P] [US1] Implement assigned-paper list controller in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/assigned-access/get-assigned-papers-controller.js`
- [X] T016 [US1] Implement manuscript-view controller with view-only response shaping in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/assigned-access/get-manuscript-view-controller.js`
- [X] T017 [US1] Implement review-form access controller for pre-generated forms in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/assigned-access/get-review-form-controller.js`
- [X] T018 [P] [US1] Implement frontend assigned-paper list rendering and selection in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/assigned-papers.html`
- [X] T019 [US1] Implement frontend manuscript/review-form open actions and success states in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/assigned-access/assigned-paper-access-controller.js`

**Checkpoint**: US1 delivers MVP assigned-resource access.

---

## Phase 4: User Story 2 - Enforce assignment-based authorization (Priority: P2)

**Goal**: Block non-assigned access attempts and ensure no unauthorized resource disclosure.

**Independent Test**: Attempt direct URL and UI access to non-assigned papers; verify authorization errors and no resource leak.

### Tests for User Story 2

- [X] T020 [P] [US2] Add contract test for `403` non-assigned manuscript/review-form access in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assigned-access/get-non-assigned-resource-forbidden.contract.test.js`
- [X] T021 [P] [US2] Add integration test for direct URL non-assigned access blocking in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/assigned-access/direct-url-authorization.integration.test.js`
- [X] T022 [P] [US2] Add integration test for no-assigned-papers empty-state message with no links in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/assigned-access/no-assigned-papers-empty-state.integration.test.js`

### Implementation for User Story 2

- [X] T023 [US2] Implement per-request assignment ownership revalidation in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assigned-access/assignment-authorization-service.js`
- [X] T024 [US2] Implement authorization error responses with no data disclosure in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/assigned-access/assigned-access-error-mapper.js`
- [X] T025 [P] [US2] Implement frontend unauthorized-access and no-assignment messaging in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/assigned-access-state-feedback.js`
- [X] T026 [US2] Prevent manuscript download/export actions in UI and response payloads in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/assigned-access/assigned-paper-access-controller.js`

**Checkpoint**: US2 enforces assignment-scoped confidentiality.

---

## Phase 5: User Story 3 - Handle unavailable data and system failures (Priority: P3)

**Goal**: Return clear resource-specific failures for assigned referees without exposing unauthorized data.

**Independent Test**: Simulate list retrieval failure, manuscript unavailable, and review-form unavailable; verify explicit errors and retry guidance.

### Tests for User Story 3

- [X] T027 [P] [US3] Add contract test for assigned-paper list retrieval failure (`500`) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assigned-access/get-assigned-papers-failure.contract.test.js`
- [X] T028 [P] [US3] Add contract test for manuscript unavailable (`404`) with assigned access in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assigned-access/get-manuscript-unavailable.contract.test.js`
- [X] T029 [P] [US3] Add contract test for review-form unavailable (`404`) with assigned access in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assigned-access/get-review-form-unavailable.contract.test.js`
- [X] T030 [P] [US3] Add integration test for refresh consistency after successful access and subsequent failures in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/assigned-access/refresh-consistency.integration.test.js`

### Implementation for User Story 3

- [X] T031 [US3] Implement list/manuscript/review-form failure classification in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/assigned-access/assigned-resource-retrieval-service.js`
- [X] T032 [US3] Implement failure response mapper with retry guidance and no leaked metadata in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/assigned-access/assigned-access-failure-mapper.js`
- [X] T033 [US3] Implement refresh re-fetch policy and fallback states in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/assigned-access/assigned-paper-access-refresh-controller.js`
- [X] T034 [P] [US3] Implement frontend resource-specific error UI for unavailable manuscript/review form/list failures in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/assigned-access-errors.js`

**Checkpoint**: US3 completes resilient access behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finalize contract/docs parity and quality gates.

- [X] T035 [P] Update API contract examples/error payloads to match final access behavior in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/contracts/assigned-paper-access.openapi.yaml`
- [X] T036 Update quickstart with final authorization/failure verification steps in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/quickstart.md`
- [X] T037 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-11.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-11-AT.md` and record whether user-facing behavior wording changes were required during implementation
- [X] T038 Run `npm test && npm run lint` and record UC-11 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/quickstart.md`

- [X] T039 Validate frontend HTML/CSS compliance against `/mnt/c/Users/ponti/Desktop/CMS1/docs/standards/html-css-style-profile.md` and record checks in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc11-assigned-paper-access/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks all story phases.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after base controllers/services exist.
- Phase 6 -> depends on selected story completion.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends on shared assignment-authorization services.
- US3 (P3) depends on shared retrieval/error classification services.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and should fail before full pass.
- Service/model behavior before controller error mapping.
- Backend behavior before frontend feedback wiring.

---

## Parallel Opportunities

- Setup: `T002`, `T003`, `T004`.
- Foundational: `T006`, `T007`, `T009`, `T010`.
- US1: `T012`, `T013`, `T014`, `T015`, `T018`.
- US2: `T020`, `T021`, `T022`, `T025`.
- US3: `T027`, `T028`, `T029`, `T030`.

---

## Parallel Example: User Story 3

```bash
Task: "T027 [US3] Add assigned-list retrieval failure contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assigned-access/get-assigned-papers-failure.contract.test.js"
Task: "T028 [US3] Add manuscript-unavailable contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assigned-access/get-manuscript-unavailable.contract.test.js"
Task: "T029 [US3] Add review-form-unavailable contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/assigned-access/get-review-form-unavailable.contract.test.js"
Task: "T030 [US3] Add refresh-consistency integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/assigned-access/refresh-consistency.integration.test.js"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy assigned-paper access MVP.

### Incremental Delivery

1. Add US2 assignment-based authorization enforcement.
2. Add US3 unavailable-resource and system-failure resilience.
3. Finish polish and full regression.

### Validation Gates

- Assigned-paper list and resources are scoped strictly to the authenticated referee's active assignments.
- Manuscript access remains view-only with no download/export capability.
- Review forms are pre-generated and never generated on-demand in this flow.
