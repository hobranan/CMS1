# Specification Analysis Report

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| C1 | Constitution Alignment | CRITICAL | `specs/001-uc07-save-draft/plan.md:1`, `specs/001-uc07-save-draft/plan.md:35` | `plan.md` is still template content with unresolved placeholders and unchecked constitution gates, so required plan-level traceability/compliance is not documented. | Run `/speckit.plan` for UC07 (or manually complete `plan.md`) before implementation; ensure concrete stack, structure, and constitution gate evidence are filled. |
| I1 | Inconsistency | HIGH | `specs/001-uc07-save-draft/spec.md:3`, `specs/001-uc07-save-draft/plan.md:3` | Spec identifies UC07 branch and concrete requirements, while plan references `[###-feature-name]` placeholders. | Align plan identifiers, dates, spec paths, and technical context to UC07 artifacts. |
| G1 | Coverage Gap | MEDIUM | `specs/001-uc07-save-draft/spec.md:122`, `specs/001-uc07-save-draft/tasks.md:13` | SC-004 (cross-session retrievability) is tested functionally but lacks explicit durability/consistency verification under backend restart or session-expiry scenarios. | Add integration task(s) for persistence durability across server restart/session boundary. |
| G2 | Coverage Gap | MEDIUM | `specs/001-uc07-save-draft/spec.md:124`, `specs/001-uc07-save-draft/tasks.md:127` | SC-006 (100% submit attempts with unsaved edits persist before validation) lacks a measurable telemetry/assertion task beyond scenario testing. | Add instrumentation/assertion task to capture and verify prevalidation-save execution ordering in finalize flow. |
| A1 | Ambiguity | LOW | `specs/001-uc07-save-draft/spec.md:85`, `specs/001-uc07-save-draft/spec.md:101` | "save-level validation" is intentionally lighter than final validation but lacks concrete rule boundaries. | Define explicit save-level rule set in spec appendix or referenced validation matrix. |
| U1 | Underspecification | LOW | `specs/001-uc07-save-draft/tasks.md:111` | T037 is conditional and may produce inconsistent completion behavior across implementations. | Convert T037 into explicit verify-and-record task regardless of whether changes are needed. |

## Coverage Summary Table

| Requirement Key | Has Task? | Task IDs | Notes |
|-----------------|-----------|----------|-------|
| manual-save-for-authenticated-nonfinalized (FR-001) | Yes | T011, T015, T016 | Route guard and manual save orchestration covered. |
| persist-editable-values-on-save-success (FR-002) | Yes | T010, T015, T016 | Atomic save path persists editable state on success only. |
| save-level-validation-checks (FR-003) | Yes | T008, T023 | Validation service and field-level checks mapped. |
| reject-save-on-invalid-values-with-field-errors (FR-004) | Yes | T021, T023, T025 | Contract + service + UI feedback coverage. |
| no-change-detection-without-draft-modification (FR-005) | Yes | T009, T020, T024 | Detection logic and no-write outcome covered. |
| persist-drafts-across-sessions-logins (FR-006) | Yes | T013, T014, T017, T019 | Retrieval endpoint and cross-session integration mapped. |
| continue-editing-after-successful-save (FR-007) | Yes | T018, T019 | Editor state and continued edits supported. |
| post-save-edits-unsaved-until-next-explicit-save (FR-008) | Yes | T018, T019 | Frontend/editor flow keeps unsaved edits local until save action. |
| storage-failure-retry-later-and-no-draft-change (FR-009) | Yes | T027, T029, T031 | Failure contracts/integration and error mapping covered. |
| network-failure-retry-and-no-draft-change (FR-010) | Yes | T027, T029, T031 | Same failure integrity path coverage exists. |
| explicit-save-only-no-autosave (FR-011) | Yes | T003, T018 | Manual save trigger implementation; no autosave task present. |
| block-final-submission-until-final-validation-passes (FR-012) | Yes | T028, T032, T033 | Finalize endpoint and gating logic covered. |
| allow-draft-save-when-not-final-ready (FR-013) | Yes | T016, T033 | Save and finalization gating separation covered. |
| submit-persists-unsaved-edits-before-final-validation (FR-014) | Yes | T028, T030, T032 | Contract + sequencing integration + controller orchestration mapped. |
| failed-final-validation-after-pre-save-retains-saved-draft (FR-015) | Yes | T028, T030, T033 | `409` path and state retention behavior covered. |

## Constitution Alignment Issues

- `C1` is a constitution-critical issue because plan-level compliance evidence is missing (template placeholders + unchecked gate markers), while constitution requires plan/spec workflow alignment and compliance checks.

## Unmapped Tasks

No fully unmapped tasks detected.

## Metrics

- Total Requirements: 15 functional requirements (FR-001..FR-015)
- Total Tasks: 38
- Coverage % (requirements with >=1 task): 100%
- Ambiguity Count: 1
- Duplication Count: 0
- Critical Issues Count: 1

## Next Actions

- Resolve CRITICAL issue before `/speckit.implement`.
- Suggested commands/actions:
  - Run `/speckit.plan` for `001-uc07-save-draft` to replace template `plan.md` with a real implementation plan.
  - Keep `specs/001-uc07-save-draft/tasks.md` and re-run `/speckit.analyze`.
  - Optionally add durability/telemetry tasks for SC-004 and SC-006.

Would you like me to suggest concrete remediation edits for the top 4 issues?
