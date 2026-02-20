# Tasks: UC-20 Pay registration fee online

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc20-online-payment/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc20-online-payment/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc20-online-payment/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc20-online-payment/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc20-online-payment/contracts/online-payment.openapi.yaml`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc20-online-payment/quickstart.md`

**Tests**: Include contract and integration tests because UC-20 requires payment-state integrity across success, cancel/decline/invalid, timeout, save-failure, and reconciliation outcomes.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-20.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-20-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare payment initiation/callback/status modules and test scaffolding.

- [ ] T001 Create online-payment feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/payments/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/payments/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/payments/`
- [ ] T002 [P] Register initiate/confirm/status payment routes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/payments/routes.js`
- [ ] T003 [P] Create frontend payment initiation and outcome view/controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/payments/online-payment.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/payments/online-payment-controller.js`
- [ ] T004 [P] Add UC-20 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/payments/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/payments/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement payment domain models, verification primitives, and safe persistence/state transitions.

- [ ] T005 Create `RegistrationPaymentAttempt` model with valid attempt lifecycle states in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/registration-payment-attempt.js`
- [ ] T006 [P] Create `GatewayConfirmationEvent` model with signature-verification fields in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/gateway-confirmation-event.js`
- [ ] T007 [P] Create `PaymentRecord` model with gateway reference invariants in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/payment-record.js`
- [ ] T008 [P] Create `RegistrationStatus` model with guarded state transitions in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/registration-status.js`
- [ ] T009 [P] Create `ReconciliationItem` model for unresolved/safe-failure follow-up in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/reconciliation-item.js`
- [ ] T010 Implement initiation eligibility service (auth + selected category + unpaid) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/payments/payment-initiation-eligibility-service.js`
- [ ] T011 [P] Implement gateway signature verification service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/payments/gateway-signature-verification-service.js`
- [ ] T012 [P] Implement registration payment-state transition guard service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/payments/registration-payment-state-service.js`
- [ ] T013 [P] Implement transactional payment persistence service with rollback semantics in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/payments/payment-record-persistence-service.js`
- [ ] T014 Implement payment API error mapper for conflict/invalid/cancel/decline/timeout/reconciliation outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/payments/payment-error-mapper.js`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - Complete online registration payment (Priority: P1) MVP

**Goal**: Authenticated attendee completes valid gateway payment, payment is recorded, and registration becomes Paid/Confirmed.

**Independent Test**: Successful initiation + gateway confirmation leads to persisted payment, confirmed registration, confirmation feedback, and status persistence across sessions.

### Tests for User Story 1

- [ ] T015 [P] [US1] Add contract test for successful initiation endpoint in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/payments/post-payment-initiate-success.contract.test.js`
- [ ] T016 [P] [US1] Add contract test for successful gateway confirmation callback in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/payments/post-gateway-confirm-success.contract.test.js`
- [ ] T017 [P] [US1] Add integration test for successful payment -> paid_confirmed transition in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/payments/payment-success-status-confirmed.integration.test.js`
- [ ] T018 [P] [US1] Add integration test for paid status persistence across refresh/re-login in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/payments/paid-status-persistence.integration.test.js`

### Implementation for User Story 1

- [ ] T019 [US1] Implement payment initiation controller with category/amount preview and gateway redirect response in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/payments/post-payment-initiate-controller.js`
- [ ] T020 [US1] Implement gateway confirmation controller orchestration (verify -> record -> confirm) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/payments/post-gateway-confirm-controller.js`
- [ ] T021 [US1] Implement payment status controller for attendee registration in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/payments/get-payment-status-controller.js`
- [ ] T022 [P] [US1] Implement frontend payment initiation page with selected category and total fee in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/payments/online-payment.html`
- [ ] T023 [US1] Implement frontend success confirmation and receipt/notification UI flow in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/payments/payment-success-controller.js`

**Checkpoint**: US1 delivers MVP successful payment confirmation path.

---

## Phase 4: User Story 2 - Handle user/payment declines and cancellations (Priority: P2)

**Goal**: Canceled, invalid-detail, and declined attempts keep registration unpaid and provide clear feedback.

**Independent Test**: Gateway cancel/invalid/decline outcomes return clear messaging and never persist paid_confirmed.

### Tests for User Story 2

- [ ] T024 [P] [US2] Add contract test for canceled gateway outcome in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/payments/post-gateway-confirm-canceled.contract.test.js`
- [ ] T025 [P] [US2] Add contract test for invalid-details gateway outcome in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/payments/post-gateway-confirm-invalid-details.contract.test.js`
- [ ] T026 [P] [US2] Add contract test for provider decline outcome in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/payments/post-gateway-confirm-declined.contract.test.js`
- [ ] T027 [P] [US2] Add integration test verifying unpaid-state preservation for all non-success outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/payments/non-success-outcomes-unpaid.integration.test.js`

### Implementation for User Story 2

- [ ] T028 [US2] Implement non-success payment outcome handling service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/payments/non-success-payment-outcome-service.js`
- [ ] T029 [US2] Implement cancel/invalid/decline response mapper in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/payments/payment-outcome-feedback-mapper.js`
- [ ] T030 [US2] Implement frontend non-success outcome messaging controller in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/payments/payment-failure-controller.js`

**Checkpoint**: US2 enforces unpaid-state integrity on non-success paths.

---

## Phase 5: User Story 3 - Handle unresolved and system-failure states safely (Priority: P3)

**Goal**: Timeout and DB save-failure states never auto-confirm registration and create explicit unresolved/reconciliation paths.

**Independent Test**: Timeout/save-failure flows return pending/reconciliation outcomes, keep registration not confirmed, and block duplicate paid confirmations.

### Tests for User Story 3

- [ ] T031 [P] [US3] Add contract test for timeout/missing-confirmation unresolved outcome in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/payments/post-gateway-confirm-timeout.contract.test.js`
- [ ] T032 [P] [US3] Add contract test for gateway-success + DB-save-failure reconciliation outcome in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/payments/post-gateway-confirm-save-failure.contract.test.js`
- [ ] T033 [P] [US3] Add integration test for unresolved pending/failed messaging without false confirmation in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/payments/unresolved-payment-messaging.integration.test.js`
- [ ] T034 [P] [US3] Add integration test for reconciliation-item creation on save failure in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/payments/reconciliation-item-created.integration.test.js`
- [ ] T035 [P] [US3] Add integration test for duplicate attempt blocked after successful payment in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/payments/duplicate-attempt-after-paid-blocked.integration.test.js`

### Implementation for User Story 3

- [ ] T036 [US3] Implement timeout/missing-confirmation resolution service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/payments/payment-timeout-resolution-service.js`
- [ ] T037 [US3] Implement reconciliation-item creation flow for unresolved save failures in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/payments/payment-reconciliation-service.js`
- [ ] T038 [US3] Implement duplicate-attempt guard for paid registrations in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/payments/payment-initiation-eligibility-service.js`
- [ ] T039 [US3] Implement frontend unresolved/reconciliation outcome controller in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/payments/payment-unresolved-controller.js`

**Checkpoint**: US3 completes unresolved and failure-safe behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final telemetry, performance, traceability, and verification.

- [ ] T040 [P] Add payment telemetry for initiation/confirmation outcomes and reconciliation counts in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/payments/payment-observability-service.js`
- [ ] T041 [P] Add payment-flow latency verification tests in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/payments/payment-flow-latency.integration.test.js`
- [ ] T042 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-20.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-20-AT.md` if user-facing wording changed during implementation
- [ ] T043 Run `npm test && npm run lint` and record UC-20 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc20-online-payment/quickstart.md`

- [ ] T044 Validate frontend HTML/CSS compliance against `/mnt/c/Users/ponti/Desktop/CMS1/docs/standards/html-css-style-profile.md` and record checks in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc20-online-payment/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks all story phases.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1 after callback baseline exists.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after timeout/reconciliation primitives exist.
- Phase 6 -> depends on selected story completion.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends on shared outcome-mapping and unpaid-state transition services.
- US3 (P3) depends on shared timeout/reconciliation and duplicate-attempt protection services.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and should fail before full pass.
- Service/model behavior before controller response mapping.
- Backend behavior before frontend feedback wiring.

---

## Parallel Opportunities

- Setup: `T002`, `T003`, `T004`.
- Foundational: `T006`, `T007`, `T008`, `T009`, `T011`, `T012`, `T013`.
- US1: `T015`, `T016`, `T017`, `T018`, `T022`.
- US2: `T024`, `T025`, `T026`, `T027`.
- US3: `T031`, `T032`, `T033`, `T034`, `T035`.

---

## Parallel Example: User Story 3

```bash
Task: "T031 [US3] Add timeout unresolved contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/payments/post-gateway-confirm-timeout.contract.test.js"
Task: "T032 [US3] Add save-failure reconciliation contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/payments/post-gateway-confirm-save-failure.contract.test.js"
Task: "T033 [US3] Add unresolved messaging integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/payments/unresolved-payment-messaging.integration.test.js"
Task: "T034 [US3] Add reconciliation-item creation integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/payments/reconciliation-item-created.integration.test.js"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy successful payment confirmation MVP.

### Incremental Delivery

1. Add US2 cancel/invalid/decline handling.
2. Add US3 unresolved timeout and reconciliation behavior.
3. Complete polish and full regression.

### Validation Gates

- Registration reaches `paid_confirmed` only after verified gateway success and persisted payment record.
- Canceled/invalid/declined attempts always remain unpaid.
- Timeout and save-failure paths never auto-confirm and create explicit unresolved/reconciliation handling.
- Confirmed status persists across refresh and re-login once validly completed.
