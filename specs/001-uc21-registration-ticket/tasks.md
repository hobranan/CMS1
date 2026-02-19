# Tasks: UC-21 Issue registration ticket confirmation

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc21-registration-ticket/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc21-registration-ticket/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc21-registration-ticket/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc21-registration-ticket/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc21-registration-ticket/contracts/registration-ticket.openapi.yaml`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc21-registration-ticket/quickstart.md`

**Tests**: Include contract and integration tests because UC-21 requires strict post-payment issuance gating, PDF storage/retrieval durability, and failure-safe fallback behavior.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-21.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-21-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare ticket issuance/retrieval modules and test scaffolding.

- [ ] T001 Create registration-ticket feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/tickets/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/tickets/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/tickets/`
- [ ] T002 [P] Register ticket issue/metadata/pdf routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/tickets/routes.js`
- [ ] T003 [P] Create frontend confirmation and account-ticket view/controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/tickets/registration-ticket.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/tickets/registration-ticket-controller.js`
- [ ] T004 [P] Add UC-21 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/tickets/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/tickets/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement payment-state gating, ticket artifact models, storage/retrieval primitives, and error mapping.

- [ ] T005 Create `PaymentConfirmationState` model with issuance eligibility checks in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/payment-confirmation-state.js`
- [ ] T006 [P] Create `RegistrationTicket` model with unique ticket reference and issuance-state invariants in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/registration-ticket.js`
- [ ] T007 [P] Create `TicketPdfRecord` model with storage/retrieval availability fields in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/ticket-pdf-record.js`
- [ ] T008 [P] Create `TicketDeliveryOutcome` model with channel-level delivery states in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/ticket-delivery-outcome.js`
- [ ] T009 [P] Create `TicketRetrievalAccess` model for confirmation/account retrieval outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/ticket-retrieval-access.js`
- [ ] T010 Implement ticket-issuance eligibility service (confirmed_recorded payment only) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/tickets/ticket-issuance-eligibility-service.js`
- [ ] T011 [P] Implement unique ticket-reference generator service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/tickets/ticket-reference-service.js`
- [ ] T012 [P] Implement QR payload generation service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/tickets/ticket-qr-service.js`
- [ ] T013 [P] Implement PDF ticket generation service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/tickets/ticket-pdf-generation-service.js`
- [ ] T014 [P] Implement ticket PDF storage/retrieval service with idempotent lookup in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/tickets/ticket-pdf-storage-service.js`
- [ ] T015 Implement ticket API error mapper for pending/not-found/storage-unavailable/failure outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/tickets/ticket-error-mapper.js`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - Receive ticket after confirmed payment (Priority: P1) MVP

**Goal**: After confirmed and recorded payment, attendee receives ticket confirmation with reference and QR.

**Independent Test**: Confirmed payment triggers issued ticket with reference + QR + PDF format and on-screen confirmation.

### Tests for User Story 1

- [ ] T016 [P] [US1] Add contract test for successful ticket issuance `POST /api/v1/registrations/{registrationId}/ticket/issue` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/tickets/post-issue-ticket-success.contract.test.js`
- [ ] T017 [P] [US1] Add contract test for ticket metadata retrieval success in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/tickets/get-ticket-metadata-success.contract.test.js`
- [ ] T018 [P] [US1] Add integration test for successful payment-to-ticket issuance workflow in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/tickets/payment-confirmed-ticket-issued.integration.test.js`
- [ ] T019 [P] [US1] Add integration test for confirmation-page display including ticket reference and QR marker in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/tickets/confirmation-page-ticket-details.integration.test.js`

### Implementation for User Story 1

- [ ] T020 [US1] Implement ticket issuance controller orchestration in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/tickets/post-issue-ticket-controller.js`
- [ ] T021 [US1] Implement ticket metadata controller for confirmation/account views in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/tickets/get-ticket-metadata-controller.js`
- [ ] T022 [P] [US1] Implement frontend confirmation-page ticket display controller in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/tickets/ticket-confirmation-controller.js`
- [ ] T023 [US1] Implement frontend registration ticket confirmation view template in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/tickets/registration-ticket.html`

**Checkpoint**: US1 delivers MVP issuance and confirmation display.

---

## Phase 4: User Story 2 - Retrieve and use stored PDF ticket later (Priority: P2)

**Goal**: Attendee can retrieve the same stored ticket PDF later from account area across sessions/devices.

**Independent Test**: Issued ticket remains retrievable as PDF after logout/login and repeated access requests return same artifact.

### Tests for User Story 2

- [ ] T024 [P] [US2] Add contract test for ticket PDF retrieval success `GET /api/v1/account/registrations/{registrationId}/ticket.pdf` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/tickets/get-ticket-pdf-success.contract.test.js`
- [ ] T025 [P] [US2] Add integration test for account-area ticket retrieval after navigation away in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/tickets/account-retrieval-after-navigation.integration.test.js`
- [ ] T026 [P] [US2] Add integration test for ticket retrieval across new session/device in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/tickets/account-retrieval-new-session-device.integration.test.js`
- [ ] T027 [P] [US2] Add integration test for duplicate short-interval retrieval requests returning same artifact in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/tickets/repeated-retrieval-same-artifact.integration.test.js`

### Implementation for User Story 2

- [ ] T028 [US2] Implement ticket PDF retrieval controller in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/tickets/get-ticket-pdf-controller.js`
- [ ] T029 [US2] Implement account-area ticket listing/retrieval controller in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/tickets/account-ticket-controller.js`
- [ ] T030 [US2] Implement account-area ticket PDF view trigger in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/tickets/account-ticket-view.html`
- [ ] T031 [US2] Implement backend idempotent ticket artifact lookup for repeated access in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/tickets/ticket-pdf-storage-service.js`

**Checkpoint**: US2 guarantees durable ticket retrieval.

---

## Phase 5: User Story 3 - Handle pending, delivery, generation, and storage failures (Priority: P3)

**Goal**: Pending and failure states are explicit, do not claim successful issuance falsely, and preserve retrieval when issuance/storage succeeded.

**Independent Test**: Pending payment blocks issuance; delivery failure still allows CMS retrieval; generation/storage failures return explicit failure states.

### Tests for User Story 3

- [ ] T032 [P] [US3] Add contract test for pending payment `409` on issue endpoint in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/tickets/post-issue-ticket-pending-payment.contract.test.js`
- [ ] T033 [P] [US3] Add contract test for ticket generation/storage failure `500` on issue endpoint in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/tickets/post-issue-ticket-failure.contract.test.js`
- [ ] T034 [P] [US3] Add contract test for ticket storage-unavailable `503` on PDF endpoint in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/tickets/get-ticket-pdf-storage-unavailable.contract.test.js`
- [ ] T035 [P] [US3] Add integration test for delivery failure preserving CMS retrieval in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/tickets/delivery-failed-cms-retrieval-preserved.integration.test.js`
- [ ] T036 [P] [US3] Add integration test for generation failure preventing issuance in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/tickets/generation-failure-no-ticket-issued.integration.test.js`
- [ ] T037 [P] [US3] Add integration test for storage failure warning and retrieval-unavailable guidance in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/tickets/storage-failure-retrieval-warning.integration.test.js`

### Implementation for User Story 3

- [ ] T038 [US3] Implement pending-payment issuance block service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/tickets/ticket-issuance-eligibility-service.js`
- [ ] T039 [US3] Implement delivery-failure fallback mapping with CMS retrieval preservation in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/tickets/ticket-delivery-outcome-mapper.js`
- [ ] T040 [US3] Implement generation/storage failure state handling service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/tickets/ticket-failure-handling-service.js`
- [ ] T041 [US3] Implement frontend pending/failure guidance controller for ticket outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/tickets/ticket-outcome-feedback-controller.js`

**Checkpoint**: US3 completes safe pending/failure behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final observability, traceability, and verification.

- [ ] T042 [P] Add ticket issuance/retrieval telemetry and failure counters in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/tickets/ticket-observability-service.js`
- [ ] T043 [P] Add performance verification tests for ticket issue and PDF retrieval latency in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/tickets/ticket-issue-retrieval-latency.integration.test.js`
- [ ] T044 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-21.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-21-AT.md` if user-facing wording changed during implementation
- [ ] T045 Run `npm test && npm run lint` and record UC-21 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc21-registration-ticket/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks all story phases.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1 after issuance baseline exists.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after failure-state primitives exist.
- Phase 6 -> depends on selected story completion.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends on shared PDF storage and metadata retrieval services.
- US3 (P3) depends on shared issuance gate, delivery-outcome, and failure-state services.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and should fail before full pass.
- Service/model behavior before controller response mapping.
- Backend behavior before frontend feedback wiring.

---

## Parallel Opportunities

- Setup: `T002`, `T003`, `T004`.
- Foundational: `T006`, `T007`, `T008`, `T009`, `T011`, `T012`, `T013`, `T014`.
- US1: `T016`, `T017`, `T018`, `T019`, `T022`.
- US2: `T024`, `T025`, `T026`, `T027`.
- US3: `T032`, `T033`, `T034`, `T035`, `T036`, `T037`.

---

## Parallel Example: User Story 2

```bash
Task: "T024 [US2] Add ticket PDF retrieval success contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/tickets/get-ticket-pdf-success.contract.test.js"
Task: "T025 [US2] Add account retrieval after navigation integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/tickets/account-retrieval-after-navigation.integration.test.js"
Task: "T026 [US2] Add new session/device retrieval integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/tickets/account-retrieval-new-session-device.integration.test.js"
Task: "T027 [US2] Add repeated retrieval same-artifact integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/tickets/repeated-retrieval-same-artifact.integration.test.js"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy post-payment ticket issuance MVP.

### Incremental Delivery

1. Add US2 durable account-area PDF retrieval flows.
2. Add US3 pending/delivery/generation/storage failure safeguards.
3. Complete polish and full regression.

### Validation Gates

- Ticket issuance occurs only after confirmed and recorded payment.
- Each issued ticket includes unique reference and QR code and is stored as PDF.
- Delivery failures never remove successful CMS retrieval.
- Generation/storage failures never claim successful retrievable issuance.
