# Specification Analysis Report

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| U1 | Underspecification | MEDIUM | `specs/001-uc05-manuscript-submission/spec.md:91` | FR-011 allows two policies (`ALL_ERRORS` or `FIRST_BLOCKING`) but does not select one expected behavior. | Pick one policy in spec or document a deterministic config default and expected response ordering. |
| G1 | Coverage Gap | MEDIUM | `specs/001-uc05-manuscript-submission/plan.md:21`, `specs/001-uc05-manuscript-submission/tasks.md:13` | Plan defines a 500ms p95 validation response goal, but tasks contain no explicit performance measurement/verification task. | Add a performance validation task and threshold check in integration/perf tests before polish sign-off. |
| G2 | Coverage Gap | MEDIUM | `specs/001-uc05-manuscript-submission/spec.md:123`, `specs/001-uc05-manuscript-submission/tasks.md:109` | SC-005 (95% successful resubmission within 2 additional attempts) has no telemetry/measurement task coverage. | Add instrumentation/reporting task(s) for resubmission attempt counting and success-rate calculation. |
| D1 | Duplication | LOW | `specs/001-uc05-manuscript-submission/spec.md:89`, `specs/001-uc05-manuscript-submission/spec.md:94` | FR-009 (reject invalid metadata) and FR-014 (failed validation attempts do not finalize) overlap semantically. | Keep both for clarity if desired, but cross-reference them or merge wording to reduce redundancy. |
| U2 | Underspecification | LOW | `specs/001-uc05-manuscript-submission/tasks.md:111` | T035 is conditional ("if user-facing behavior wording changed"), which can create inconsistent execution expectations. | Convert to explicit completion criteria (always verify and document no-change or change result). |

## Coverage Summary Table

| Requirement Key | Has Task? | Task IDs | Notes |
|-----------------|-----------|----------|-------|
| authenticated-author-open-window (FR-001) | Yes | T010 | Guard middleware covers auth and window-open constraint. |
| submission-form-with-metadata-and-upload (FR-002) | Yes | T003, T016, T017 | Frontend form and submit handling defined. |
| required-metadata-fields (FR-003) | Yes | T016, T022 | UI and backend validation coverage present. |
| manuscript-file-required (FR-004) | Yes | T020, T023 | Contract + service validation coverage. |
| allowed-formats-pdf-word-latex (FR-005) | Yes | T020, T023 | Contract + sniffing/enforcement tasks mapped. |
| file-size-max-7mb (FR-006) | Yes | T020, T023 | Explicit enforcement task included. |
| metadata-completeness-before-finalize (FR-007) | Yes | T022, T026 | Completeness check and no-finalize guard covered. |
| metadata-quality-validation (FR-008) | Yes | T022 | Explicit email/phone format rules are defined and mapped. |
| reject-invalid-metadata-with-feedback (FR-009) | Yes | T019, T024, T025 | API and frontend feedback tasks mapped. |
| reject-invalid-file-with-feedback (FR-010) | Yes | T020, T024, T025 | API + frontend file feedback covered. |
| consistent-multi-error-policy (FR-011) | Yes | T008, T021, T024 | Covered, pending policy selection (U1). |
| atomic-store-metadata-and-file-ref (FR-012) | Yes | T009, T014 | Atomic finalization tasks mapped. |
| success-confirmation-and-redirect (FR-013) | Yes | T015, T017 | Backend payload and frontend redirect mapped. |
| failed-validation-no-finalized-record (FR-014) | Yes | T026 | Explicit non-finalization task exists. |
| report-upload-interruptions-and-retry (FR-015) | Yes | T027, T030, T032 | Contract + backend + frontend messaging covered. |
| interrupted-upload-not-finalized (FR-016) | Yes | T028, T031 | Integration and state transition tasks mapped. |
| storage-failure-retry-later-no-finalize (FR-017) | Yes | T029, T031 | Integration and state behavior covered. |
| successful-submission-visible-in-list (FR-018) | Yes | T018 | Listing endpoint explicitly maps metadata/file reference visibility. |

## Constitution Alignment Issues

No constitution MUST violations detected. Plan and tasks remain aligned with MVC and vanilla stack requirements from `.specify/memory/constitution.md`.

## Unmapped Tasks

No fully unmapped tasks detected. All tasks map to one or more requirements, user stories, constitution workflow constraints, or delivery quality gates.

## Metrics

- Total Requirements: 18 functional requirements (FR-001..FR-018)
- Total Tasks: 36
- Coverage % (requirements with >=1 task): 100%
- Ambiguity Count: 0
- Duplication Count: 1
- Critical Issues Count: 0

## Next Actions

- No CRITICAL or HIGH issues block implementation start.
- Resolve MEDIUM issues before `/speckit.implement` to avoid rework in validation and quality gates.
- Suggested commands/actions:
  - Refine spec wording for FR-008 and FR-011 in `specs/001-uc05-manuscript-submission/spec.md`.
  - Add performance and resubmission-metric tasks to `specs/001-uc05-manuscript-submission/tasks.md`.
  - Re-run `/speckit.analyze` after those adjustments.

Would you like me to suggest concrete remediation edits for the remaining medium issues?
