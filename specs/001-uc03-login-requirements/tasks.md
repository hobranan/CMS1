# Tasks: Authenticate registered users

**Input**: Design documents from `/specs/001-uc03-login-requirements/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include contract and integration tests because plan/quickstart explicitly require coverage for success, validation failures, lockout, credential-store outage, and session continuity.
**Use Cases**: Tasks MUST reference and keep `UC-03.md` and `UC-03-AT.md` in sync when user-facing behavior changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize UC-03 authentication scaffolding across MVC layers.

- [X] T001 Create authentication module skeleton files in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/login_routes.js`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/login_controller.js`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/auth/login_service.js`, `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/login_controller.js`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/login_view.js`
- [X] T002 Add login/lockout configuration constants (threshold=5, lockout=15m) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/config/login_policy_config.js`
- [X] T003 [P] Create authentication contract test fixtures in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/fixtures/login_payloads.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement shared auth persistence/session/lockout services required by all stories.

**CRITICAL**: No user story work begins until this phase is complete.

- [X] T004 Implement credential lookup repository for registered email identities in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/credential_store_repository.js`
- [X] T005 [P] Implement password hash verification utility in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/security/password_verifier.js`
- [X] T006 [P] Implement lockout state repository (`failed_attempt_count`, `lockout_expires_at`) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/lockout_state_repository.js`
- [X] T007 [P] Implement lockout policy service (increment/lock/reset/expiry checks) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/auth/lockout_policy_service.js`
- [X] T008 [P] Implement authenticated session service and protected-page guard middleware in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/auth/session_service.js` and `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/middleware/session_guard.js`
- [X] T009 Implement login attempt audit/outcome recorder in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/login_attempt_repository.js`
- [X] T010 Implement standardized login response/error mapper for missing/invalid/lockout/system-failure responses in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/login_error_mapper.js`

**Checkpoint**: Foundation complete; user stories can be implemented.

---

## Phase 3: User Story 1 - Log in with valid credentials (Priority: P1) MVP

**Goal**: Authenticate registered users with valid email/password and maintain active session access to protected dashboard pages.

**Independent Test**: Submit valid credentials and confirm authentication + dashboard redirect, then refresh protected page during active session without login redirect.

### Tests for User Story 1

- [X] T011 [P] [US1] Add contract tests for successful login and session continuity endpoints in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/test_uc03_login_success_contract.js`
- [X] T012 [P] [US1] Add integration test for valid credential login and redirect behavior in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc03_login_success.js`
- [X] T013 [P] [US1] Add integration test for protected-page refresh during active session in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc03_session_continuity.js`

### Implementation for User Story 1

- [X] T014 [US1] Implement successful credential verification and session creation flow in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/auth/login_service.js`
- [X] T015 [US1] Implement login route/controller success path and dashboard redirect response in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/login_routes.js` and `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/login_controller.js`
- [X] T016 [US1] Implement protected resource session access check endpoint in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/session_controller.js`
- [X] T017 [US1] Implement frontend login submit and success navigation behavior in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/login_controller.js` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/login_view.js`

**Checkpoint**: US1 is independently functional and testable (MVP complete).

---

## Phase 4: User Story 2 - Correct missing required login fields (Priority: P2)

**Goal**: Reject incomplete login submissions with required-field feedback and keep users on login page.

**Independent Test**: Submit missing email and missing password cases; verify rejection, field-specific required messages, and no authentication/session creation.

### Tests for User Story 2

- [X] T018 [P] [US2] Add contract tests for missing-field login validation errors in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/test_uc03_login_required_fields_contract.js`
- [X] T019 [P] [US2] Add integration tests for missing email/password behavior in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc03_login_required_fields.js`

### Implementation for User Story 2

- [X] T020 [US2] Implement required-field validation gate before credential-store access in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/auth/login_validation_service.js`
- [X] T021 [US2] Implement field-level required feedback response handling in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/login_controller.js`
- [X] T022 [US2] Implement frontend required-field highlighting/messages and stay-on-page flow in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/login_validation_view.js`

**Checkpoint**: US2 is independently functional and testable.

---

## Phase 5: User Story 3 - Recover from invalid, locked, or unavailable authentication checks (Priority: P3)

**Goal**: Provide robust retry-oriented handling for unknown email, wrong password, lockout, and credential-store outage.

**Independent Test**: Verify unknown-email and wrong-password rejection, lockout at 5 failures with 15-minute deny window, and credential-store outage handling with retry-later message.

### Tests for User Story 3

- [X] T023 [P] [US3] Add contract tests for invalid credential, lockout, and system-failure responses in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/test_uc03_login_failure_contract.js`
- [X] T024 [P] [US3] Add integration tests for unknown-email and wrong-password outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc03_invalid_credentials.js`
- [X] T025 [P] [US3] Add integration tests for lockout trigger, active lockout denial, and reset-after-success/expiry behavior in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc03_lockout_policy.js`
- [X] T026 [P] [US3] Add integration test for credential-store unavailability handling in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc03_credential_store_outage.js`

### Implementation for User Story 3

- [X] T027 [US3] Implement unknown-email and wrong-password failure mapping using one generic message (`Invalid email or password.`) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/auth/login_failure_service.js`
- [X] T028 [US3] Integrate lockout policy enforcement (threshold, deny window, reset logic) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/auth/lockout_policy_service.js`
- [X] T029 [US3] Implement credential-store outage fail-closed path and retry-later response in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/auth/login_service.js`
- [X] T030 [US3] Implement frontend messaging flows for invalid/locked/system-failure outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/login_error_state_controller.js` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/login_error_state_view.js`

**Checkpoint**: All user stories are independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, observability, and UC artifact synchronization.

- [X] T031 [P] Add authentication observability (latency + failure category metrics) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/auth/login_observability_service.js`
- [X] T032 [P] Add unit tests for lockout and reset edge conditions in `/mnt/c/Users/ponti/Desktop/CMS1/tests/unit/test_uc03_lockout_policy.js`
- [X] T033 Update implementation alignment notes and `UC-03.md` / `UC-03-AT.md` sync checklist in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc03-login-requirements/tasks.md`
- [X] T034 Run `npm test && npm run lint` and capture UC-03 validation summary in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc03-login-requirements/validation-report.md`

- [X] T035 Validate UC-03 narrative and update any changed user-facing behavior details in `/mnt/c/Users/ponti/Desktop/CMS1/UC-03.md`
- [X] T036 Validate UC-03 acceptance tests and update scenarios/expected outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/UC-03-AT.md`

- [X] T037 Validate frontend HTML/CSS compliance against `/mnt/c/Users/ponti/Desktop/CMS1/docs/standards/html-css-style-profile.md` and record checks in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc03-login-requirements/quickstart.md`
- [X] T038 Add login p95 latency verification step against 400ms target in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc03_login_performance.integration.js`
- [X] T039 Add telemetry for failed-login recovery-within-two-attempts metric in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/auth/login_observability_service.js`
- [X] T040 Record SC-005 recovery metric calculation and evidence in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc03-login-requirements/validation-report.md`

- [ ] T041 Update implementation change log and reconcile UC-03 behavior traceability in `/mnt/c/Users/ponti/Desktop/CMS1/docs/implementation/implementation-log.md`, `/mnt/c/Users/ponti/Desktop/CMS1/UC-03.md`, and `/mnt/c/Users/ponti/Desktop/CMS1/UC-03-AT.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion; blocks all story work.
- **Phase 3 (US1)**: Depends on Phase 2 completion.
- **Phase 4 (US2)**: Depends on Phase 2 completion; may proceed after US1 API behavior is stable.
- **Phase 5 (US3)**: Depends on Phase 2 completion and login baseline from US1.
- **Phase 6 (Polish)**: Depends on all story phases.

### User Story Dependencies

- **US1 (P1)**: First deliverable and MVP baseline.
- **US2 (P2)**: Depends on core login endpoint availability from US1.
- **US3 (P3)**: Depends on baseline login flow and foundational lockout/session services.

### Within Each User Story

- Tests first (must fail before implementation).
- Backend service logic before API wiring.
- API behavior before frontend state rendering.

---

## Parallel Opportunities

- Setup: `T003`
- Foundational: `T005`, `T006`, `T007`, `T008`
- US1 tests: `T011-T013`
- US2 tests: `T018-T019`
- US3 tests: `T023-T026`
- Polish: `T031`, `T032`

---

## Parallel Example: User Story 3

```bash
# Parallel failure-path test implementation for US3
Task: "T023 Contract tests in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/test_uc03_login_failure_contract.js"
Task: "T024 Invalid-credentials integration tests in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc03_invalid_credentials.js"
Task: "T025 Lockout policy integration tests in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc03_lockout_policy.js"
Task: "T026 Credential-store outage integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc03_credential_store_outage.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (US1).
4. Validate independently with US1 tests and quickstart scenarios.

### Incremental Delivery

1. Deliver US1 login success/session continuity.
2. Add US2 required-field correction UX.
3. Add US3 resilience and lockout behavior.
4. Apply polish/hardening.

### Suggested MVP Scope

- **MVP**: Phases 1-3 (US1).
- **Post-MVP**: Phases 4-6.

---

## Notes

- All tasks use strict checklist format with IDs and explicit file paths.
- Story tasks include required `[US1]`, `[US2]`, `[US3]` labels.
- `[P]` markers are applied only where tasks are safely parallelizable.

## UC Sync Notes

- `UC-03.md` and `UC-03-AT.md` were revalidated and aligned to implemented behavior on 2026-02-20.



