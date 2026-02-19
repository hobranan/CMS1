# Tasks: Register new user account

**Input**: Design documents from `/specs/001-uc01-requirements/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include contract and integration tests because plan/quickstart explicitly require contract/integration coverage for registration, verification, resend, expiry, and pre-verification login handling.
**Use Cases**: Tasks MUST reference and keep `UC-01.md` and `UC-01-AT.md` in sync when user-facing behavior changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize UC-01 implementation scaffolding for web MVC structure.

- [ ] T001 Create UC-01 backend/frontend module skeleton files in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/registration_routes.js`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/registration_controller.js`, `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/registration_controller.js`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/registration_view.js`
- [ ] T002 Add registration configuration constants (token TTL 24h, pending TTL 7d) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/config/registration_config.js`
- [ ] T003 [P] Create endpoint contract fixture helpers for UC-01 in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/fixtures/registration_payloads.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Complete core persistence/security/services before user story implementation.

**CRITICAL**: No user story tasks start before this phase is complete.

- [ ] T004 Create persistence schema/migration for pending registrations and email verification tokens in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/migrations/001_uc01_registration_tables.sql`
- [ ] T005 [P] Implement registration repository for `UserAccount`, `PendingRegistration`, and `EmailVerificationToken` entities in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/registration_repository.js`
- [ ] T006 [P] Implement password policy + hashing utility in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/security/password_service.js`
- [ ] T007 [P] Implement single-use verification token generator/validator in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/security/verification_token_service.js`
- [ ] T008 Implement verification email sender adapter for confirmation/resend flows in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/email/verification_email_service.js`
- [ ] T009 Implement shared registration error code/message mapper in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/registration_error_mapper.js`
- [ ] T010 Implement expiry enforcement service for 24-hour token expiry and 7-day pending-registration expiry in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/registration/registration_expiry_service.js`

**Checkpoint**: Foundation complete, User Story 1 can be implemented and tested independently.

---

## Phase 3: User Story 1 - Register a new account (Priority: P1) MVP

**Goal**: Allow unauthenticated users to register with validation, email verification, resend support, and blocked pre-verification login.

**Independent Test**: Submit valid registration, verify by email token, and confirm immediate login success; validate invalid/duplicate/weak/missing inputs, expired token, pre-verification login denial with resend option, and 7-day pending expiration behavior.

### Tests for User Story 1

- [ ] T011 [P] [US1] Add contract tests for `/api/v1/registrations`, `/api/v1/registrations/verify`, `/api/v1/registrations/resend-confirmation`, and `/api/v1/auth/login` in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/test_uc01_registration_contract.js`
- [ ] T012 [P] [US1] Add integration test for happy-path register-verify-login flow in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc01_registration_happy_path.js`
- [ ] T013 [P] [US1] Add integration tests for invalid email/duplicate email/weak password/missing fields in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc01_registration_validation_failures.js`
- [ ] T014 [P] [US1] Add integration tests for expired token, resend, pre-verification login denial, and 7-day pending expiry in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc01_registration_expiry_and_unverified_login.js`

### Implementation for User Story 1

- [ ] T015 [US1] Implement registration submission workflow (validation, duplicate checks against active+pending, pending record creation, verification send) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/registration/registration_service.js`
- [ ] T016 [US1] Implement verification workflow (token validation, single-use enforcement, active account creation, redirect/login readiness) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/registration/verification_service.js`
- [ ] T017 [US1] Implement resend-confirmation workflow with pending-window checks and token invalidation/rotation in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/registration/resend_verification_service.js`
- [ ] T018 [US1] Implement pre-verification login resolution (`EMAIL_UNVERIFIED` + resend metadata) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/auth/login_service.js`
- [ ] T019 [US1] Wire registration/verification/resend endpoints in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/registration_routes.js` and `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/registration_controller.js`
- [ ] T020 [US1] Update auth login endpoint responses for unverified state in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/auth_controller.js`
- [ ] T021 [P] [US1] Implement frontend registration form behaviors (field highlighting, actionable errors, submit flow) in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/registration_controller.js` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/registration_view.js`
- [ ] T022 [P] [US1] Implement verification result and resend-option UI in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/verification_controller.js` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/verification_view.js`
- [ ] T023 [US1] Implement login reminder/resend-option UX for unverified accounts in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/login_controller.js` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/login_view.js`

**Checkpoint**: User Story 1 is independently functional and testable (MVP complete).

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, observability, and documentation updates across the completed story.

- [ ] T024 [P] Add registration/verification/resend/login audit logging for support and diagnostics in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/registration/registration_audit_log.js`
- [ ] T025 [P] Add unit tests for password/token utility edge cases in `/mnt/c/Users/ponti/Desktop/CMS1/tests/unit/test_uc01_security_utils.js`
- [ ] T026 Update implementation verification steps and expected API outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc01-requirements/quickstart.md`
- [ ] T027 Run `npm test && npm run lint` and record UC-01 execution notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc01-requirements/validation-report.md`
- [ ] T028 Validate UC-01 narrative and update any changed registration behavior details in `/mnt/c/Users/ponti/Desktop/CMS1/UC-01.md`
- [ ] T029 Validate UC-01 acceptance tests and update scenarios/expected outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/UC-01-AT.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies, starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks user story work.
- **Phase 3 (US1)**: Depends on Phase 2 completion.
- **Phase 4 (Polish)**: Depends on Phase 3 completion.

### User Story Dependencies

- **US1 (P1)**: Starts after foundational completion; no dependency on other stories.

### Within User Story 1

- Contract/integration tests (T011-T014) should be authored before implementation and fail initially.
- Services (T015-T018) depend on foundational tasks (T004-T010).
- API/controller tasks (T019-T020) depend on service completion.
- Frontend tasks (T021-T023) depend on API behavior and error contracts being stable.

---

## Parallel Opportunities

- **Setup**: T003 can run in parallel with T001-T002.
- **Foundational**: T005, T006, T007 can run in parallel; T008 can begin once T007 interface is defined.
- **US1 Tests**: T011-T014 can run in parallel.
- **US1 Frontend**: T021 and T022 can run in parallel after backend contract behavior is fixed.
- **Polish**: T024 and T025 can run in parallel.

---

## Parallel Example: User Story 1

```bash
# Parallel test authoring
Task: "T011 Add contract tests in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/test_uc01_registration_contract.js"
Task: "T012 Add happy-path integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc01_registration_happy_path.js"
Task: "T013 Add validation-failure integration tests in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc01_registration_validation_failures.js"
Task: "T014 Add expiry/unverified-login integration tests in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc01_registration_expiry_and_unverified_login.js"

# Parallel frontend implementation after backend contracts stabilize
Task: "T021 Implement registration UI in /mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/registration_controller.js and /mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/registration_view.js"
Task: "T022 Implement verification/resend UI in /mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/verification_controller.js and /mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/verification_view.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (US1).
4. Validate US1 independently using T011-T014 scenarios and quickstart flow.

### Incremental Delivery

1. Foundation first (Phases 1-2).
2. Deliver US1 complete (registration + verification + resend + pre-verification login handling).
3. Apply polish/hardening (Phase 4) after MVP stability is confirmed.

### Suggested MVP Scope

- **MVP**: Phase 1 + Phase 2 + Phase 3 (US1 only).
- **Post-MVP**: Phase 4 polish tasks.

---

## Notes

- All tasks use strict checklist format with Task ID and explicit file paths.
- `[US1]` labels are applied to user-story tasks only.
- `[P]` marks only tasks that are parallelizable without conflicting incomplete dependencies.
