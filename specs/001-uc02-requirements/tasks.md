# Tasks: Validate user-provided information

**Input**: Design documents from `/specs/001-uc02-requirements/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Include contract and integration tests because plan/quickstart require validation rejection and no-partial-update verification.
**Use Cases**: Tasks MUST reference and keep `UC-02.md` and `UC-02-AT.md` in sync when user-facing behavior changes.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize UC-02 validation scaffolding across backend and frontend MVC layers.

- [X] T001 Create validation module skeleton files in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/validation_routes.js`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/validation_controller.js`, `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/validation/validation_service.js`, `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/form_validation_controller.js`, and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/form_validation_view.js`
- [X] T002 Add shared validation constants (error codes, pipeline stage order, response schema keys) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/config/validation_config.js`
- [X] T003 [P] Create contract test fixtures for form submission payloads in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/fixtures/validation_payloads.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement reusable rule engine, persistence boundary, and transaction guardrails before story work.

**CRITICAL**: No user story work starts before this phase is complete.

- [X] T004 Implement form/rule repository for `FormDefinition` and `FieldRule` lookup in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/form_definition_repository.js`
- [X] T005 [P] Implement validation engine pipeline (required -> format -> business rule) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/validation/validation_engine.js`
- [X] T006 [P] Implement structured validation error mapper (`field`, `code`, `message`) in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/validation/validation_error_mapper.js`
- [X] T007 [P] Implement transactional persistence adapter for atomic writes/rollback in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/persistence/atomic_form_persistence_service.js`
- [X] T008 Implement submission/auth precheck guard for protected form validation flows in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/middleware/form_auth_guard.js`
- [X] T009 Implement submission outcome recorder for `FormSubmission` + `ValidationResult` states in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/models/form_submission_repository.js`
- [X] T010 Add base API error handling for validation and persistence failures in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/validation_error_handler.js`

**Checkpoint**: Foundation complete, User Story 1 implementation can begin.

---

## Phase 3: User Story 1 - Validate submitted form data (Priority: P1) MVP

**Goal**: Ensure logged-in users receive immediate, field-specific validation feedback and no data persistence unless all checks pass.

**Independent Test**: Submit valid and invalid form payloads, verify clear field errors on failure, and confirm zero partial updates when any field fails.

### Tests for User Story 1

- [X] T011 [P] [US1] Add contract tests for validation endpoint behavior in `/mnt/c/Users/ponti/Desktop/CMS1/tests/contract/test_uc02_validation_contract.js`
- [X] T012 [P] [US1] Add integration test for valid submission acceptance and successful persistence in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc02_valid_submission.js`
- [X] T013 [P] [US1] Add integration tests for missing/invalid/constraint violations with field-specific errors in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc02_validation_failures.js`
- [X] T014 [P] [US1] Add integration test verifying rollback/no-partial-update behavior in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc02_atomicity.js`

### Implementation for User Story 1

- [X] T015 [US1] Implement end-to-end submission validation orchestration in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/validation/validation_service.js`
- [X] T016 [US1] Implement API route/controller for form submission validation and persistence in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/validation_routes.js` and `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/api/validation_controller.js`
- [X] T017 [US1] Implement required-field highlighting and field-level error rendering in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/form_validation_controller.js` and `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/form_validation_view.js`
- [X] T018 [US1] Implement consistent multi-error display behavior (all-errors mode) in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/views/form_validation_errors_view.js`
- [X] T019 [US1] Implement success confirmation flow after atomic persistence success in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/controllers/form_submission_success_controller.js`
- [X] T020 [US1] Wire validation contract response shape to frontend model adapters in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/src/models/validation_result_model.js`

**Checkpoint**: User Story 1 is independently functional and testable (MVP complete).

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Hardening, traceability, and verification updates across UC-02.

- [X] T021 [P] Add validation observability logs/metrics hooks for reject reasons and latency in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/validation/validation_observability_service.js`
- [X] T022 [P] Add unit tests for validation engine rule ordering and deterministic outputs in `/mnt/c/Users/ponti/Desktop/CMS1/tests/unit/test_uc02_validation_engine.js`
- [X] T023 Update UC synchronization checklist and confirm `UC-02.md`/`UC-02-AT.md` alignment notes in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc02-requirements/tasks.md`
- [X] T024 Run `npm test && npm run lint` and write execution summary in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc02-requirements/validation-report.md`

- [X] T025 Validate UC-02 narrative and update any changed user-facing behavior details in `/mnt/c/Users/ponti/Desktop/CMS1/UC-02.md`
- [X] T026 Validate UC-02 acceptance tests and update scenarios/expected outcomes in `/mnt/c/Users/ponti/Desktop/CMS1/UC-02-AT.md`

- [X] T027 Validate frontend HTML/CSS compliance against `/mnt/c/Users/ponti/Desktop/CMS1/docs/standards/html-css-style-profile.md` and record checks in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc02-requirements/quickstart.md`
- [X] T028 [P] Add integration test for rollback/abort behavior on post-validation persistence failure in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc02_persistence_failure_rollback.js`
- [X] T029 [P] Add integration test for last-write-wins concurrent conflicting updates in `/mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc02_last_write_wins.js`
- [X] T030 [P] Add accessibility and immediate-feedback timing checks (<=1s normal load) in `/mnt/c/Users/ponti/Desktop/CMS1/frontend/tests/accessibility/test_uc02_validation_feedback_a11y.js`
- [X] T031 [P] Add unit tests for sensitive-field redaction in validation errors/logs in `/mnt/c/Users/ponti/Desktop/CMS1/tests/unit/test_uc02_validation_privacy.js`
- [X] T032 Implement required-field discoverability from authoritative form metadata in `/mnt/c/Users/ponti/Desktop/CMS1/backend/src/services/validation/required_field_metadata_service.js`
- [X] T033 Document per-form inline validation-rule ownership in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc02-requirements/spec.md` and `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc02-requirements/validation-report.md`
- [X] T034 Update FR-to-AT traceability and SC-001..SC-004 measurement evidence in `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc02-requirements/spec.md` and `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc02-requirements/validation-report.md`

- [ ] T035 Update implementation change log and reconcile UC-02 behavior traceability in `/mnt/c/Users/ponti/Desktop/CMS1/docs/implementation/implementation-log.md`, `/mnt/c/Users/ponti/Desktop/CMS1/UC-02.md`, and `/mnt/c/Users/ponti/Desktop/CMS1/UC-02-AT.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion and blocks story work.
- **Phase 3 (US1)**: Depends on Phase 2 completion.
- **Phase 4 (Polish)**: Depends on Phase 3 completion.

### User Story Dependencies

- **US1 (P1)**: Starts after foundational tasks; no dependency on other user stories.

### Within User Story 1

- Tests (T011-T014) should be written first and fail before implementation.
- Service/API backend implementation (T015-T016) before frontend integration (T017-T020).
- Success flow and error rendering complete before checkpoint.

---

## Parallel Opportunities

- Setup: `T003` parallel with `T001-T002`
- Foundational: `T005`, `T006`, `T007` parallel after `T004` baseline schema contracts
- US1 tests: `T011-T014` parallel
- Polish: `T021`, `T022` parallel

---

## Parallel Example: User Story 1

```bash
# Parallel test creation for US1
Task: "T011 Contract tests in /mnt/c/Users/ponti/Desktop/CMS1/tests/contract/test_uc02_validation_contract.js"
Task: "T012 Integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc02_valid_submission.js"
Task: "T013 Integration tests in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc02_validation_failures.js"
Task: "T014 Atomicity integration test in /mnt/c/Users/ponti/Desktop/CMS1/tests/integration/test_uc02_atomicity.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational).
3. Complete Phase 3 (US1).
4. Validate independently with US1 tests and quickstart scenarios.

### Incremental Delivery

1. Finish setup + foundational core.
2. Deliver US1 validation + atomic persistence behavior.
3. Apply polish/hardening and regression checks.

### Suggested MVP Scope

- **MVP**: Phases 1-3 (US1 end-to-end).
- **Post-MVP**: Phase 4 polish and operational hardening.

---

## Notes

- All tasks follow strict checklist format with IDs and explicit file paths.
- User story tasks include `[US1]` labels.
- `[P]` used only for safely parallelizable tasks.

## UC Sync Notes

- `UC-02.md` and `UC-02-AT.md` were revalidated and aligned to implemented behavior on 2026-02-20.



