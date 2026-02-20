# Tasks: UC-19 View registration prices

**Input**: Design documents from `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc19-registration-prices/`
**Prerequisites**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc19-registration-prices/spec.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc19-registration-prices/research.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc19-registration-prices/data-model.md`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc19-registration-prices/contracts/registration-prices.openapi.yaml`, `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc19-registration-prices/quickstart.md`

**Tests**: Include contract and integration tests because UC-19 requires public access, CAD-only final pricing, no-discount enforcement, and robust unavailable/incomplete/failure handling.
**Use Cases**: Tasks must keep `/mnt/c/Users/ponti/Desktop/CMS1/UC-19.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-19-AT.md` in sync whenever user-facing behavior changes.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare public pricing endpoint/view and test scaffolding.

- [ ] T001 Create public-pricing feature folders in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-pricing/`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-pricing/`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-pricing/`
- [ ] T002 [P] Register public registration-prices route in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-pricing/routes.js`
- [ ] T003 [P] Create frontend public pricing view/controller shells in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/public-pricing/registration-prices.html` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-pricing/registration-prices-controller.js`
- [ ] T004 [P] Add UC-19 contract/integration test directories in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-pricing/` and `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-pricing/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement published-only gating, CAD/no-discount policy, projection, and safe error handling.

- [ ] T005 Create `PricingAvailabilityState` model for published/unpublished access gating in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/pricing-availability-state.js`
- [ ] T006 [P] Create `RegistrationPriceCategory` model with `final_amount_cad` and completeness flags in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/registration-price-category.js`
- [ ] T007 [P] Create `PublishedPricingSet` and projection model in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/published-pricing-set.js`
- [ ] T008 [P] Implement published-pricing retrieval service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-pricing/public-pricing-retrieval-service.js`
- [ ] T009 [P] Implement CAD formatting/labeling utility for zero- and two-decimal values in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-pricing/cad-formatting-service.js`
- [ ] T010 [P] Implement no-discount enforcement and response-shaping service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-pricing/no-discount-policy-service.js`
- [ ] T011 Implement incomplete-data projection service with missing-information flags in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-pricing/incomplete-pricing-projection-service.js`
- [ ] T012 Implement public-pricing API error mapper for unpublished/retrieval-failure outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-pricing/public-pricing-error-mapper.js`

**Checkpoint**: Foundation complete; user stories can proceed independently.

---

## Phase 3: User Story 1 - Publicly view published registration prices (Priority: P1) MVP

**Goal**: Guests and logged-in users can view published registration categories with final CAD prices.

**Independent Test**: Open public registration-prices page as guest and authenticated user, and verify same published categories/amounts in CAD.

### Tests for User Story 1

- [ ] T013 [P] [US1] Add contract test for successful `GET /api/v1/public/registration-prices` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-pricing/get-registration-prices.contract.test.js`
- [ ] T014 [P] [US1] Add integration test for guest access to published prices in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-pricing/guest-published-prices.integration.test.js`
- [ ] T015 [P] [US1] Add integration test for guest vs authenticated parity in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-pricing/guest-auth-parity.integration.test.js`
- [ ] T016 [P] [US1] Add integration test for CAD display formatting variants (0/2 decimals) in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-pricing/cad-format-variants.integration.test.js`

### Implementation for User Story 1

- [ ] T017 [US1] Implement public registration-prices controller in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-pricing/get-registration-prices-controller.js`
- [ ] T018 [US1] Implement frontend public pricing loader in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-pricing/registration-prices-controller.js`
- [ ] T019 [US1] Implement pricing table rendering with category/final-amount mapping in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/public-pricing/registration-prices.html`

**Checkpoint**: US1 delivers MVP public pricing visibility.

---

## Phase 4: User Story 2 - Handle unavailable or incomplete pricing data (Priority: P2)

**Goal**: Users get clear messages for unpublished, incomplete, and retrieval-failure states.

**Independent Test**: Simulate unpublished, incomplete categories, and retrieval failure; verify correct UI states and no misleading pricing table.

### Tests for User Story 2

- [ ] T020 [P] [US2] Add contract test for unpublished pricing `404` response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-pricing/get-registration-prices-not-published.contract.test.js`
- [ ] T021 [P] [US2] Add contract test for retrieval failure `500` response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-pricing/get-registration-prices-retrieval-failure.contract.test.js`
- [ ] T022 [P] [US2] Add integration test for incomplete category set with missing-information indicators in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-pricing/incomplete-pricing-indicators.integration.test.js`
- [ ] T023 [P] [US2] Add integration test for direct URL access to unpublished pricing page in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-pricing/direct-url-unpublished.integration.test.js`

### Implementation for User Story 2

- [ ] T024 [US2] Implement unpublished-pricing not-available frontend state in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/public-pricing/registration-prices-unavailable.html`
- [ ] T025 [US2] Implement incomplete-data rendering and missing-info markers in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/public-pricing/registration-prices-missing-info.html`
- [ ] T026 [US2] Implement retrieval-failure error-state controller in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-pricing/registration-prices-error-controller.js`

**Checkpoint**: US2 handles unavailable/incomplete/failure states safely.

---

## Phase 5: User Story 3 - Maintain consistent public pricing display (Priority: P3)

**Goal**: Published pricing remains stable across refresh and return visits for all users.

**Independent Test**: View published prices, refresh/revisit, and verify unchanged values; confirm no discount fields appear in responses/UI.

### Tests for User Story 3

- [ ] T027 [P] [US3] Add integration test for refresh/revisit pricing consistency in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-pricing/refresh-revisit-consistency.integration.test.js`
- [ ] T028 [P] [US3] Add integration test for temporary retrieval failure then recovery behavior in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-pricing/failure-then-recovery.integration.test.js`
- [ ] T029 [P] [US3] Add contract test asserting `discountApplied=false` and no discount fields in response in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-pricing/no-discount-response.contract.test.js`

### Implementation for User Story 3

- [ ] T030 [US3] Implement stable published-pricing snapshot read path in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-pricing/public-pricing-retrieval-service.js`
- [ ] T031 [US3] Implement response mapper enforcing final-price/no-discount schema in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/public-pricing/public-pricing-response-mapper.js`
- [ ] T032 [US3] Implement frontend consistency guard for unchanged published pricing across reloads in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/public-pricing/registration-prices-consistency-controller.js`

**Checkpoint**: US3 completes consistency/no-discount guarantees.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final observability, traceability, and verification.

- [ ] T033 [P] Add public-pricing telemetry (latency/error outcome counters) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/public-pricing/public-pricing-observability-service.js`
- [ ] T034 [P] Add performance verification test for public pricing latency target in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-pricing/public-pricing-latency.integration.test.js`
- [ ] T035 Update `/mnt/c/Users/ponti/Desktop/CMS1/UC-19.md` and `/mnt/c/Users/ponti/Desktop/CMS1/UC-19-AT.md` if user-facing wording changed during implementation
- [ ] T036 Run `npm test && npm run lint` and record UC-19 verification notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc19-registration-prices/quickstart.md`

- [ ] T037 Validate frontend HTML/CSS compliance against `/mnt/c/Users/ponti/Desktop/CMS1/docs/standards/html-css-style-profile.md` and record checks in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc19-registration-prices/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- Phase 1 -> no dependencies.
- Phase 2 -> depends on Phase 1 and blocks all story phases.
- Phase 3 (US1) -> depends on Phase 2.
- Phase 4 (US2) -> depends on Phase 2 and can run in parallel with US1 after public pricing endpoint baseline exists.
- Phase 5 (US3) -> depends on Phase 2 and can run in parallel with US2 after response-shaping foundations exist.
- Phase 6 -> depends on selected story completion.

### User Story Dependencies

- US1 (P1) is MVP and independent after foundational phase.
- US2 (P2) depends on shared availability/error mapping services.
- US3 (P3) depends on shared published snapshot and no-discount response mapping services.

### Within Each Story

- Contract/integration tests are authored before or alongside implementation and should fail before full pass.
- Service/model behavior before controller response mapping.
- Backend behavior before frontend feedback wiring.

---

## Parallel Opportunities

- Setup: `T002`, `T003`, `T004`.
- Foundational: `T006`, `T007`, `T008`, `T009`, `T010`.
- US1: `T013`, `T014`, `T015`, `T016`.
- US2: `T020`, `T021`, `T022`, `T023`.
- US3: `T027`, `T028`, `T029`.

---

## Parallel Example: User Story 2

```bash
Task: "T020 [US2] Add unpublished pricing 404 contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-pricing/get-registration-prices-not-published.contract.test.js"
Task: "T021 [US2] Add retrieval failure 500 contract test in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/public-pricing/get-registration-prices-retrieval-failure.contract.test.js"
Task: "T022 [US2] Add incomplete pricing indicators integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-pricing/incomplete-pricing-indicators.integration.test.js"
Task: "T023 [US2] Add direct URL unpublished integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/public-pricing/direct-url-unpublished.integration.test.js"
```

---

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1) and validate independently.
3. Demo/deploy public CAD registration pricing MVP.

### Incremental Delivery

1. Add US2 unpublished/incomplete/failure handling.
2. Add US3 consistency and no-discount guarantees.
3. Complete polish and full regression.

### Validation Gates

- Published pricing is publicly visible without authentication.
- All displayed prices are final CAD amounts with no discount calculations.
- Unpublished/failure states never show misleading pricing tables.
- Guest and authenticated users see identical published pricing values.
