# Specification Analysis Report

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| U1 | Underspecification | LOW | `specs/001-uc18-public-schedule-pdf/plan.md:18`, `specs/001-uc18-public-schedule-pdf/tasks.md:121` | Performance expectation is qualitative ("normal browsing latency"), making load/performance verification thresholds unclear. | Add numeric latency target(s) in `plan.md` and assert in `T042` high-volume PDF stability tests. |

## Coverage Summary Table

| Requirement Key | Has Task? | Task IDs | Notes |
|-----------------|-----------|----------|-------|
| public-access-without-auth (FR-001) | Yes | T015, T017, T019, T020 | Public list endpoint and unauthenticated flows are covered. |
| display-grouped-published-schedule (FR-002) | Yes | T010, T019, T021 | Grouped day/session retrieval and rendering are covered. |
| show-not-available-when-unpublished (FR-003) | Yes | T016, T019, T022 | Unpublished gating and public unavailable UI behavior are covered. |
| open-session-presentation-details (FR-004) | Yes | T023, T027, T029, T031 | Detail endpoint + frontend detail behavior are covered. |
| show-available-fields-and-unavailable-markers (FR-005) | Yes | T026, T029, T031 | Missing optional-field behavior is covered in tests/UI. |
| support-schedule-viewing-in-pdf (FR-006) | Yes | T024, T028, T030 | Inline PDF path is explicitly covered. |
| support-schedule-export-in-pdf (FR-007) | Yes | T025, T028, T030 | Attachment/export PDF path is explicitly covered. |
| apply-policy-based-field-restrictions (FR-008) | Yes | T012, T035, T038, T040 | Restriction engine + response shaping + UI indication are covered. |
| show-system-error-on-retrieval-failure (FR-009) | Yes | T032, T034, T037, T039 | Error handling for schedule/detail/pdf paths is covered. |
| keep-visibility-stable-across-refresh-return (FR-010) | Yes | T018, T020 | Refresh/direct-link stability scenarios are covered. |
| prevent-unpublished-final-content-exposure (FR-011) | Yes | T009, T016, T043 | Publication gate and unpublished responses are covered for list/PDF paths. |

## Constitution Alignment Issues

No constitution-critical violations detected. UC references, MVC boundaries, and vanilla web constraints are aligned in `plan.md`.

## Unmapped Tasks

- `T041`, `T042`, `T044`, and `T045` are cross-cutting observability/verification tasks and intentionally not mapped to a single FR.

## Metrics

- Total Requirements: 11 functional requirements (FR-001..FR-011)
- Total Tasks: 45
- Coverage % (requirements with >=1 task): 100%
- Ambiguity Count: 0
- Duplication Count: 0
- Critical Issues Count: 0

## Next Actions

- Resolve LOW measurability issue:
  - Define numeric schedule/PDF latency targets in `plan.md` for performance validation tasks.
