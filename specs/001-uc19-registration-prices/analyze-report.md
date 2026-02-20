# Specification Analysis Report

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| G1 | Coverage Gap | LOW | `specs/001-uc19-registration-prices/contracts/registration-prices.openapi.yaml:13`, `specs/001-uc19-registration-prices/tasks.md:72` | Contract has only one endpoint with `200/404/500`; task coverage is strong, but contract assertions should explicitly include `discountApplied=false` and CAD labels in `200` payload validation. | Keep/verify `T029` and add strict response payload assertions for `currency=CAD` and `discountApplied=false` in contract tests. |
| U1 | Underspecification | LOW | `specs/001-uc19-registration-prices/plan.md:18`, `specs/001-uc19-registration-prices/tasks.md:113` | Plan performance goal is qualitative ("normal browsing latency"), so `T034` lacks explicit numeric acceptance thresholds. | Define numeric latency target(s) in `plan.md` and use them in performance assertions. |

## Coverage Summary Table

| Requirement Key | Has Task? | Task IDs | Notes |
|-----------------|-----------|----------|-------|
| public-access-without-login (FR-001) | Yes | T013, T014, T017, T018 | Guest/public access path is covered at contract, integration, API, and frontend levels. |
| retrieve-published-categories-and-amounts (FR-002) | Yes | T008, T013, T017 | Published set retrieval is covered by service and endpoint tests. |
| display-categories-with-final-prices (FR-003) | Yes | T019, T013, T014 | UI and API behaviors cover category-to-price presentation. |
| display-cad-only (FR-004) | Yes | T009, T016, T029 | CAD formatter plus response/integration checks are present. |
| no-discount-calculations-or-display (FR-005) | Yes | T010, T029, T031 | No-discount policy and explicit response assertions are covered. |
| show-not-available-when-unpublished (FR-006) | Yes | T020, T024, T023 | Contract + UI handling for unpublished state is covered. |
| show-available-and-indicate-missing-info (FR-007) | Yes | T011, T022, T025 | Incomplete data projection and UX indicators are covered. |
| show-system-error-on-retrieval-failure (FR-008) | Yes | T021, T026 | Error contract and frontend error-state path are covered. |
| consistent-across-refresh-return (FR-009) | Yes | T027, T032 | Stability checks and frontend consistency guard are covered. |
| same-prices-for-guests-and-auth-users (FR-010) | Yes | T015, T018 | Guest/auth parity validation is covered. |

## Constitution Alignment Issues

No constitution-critical violations detected. UC references, MVC boundaries, and vanilla web constraints are aligned in `plan.md`.

## Unmapped Tasks

- `T033`, `T034`, `T035`, and `T036` are cross-cutting observability/verification tasks and intentionally not mapped to a single FR.

## Metrics

- Total Requirements: 10 functional requirements (FR-001..FR-010)
- Total Tasks: 36
- Coverage % (requirements with >=1 task): 100%
- Ambiguity Count: 0
- Duplication Count: 0
- Critical Issues Count: 0

## Next Actions

- Resolve LOW quality items before implementation:
  - Confirm strict contract assertions for `currency=CAD` and `discountApplied=false`.
  - Define numeric latency target(s) in `plan.md` for `T034`.
