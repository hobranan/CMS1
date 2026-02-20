# Specification Analysis Report

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| U1 | Underspecification | LOW | `specs/001-uc16-generate-schedule/plan.md:18`, `specs/001-uc16-generate-schedule/tasks.md:168` | Performance goal is qualitative ("normal workflow latency"), so success threshold for T046 remains unclear. | Define concrete latency SLO (for example, p95 target) in `plan.md` and use it in T046 assertions. |

## Coverage Summary Table

| Requirement Key | Has Task? | Task IDs | Notes |
|-----------------|-----------|----------|-------|
| authenticated-admin-editor-only (FR-001) | Yes | T010, T021, T022 | Guard + controller entry points enforce actor restrictions. |
| manual-initiation-only (FR-002) | Yes | T005, T017, T021 | Request model and generation endpoint enforce explicit manual trigger. |
| retrieve-accepted-papers-and-parameters (FR-003) | Yes | T011, T041 | Input loader and prereq validator cover required pre-generation reads. |
| block-when-no-accepted-papers (FR-004) | Yes | T035, T041 | Contract test and validator path included. |
| block-when-parameters-incomplete (FR-005) | Yes | T036, T041 | Contract test and validator path included. |
| one-column-per-room (FR-006) | Yes | T007, T012, T027, T033 | Model/service/test/UI coverage present. |
| sequential-time-slots-per-room (FR-007) | Yes | T007, T012, T028 | Sequential slot invariants and integration validation covered. |
| equal-slot-count-across-columns (FR-008) | Yes | T007, T012, T027, T028 | Equal-slot invariant covered in model, builder, and tests. |
| configured-interval-between-slots (FR-009) | Yes | T012, T028 | Interval spacing implemented and verified. |
| randomized-initial-ordering (FR-010) | Yes | T013, T029, T031 | Randomized placement with seed-aware testing path covered. |
| apply-duration-availability-conflict-rules (FR-011) | Yes | T014, T031, T032, T039 | Rule engine and conflict detection integrated and tested. |
| detect-highlight-conflicts-block-finalization (FR-012) | Yes | T014, T037, T039, T042, T044 | Conflict lifecycle covered from detection through blocking/UI feedback. |
| persist-generated-schedules-as-draft (FR-013) | Yes | T015, T021, T031 | Draft-first persistence enforced in pipeline/controller layers. |
| publish-reviewed-draft (FR-014) | Yes | T018, T022, T025 | Publish contract and controller/UI confirmation flow present. |
| keep-draft-when-publish-canceled (FR-015) | Yes | T030, T034 | Cancel path tested and handled in publish controller/UI flow. |
| show-error-and-do-not-store-on-save-failure (FR-016) | Yes | T038, T043, T044 | Contract + service rollback + UI feedback are covered. |
| persist-published-schedule-across-sessions (FR-017) | Yes | T023, T040 | Retrieval endpoint and persistence integration test cover requirement. |

## Constitution Alignment Issues

No constitution-critical violations detected. UC artifacts, MVC boundaries, and vanilla web constraints remain aligned in `plan.md`.

## Unmapped Tasks

- `T045`, `T046`, `T047`, and `T048` are cross-cutting operational/verification tasks; they are useful but not mapped to a single FR.

## Metrics

- Total Requirements: 17 functional requirements (FR-001..FR-017)
- Total Tasks: 50
- Coverage % (requirements with >=1 task): 100%
- Ambiguity Count: 1
- Duplication Count: 0
- Critical Issues Count: 0

## Next Actions

- Resolve LOW issue for measurable performance verification:
  - Define numeric latency target in `plan.md` for T046.
