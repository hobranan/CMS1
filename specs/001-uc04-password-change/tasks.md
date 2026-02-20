# Tasks: Change account password

**Input**: Design documents from `/specs/001-uc04-password-change/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include contract and integration tests because plan/quickstart explicitly require coverage for validation failures, password history checks, atomicity, and post-change re-authentication.
**Use Cases**: Tasks MUST reference and keep `UC-04.md` and `UC-04-AT.md` in sync when user-facing behavior changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize password-change feature structure and shared policy constants.

- [X] T001 Create password-change MVC scaffolding files in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/password_change_routes.js`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/password_change_controller.js`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/account/password_change_service.js`, `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/password_change_controller.js`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/password_change_view.js`
- [X] T002 Add password security policy constants (12+, composition, no spaces, history window=5) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/config/password_policy_config.js`
- [X] T003 [P] Create UC04 contract test fixtures for password-change payloads in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/fixtures/password_change_payloads.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement core credential, history, transaction, and session invalidation primitives.

**CRITICAL**: No user story work begins before this phase is complete.

- [X] T004 Implement credential repository access for current password hash retrieval/update in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/credential_repository.js`
- [X] T005 [P] Implement password hashing and secure comparison utilities in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/security/password_crypto_service.js`
- [X] T006 [P] Implement password history repository with last-5 retrieval and rotation in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/password_history_repository.js`
- [X] T007 [P] Implement password policy validator service (composition, no-space, current mismatch, history mismatch) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/security/password_policy_validator.js`
- [X] T008 [P] Implement atomic credential+history update transaction service in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/account/password_update_transaction_service.js`
- [X] T009 Implement session invalidation service for active session termination after successful password change in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/auth/session_invalidation_service.js`
- [X] T010 Implement password-change error/response mapper for required/current/mismatch/policy/system errors in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/password_change_error_mapper.js`

**Checkpoint**: Foundation complete; story implementation can begin.

---

## Phase 3: User Story 1 - Change password successfully (Priority: P1) MVP

**Goal**: Authenticated user changes password with valid current/new values and receives success confirmation.

**Independent Test**: Submit correct current password + compliant new password and verify credential updates; old password fails and new password succeeds on next login.

### Tests for User Story 1

- [X] T011 [P] [US1] Add contract tests for successful password change response and credential update semantics in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/test_uc04_password_change_success_contract.js`
- [X] T012 [P] [US1] Add integration test for successful password change and confirmation flow in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc04_password_change_success.js`
- [X] T013 [P] [US1] Add integration test for old-password-fails/new-password-succeeds login verification in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc04_post_change_login_behavior.js`

### Implementation for User Story 1

- [X] T014 [US1] Implement successful password-change orchestration (verify current, validate policy, transactional update) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/account/password_change_service.js`
- [X] T015 [US1] Implement password-change endpoint/controller success path in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/password_change_routes.js` and `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/password_change_controller.js`
- [X] T016 [US1] Implement frontend success flow and user confirmation messaging in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/password_change_controller.js` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/password_change_view.js`

**Checkpoint**: US1 independently functional and testable (MVP complete).

---

## Phase 4: User Story 2 - Get clear validation feedback for invalid input (Priority: P2)

**Goal**: Reject missing/incorrect/weak/mismatched submissions with specific feedback while preserving existing password.

**Independent Test**: Submit each invalid case independently and verify specific error messages with no credential change.

### Tests for User Story 2

- [X] T017 [P] [US2] Add contract tests for required-field/current-password/policy/mismatch error responses in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/test_uc04_password_change_validation_contract.js`
- [X] T018 [P] [US2] Add integration tests for missing-fields and incorrect-current-password cases in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc04_password_change_required_and_current_failures.js`
- [X] T019 [P] [US2] Add integration tests for weak-password/current-equals-new/history-reuse/mismatch failures in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc04_password_change_policy_failures.js`

### Implementation for User Story 2

- [X] T020 [US2] Implement required-field and confirmation-mismatch validation gate in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/account/password_change_validation_service.js`
- [X] T021 [US2] Implement backend error mapping for incorrect current password and password-policy violations in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/password_change_controller.js`
- [X] T022 [US2] Implement frontend field-level validation feedback and unchanged-state messaging in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/password_change_validation_view.js`

**Checkpoint**: US2 independently functional and testable.

---

## Phase 5: User Story 3 - Recover safely from system failures and re-authenticate (Priority: P3)

**Goal**: Preserve credential integrity on failures and enforce immediate re-authentication after successful changes.

**Independent Test**: Force credential-store failure and verify no update; after success verify session invalidation and mandatory new login.

### Tests for User Story 3

- [X] T023 [P] [US3] Add contract tests for system-failure and re-authentication-required responses in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/test_uc04_password_change_failure_contract.js`
- [X] T024 [P] [US3] Add integration test for credential-store failure rollback/no-partial-update behavior in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc04_password_change_atomic_failure.js`
- [X] T025 [P] [US3] Add integration test for session invalidation immediately after successful change in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc04_session_invalidation_after_change.js`
- [X] T026 [P] [US3] Add integration test for re-authentication requirement with new password in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc04_reauthentication_required.js`

### Implementation for User Story 3

- [X] T027 [US3] Implement credential-store failure handling and retry-later response path in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/account/password_change_failure_service.js`
- [X] T028 [US3] Integrate session invalidation trigger into successful change flow in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/auth/session_invalidation_service.js`
- [X] T029 [US3] Implement frontend sign-out and re-login-required UX after success in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/password_change_post_success_controller.js` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/password_change_post_success_view.js`

**Checkpoint**: All user stories independently functional and testable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, traceability, and operational verification.

- [X] T030 [P] Add password-change observability metrics (latency, validation categories, failure categories) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/account/password_change_observability_service.js`
- [X] T031 [P] Add unit tests for password policy edge conditions and history-window checks in `/mnt/c/Users/ponti/Desktop/CMS1/tests/unit/test_uc04_password_policy_validator.js`
- [X] T032 Update implementation alignment notes and `UC-04.md` / `UC-04-AT.md` sync checklist in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc04-password-change/tasks.md`
- [X] T033 Run `npm test && npm run lint` and record UC04 execution summary in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc04-password-change/validation-report.md`

- [X] T034 Validate UC-04 narrative and update any changed user-facing behavior details in `/mnt/c/Users/ponti/Desktop/CMS1/UC-04.md`
- [X] T035 Validate UC-04 acceptance tests and update scenarios/expected outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/UC-04-AT.md`

- [X] T036 Validate frontend HTML/CSS compliance against `/mnt/c/Users/ponti/Desktop/CMS1/docs/standards/html-css-style-profile.md` and record checks in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc04-password-change/quickstart.md`
- [X] T037 Add password-change p95 latency verification against 500ms target in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc04_password_change_performance.integration.js`
- [X] T038 Add telemetry for validation-feedback to compliant-resubmission metric (SC-005) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/account/password_change_observability_service.js`
- [X] T039 Record SC-005 measurement method and collected evidence in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc04-password-change/validation-report.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 and blocks all story work.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2 and stable password-change baseline from US1.
- **Phase 5 (US3)**: Depends on Phase 2 and successful-flow wiring from US1.
- **Phase 6 (Polish)**: Depends on all story phases.

### User Story Dependencies

- **US1 (P1)**: MVP baseline.
- **US2 (P2)**: Builds on password-change endpoint behavior from US1.
- **US3 (P3)**: Builds on transactional update and session semantics from US1/foundational.

### Within Each User Story

- Tests first and failing before implementation.
- Backend service logic before API and frontend integration.
- Story checkpoint validation before proceeding.

---

## Parallel Opportunities

- Setup: `T003`
- Foundational: `T005`, `T006`, `T007`, `T008`
- US1 tests: `T011-T013`
- US2 tests: `T017-T019`
- US3 tests: `T023-T026`
- Polish: `T030`, `T031`

---

## Parallel Example: User Story 2

```bash
# Parallel validation-focused test implementation for US2
Task: "T017 Contract tests in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/test_uc04_password_change_validation_contract.js"
Task: "T018 Required/current-password integration tests in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc04_password_change_required_and_current_failures.js"
Task: "T019 Policy/mismatch integration tests in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc04_password_change_policy_failures.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (US1).
4. Validate with US1 tests and quickstart success scenarios.

### Incremental Delivery

1. Deliver US1 success path first.
2. Add US2 validation feedback behavior.
3. Add US3 failure safety and re-authentication enforcement.
4. Apply polish/hardening.

### Suggested MVP Scope

- **MVP**: Phases 1-3 (`US1`).
- **Post-MVP**: Phases 4-6.

---

## Notes

- All tasks follow strict checklist format with IDs and explicit file paths.
- Story tasks include `[US1]`, `[US2]`, `[US3]` labels as required.
- `[P]` markers are only assigned to safely parallelizable tasks.

## UC Sync Notes

- `UC-04.md` and `UC-04-AT.md` were revalidated and aligned to implemented behavior on 2026-02-20.


