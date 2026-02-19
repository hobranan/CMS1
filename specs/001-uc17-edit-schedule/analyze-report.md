# Specification Analysis Report

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| I1 | Inconsistency | MEDIUM | `specs/001-uc17-edit-schedule/checklists/edit-schedule.md:9`, `specs/001-uc17-edit-schedule/checklists/requirements.md:9` | UC-17 checklist is entirely unchecked while the generic requirements checklist may be used as readiness signal elsewhere. | Complete and mark the UC-17 checklist before implementation handoff to avoid false readiness assumptions. |
| G1 | Coverage Gap | MEDIUM | `specs/001-uc17-edit-schedule/contracts/edit-schedule.openapi.yaml`, `specs/001-uc17-edit-schedule/tasks.md:171` | Contract-level edge responses (such as stale-version/save conflict and lock-policy rejection payloads) need explicit response-shape assertions across all failure classes. | Add/verify contract assertions for each failure code path with stable `code/message` payload semantics. |
| U1 | Underspecification | LOW | `specs/001-uc17-edit-schedule/plan.md:18`, `specs/001-uc17-edit-schedule/tasks.md:173` | Plan performance target remains qualitative, so latency verification thresholds are not fully defined for T046. | Define numeric SLOs for edit-load/validate/save paths and assert them in integration/perf tests. |

## Coverage Summary Table

| Requirement Key | Has Task? | Task IDs | Notes |
|-----------------|-----------|----------|-------|
| edit-mode-for-authenticated-authorized-editors (FR-001) | Yes | T005, T010, T021 | Access model, middleware, and edit-load controller enforce role-based edit entry. |
| load-schedule-details-in-edit-mode (FR-002) | Yes | T021, T023, T025 | Backend load + frontend render paths cover full edit context. |
| allow-edits-on-draft-and-published (FR-003) | Yes | T026, T030, T031 | Published-edit policy and persistence behavior are explicitly implemented/tested. |
| validate-schedule-before-save (FR-004) | Yes | T012, T022, T040 | Save-time validation pipeline enforced in service/controller layers. |
| reject-conflicting-save-and-keep-unchanged (FR-005) | Yes | T034, T040, T044 | Conflict rejection covered in contract/service/UI error feedback. |
| block-invalid-references-or-reject-with-feedback (FR-006) | Yes | T035, T040, T044 | Invalid-reference rejection and explanatory mapping are covered. |
| discard-unsaved-on-cancel (FR-007) | Yes | T038, T041 | Cancel path tested and implemented with no persistence side effects. |
| persist-valid-edits-on-success (FR-008) | Yes | T014, T022, T019 | Transactional save path and integration verification are covered. |
| update-and-display-last-edited-on-success (FR-009) | Yes | T015, T028, T029, T032, T033 | Timestamp update/display behavior is fully covered. |
| keep-published-after-successful-edit (FR-010) | Yes | T026, T027, T031 | Contract/integration/service coverage present. |
| display-updated-conflict-status-after-save-attempts (FR-011) | Yes | T024, T044 | Save feedback and error-state controllers update conflict visibility. |
| show-system-error-and-no-change-on-db-failure (FR-012) | Yes | T037, T043, T044 | DB failure contract + rollback + UI feedback covered. |
| preserve-saved-edits-across-sessions (FR-013) | Yes | T020, T021 | Persistence is tested and surfaced through schedule reload flow. |
| block-editing-when-policy-locked (FR-014) | Yes | T011, T036, T042 | Lock service + contract + explanatory mapper coverage present. |

## Constitution Alignment Issues

No constitution-critical violations detected. UC artifact references, MVC boundaries, and vanilla web constraints are aligned in `plan.md`.

## Unmapped Tasks

- `T045`, `T046`, `T047`, and `T048` are cross-cutting observability/verification tasks and intentionally not tied to a single FR.

## Metrics

- Total Requirements: 14 functional requirements (FR-001..FR-014)
- Total Tasks: 48
- Coverage % (requirements with >=1 task): 100%
- Ambiguity Count: 0
- Duplication Count: 0
- Critical Issues Count: 0

## Next Actions

- Resolve MEDIUM checklist/contract issues before `/speckit.implement`:
  - Complete UC-17 checklist status updates.
  - Confirm all failure payload contracts are asserted in tests.
- Resolve LOW measurability issue:
  - Define numeric edit-load/validation/save latency targets in `plan.md`.
