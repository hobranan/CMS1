# Specification Analysis Report

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| U1 | Underspecification | MEDIUM | `specs/001-uc06-upload-manuscript/spec.md:93` | FR-014 requires restart after 30 minutes but does not define whether expired checkpoint metadata is deleted or retained. | Specify post-expiry checkpoint handling (cleanup/retention) and add corresponding task/test. |
| G1 | Coverage Gap | MEDIUM | `specs/001-uc06-upload-manuscript/plan.md:21`, `specs/001-uc06-upload-manuscript/tasks.md:13` | Plan includes pre-upload validation response target (300ms p95), but tasks have no explicit performance verification task. | Add a performance test/measurement task and acceptance gate in polish phase. |
| G2 | Coverage Gap | MEDIUM | `specs/001-uc06-upload-manuscript/spec.md:121`, `specs/001-uc06-upload-manuscript/tasks.md:126` | SC-004 (95% resume success within 30 minutes) has behavior tests but no metric collection/reporting task. | Add observability/reporting tasks for retry outcomes and a success-rate calculation method. |
| D1 | Duplication | LOW | `specs/001-uc06-upload-manuscript/spec.md:95`, `specs/001-uc06-upload-manuscript/spec.md:97` | FR-016 and FR-017 overlap on non-attachment guarantees during association failures. | Keep both if traceability is needed, but tighten wording to differentiate association error messaging vs final attached-state invariant. |
| U2 | Underspecification | LOW | `specs/001-uc06-upload-manuscript/tasks.md:112` | T037 is conditional and may be skipped inconsistently across implementations. | Convert to explicit verification task (always check and document whether UC files changed). |

## Coverage Summary Table

| Requirement Key | Has Task? | Task IDs | Notes |
|-----------------|-----------|----------|-------|
| upload-only-authenticated-author-in-workflow (FR-001) | Yes | T011 | Guard middleware coverage exists. |
| file-select-or-cancel-no-side-effects (FR-002) | Yes | T019, T022, T025 | Frontend flow + integration test coverage present. |
| extension-only-validation (FR-003) | Yes | T008, T023 | Core validation tasks mapped. |
| allow-only-whitelisted-extensions (FR-004) | Yes | T020, T023 | Explicit whitelist (`.pdf`, `.doc`, `.docx`, `.tex`) is defined and enforced. |
| reject-over-7mb (FR-005) | Yes | T008, T021, T024 | Service, contract, and error mapping coverage. |
| unsupported-extension-error-with-allowed-formats (FR-006) | Yes | T020, T024, T026 | API and UI feedback tasks mapped. |
| oversize-error-with-limit (FR-007) | Yes | T021, T024, T026 | API and UI feedback tasks mapped. |
| upload-valid-files-to-storage (FR-008) | Yes | T009, T015, T016 | Transfer + controller/orchestration coverage. |
| associate-uploaded-file-to-current-submission (FR-009) | Yes | T010, T013, T016 | Association behavior covered. |
| success-attachment-confirmation (FR-010) | Yes | T012, T017, T019 | Contract + backend mapper + frontend confirmation. |
| cancel-keeps-attachment-state-unchanged (FR-011) | Yes | T022, T025 | Integration and controller behavior covered. |
| interruption-retry-guidance-and-unattached (FR-012) | Yes | T030, T033, T034 | Failure-path tasks mapped. |
| retry-within-30m-resume (FR-013) | Yes | T027, T028, T031, T032 | Contract + integration + retry logic mapped. |
| retry-after-30m-restart (FR-014) | Yes | T027, T029, T031, T032 | Coverage present with restart mode tests. |
| storage-failure-system-error-unattached (FR-015) | Yes | T030, T033, T034 | Failure integration and messaging covered. |
| association-failure-inform-not-attached-retry (FR-016) | Yes | T030, T033, T034 | Explicit non-attachment/error path covered. |
| attached-only-after-upload-and-association-success (FR-017) | Yes | T007, T010, T016, T033 | Invariant modeled and enforced. |
| attachment-visibility-persists-after-refresh/navigation (FR-018) | Yes | T014, T019 | Integration + UI state coverage mapped. |

## Constitution Alignment Issues

No constitution MUST violations detected. Artifacts remain aligned with `.specify/memory/constitution.md` for UC/AT authority, MVC layering, and vanilla web stack constraints.

## Unmapped Tasks

No fully unmapped tasks detected.

## Metrics

- Total Requirements: 18 functional requirements (FR-001..FR-018)
- Total Tasks: 38
- Coverage % (requirements with >=1 task): 100%
- Ambiguity Count: 0
- Duplication Count: 1
- Critical Issues Count: 0

## Next Actions

- No CRITICAL or HIGH blockers found.
- Address MEDIUM findings before `/speckit.implement` to reduce rework.
- Suggested actions:
  - Refine FR-004 and FR-014 in `specs/001-uc06-upload-manuscript/spec.md`.
  - Add performance and resume-success metric tasks to `specs/001-uc06-upload-manuscript/tasks.md`.
  - Re-run `/speckit.analyze` after updates.

Would you like me to suggest concrete remediation edits for the top 4 issues?
