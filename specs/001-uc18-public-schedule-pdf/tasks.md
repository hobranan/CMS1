# Tasks: UC-18 View final conference schedule (Public PDF)

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc18-public-schedule-pdf/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc18-public-schedule-pdf/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc18-public-schedule-pdf/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc18-public-schedule-pdf/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc18-public-schedule-pdf/contracts/public-schedule-pdf.openapi.yaml`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc18-public-schedule-pdf/quickstart.md`

**Tests**: Include contract and integration tests because UC-18 requires public access gating, PDF view/export behavior, policy-based field filtering, and failure-safe responses.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-18.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-18-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare public schedule endpoints, PDF delivery surface, and test scaffolding.

- [ ] T001 Create public-schedule feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-schedule/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-schedule/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-schedule/`
- [ ] T002 [P] Register public schedule list/detail/pdf routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-schedule/routes.js`
- [ ] T003 [P] Create frontend public schedule and detail view/controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/public-schedule/public-schedule.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-schedule/public-schedule-controller.js`
- [ ] T004 [P] Add UC-18 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-schedule/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-schedule/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement publication-state gating, detail shaping, PDF artifact service, and error mapping.

- [ ] T005 Create `PublicScheduleAvailability` model for published/unpublished gating in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/public-schedule-availability.js`
- [ ] T006 [P] Create `PublishedSchedule` and `ScheduleEntry` models with required core fields in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/public-schedule-models.js`
- [ ] T007 [P] Create `ScheduleDetailProjection` model with visible/restricted/unavailable fields in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/schedule-detail-projection.js`
- [ ] T008 [P] Create `PublicPdfArtifact` model and metadata mapper in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/public-pdf-artifact.js`
- [ ] T009 Implement publication-state loader service to block unpublished content in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-schedule/publication-state-service.js`
- [ ] T010 [P] Implement public schedule retrieval service grouped by day/session in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-schedule/public-schedule-retrieval-service.js`
- [ ] T011 [P] Implement detail projection service with unavailable markers in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-schedule/public-schedule-detail-service.js`
- [ ] T012 [P] Implement policy-based field restriction service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-schedule/field-restriction-policy-service.js`
- [ ] T013 [P] Implement PDF view/export service (inline vs attachment disposition) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-schedule/public-schedule-pdf-service.js`
- [ ] T014 Implement public schedule API error mapper for `404`/`500` outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-schedule/public-schedule-error-mapper.js`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - Publicly view published conference schedule (Priority: P1) MVP

**Goal**: Any user can open published schedule without authentication and see grouped day/session content.

**Independent Test**: Unauthenticated request loads published schedule; unpublished request returns not-available message with no final schedule content.

### Tests for User Story 1

- [ ] T015 [P] [US1] Add contract test for successful `GET /api/v1/public/conferences/{conferenceId}/schedule` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-schedule/get-public-schedule.contract.test.js`
- [ ] T016 [P] [US1] Add contract test for unpublished schedule `404` not-available response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-schedule/get-public-schedule-not-published.contract.test.js`
- [ ] T017 [P] [US1] Add integration test for unauthenticated published schedule access in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-schedule/public-access-published.integration.test.js`
- [ ] T018 [P] [US1] Add integration test for direct-link access and stable refresh behavior in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-schedule/direct-link-refresh-stability.integration.test.js`

### Implementation for User Story 1

- [ ] T019 [US1] Implement public schedule list controller with publication gating in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-schedule/get-public-schedule-controller.js`
- [ ] T020 [US1] Implement frontend public schedule loader for unauthenticated users in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-schedule/public-schedule-controller.js`
- [ ] T021 [US1] Implement frontend day/session grouped rendering with time/location in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/public-schedule/public-schedule.html`
- [ ] T022 [US1] Implement unpublished schedule not-available state view in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/public-schedule/public-schedule-unavailable.html`

**Checkpoint**: US1 delivers MVP public schedule visibility.

---

## Phase 4: User Story 2 - Open session details and PDF schedule artifacts (Priority: P2)

**Goal**: Users can open entry details and access schedule as PDF for viewing/export.

**Independent Test**: User opens entry detail with available fields and obtains PDF response for inline and attachment modes.

### Tests for User Story 2

- [ ] T023 [P] [US2] Add contract test for `GET /api/v1/public/conferences/{conferenceId}/schedule/entries/{entryId}` success in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-schedule/get-public-entry-detail.contract.test.js`
- [ ] T024 [P] [US2] Add contract test for `GET /api/v1/public/conferences/{conferenceId}/schedule.pdf` inline PDF response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-schedule/get-public-schedule-pdf-inline.contract.test.js`
- [ ] T025 [P] [US2] Add contract test for `GET /api/v1/public/conferences/{conferenceId}/schedule.pdf?disposition=attachment` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-schedule/get-public-schedule-pdf-attachment.contract.test.js`
- [ ] T026 [P] [US2] Add integration test for detail view with unavailable optional fields marker in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-schedule/detail-unavailable-fields.integration.test.js`

### Implementation for User Story 2

- [ ] T027 [US2] Implement public schedule detail controller in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-schedule/get-public-schedule-entry-controller.js`
- [ ] T028 [US2] Implement PDF endpoint controller with disposition handling in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-schedule/get-public-schedule-pdf-controller.js`
- [ ] T029 [US2] Implement frontend session detail panel and entry selection behavior in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-schedule/public-schedule-detail-controller.js`
- [ ] T030 [US2] Implement frontend PDF view/export actions in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-schedule/public-schedule-pdf-controller.js`
- [ ] T031 [US2] Implement public session detail view template with unavailable markers in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/public-schedule/public-schedule-detail.html`

**Checkpoint**: US2 provides detail browsing plus PDF view/export.

---

## Phase 5: User Story 3 - Handle failures and policy-based restrictions safely (Priority: P3)

**Goal**: Retrieval failures and policy restrictions are handled with explicit feedback and safe field visibility.

**Independent Test**: Simulated retrieval failures return error states with no leaked content; restricted fields are hidden while allowed fields remain visible.

### Tests for User Story 3

- [ ] T032 [P] [US3] Add contract test for schedule retrieval `500` error response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-schedule/get-public-schedule-retrieval-failure.contract.test.js`
- [ ] T033 [P] [US3] Add contract test for entry detail `404` unavailable response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-schedule/get-public-entry-detail-not-found.contract.test.js`
- [ ] T034 [P] [US3] Add contract test for PDF retrieval `500` error response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-schedule/get-public-schedule-pdf-failure.contract.test.js`
- [ ] T035 [P] [US3] Add integration test for restricted-field policy behavior (restricted hidden, allowed visible) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-schedule/restricted-field-policy.integration.test.js`
- [ ] T036 [P] [US3] Add integration test for schedule-list success with single-detail retrieval failure handling in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-schedule/detail-record-failure-handling.integration.test.js`

### Implementation for User Story 3

- [ ] T037 [US3] Implement retrieval-failure safe response handling in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-schedule/public-schedule-retrieval-service.js`
- [ ] T038 [US3] Implement restricted-field projection in detail response mapper in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-schedule/public-schedule-detail-response-mapper.js`
- [ ] T039 [US3] Implement frontend retrieval-error states for schedule/detail/pdf paths in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-schedule/public-schedule-error-feedback-controller.js`
- [ ] T040 [US3] Implement frontend policy-restriction indicators in detail UI in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/public-schedule/public-schedule-detail-policy-notes.html`

**Checkpoint**: US3 completes safe failure and restriction handling.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final observability, stability verification, and traceability.

- [ ] T041 [P] Add telemetry for public schedule/PDF request latency and failure codes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-schedule/public-schedule-observability-service.js`
- [ ] T042 [P] Add high-access PDF response stability test in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-schedule/pdf-high-volume-stability.integration.test.js`
- [ ] T043 [P] Add contract test for `GET /api/v1/public/conferences/{conferenceId}/schedule.pdf` unpublished `404` response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-schedule/get-public-schedule-pdf-not-published.contract.test.js`
- [ ] T044 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-18.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-18-AT.md` if user-facing wording changed during implementation
- [ ] T045 Run `npm test && npm run lint` and record UC-18 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc18-public-schedule-pdf/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks all story phases.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1 after public list endpoint baseline exists.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after detail/PDF foundations exist.
- Phase 6 -> depends on selected story completion.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends on shared publication gating and schedule retrieval services.
- US3 (P3) depends on shared detail/PDF response shaping and error-mapping services.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and should fail before full pass.
- Service/model behavior before controller response mapping.
- Backend behavior before frontend feedback wiring.

---

## Parallel Opportunities

- Setup: `T002`, `T003`, `T004`.
- Foundational: `T006`, `T007`, `T008`, `T010`, `T011`, `T012`, `T013`.
- US1: `T015`, `T016`, `T017`, `T018`.
- US2: `T023`, `T024`, `T025`, `T026`.
- US3: `T032`, `T033`, `T034`, `T035`, `T036`.

---

## Parallel Example: User Story 2

```bash
Task: "T023 [US2] Add public entry detail contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-schedule/get-public-entry-detail.contract.test.js"
Task: "T024 [US2] Add inline PDF contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-schedule/get-public-schedule-pdf-inline.contract.test.js"
Task: "T025 [US2] Add attachment PDF contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-schedule/get-public-schedule-pdf-attachment.contract.test.js"
Task: "T026 [US2] Add unavailable-field marker integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-schedule/detail-unavailable-fields.integration.test.js"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy public published schedule browsing MVP.

### Incremental Delivery

1. Add US2 session detail and PDF view/export behavior.
2. Add US3 failure-safe and policy-restriction behavior.
3. Complete polish and full regression.

### Validation Gates

- Only published schedules are exposed publicly as final content.
- Public schedule viewing and export both use PDF format.
- Restricted fields are hidden while non-restricted fields remain visible.
- Retrieval failures return explicit error responses without leaking final schedule content.
