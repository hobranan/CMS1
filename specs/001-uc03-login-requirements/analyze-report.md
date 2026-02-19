## Specification Analysis Report

| ID | Category | Severity | Location(s) | Summary | Recommendation |
|----|----------|----------|-------------|---------|----------------|
| C1 | Constitution Alignment | CRITICAL | `.specify/memory/constitution.md:50`, `specs/001-uc03-login-requirements/tasks.md:119` | Constitution requires UC and AT files to be updated in the same change set for user-facing behavior changes. Tasks only mention a sync checklist note in `tasks.md`, not explicit update tasks for `UC-03.md` and `UC-03-AT.md`. | Add explicit checklist tasks that update/verify `UC-03.md` and `UC-03-AT.md` artifacts during implementation. |
| A1 | Ambiguity | HIGH | `specs/001-uc03-login-requirements/spec.md:58` | Error wording mixes “invalid or unrecognized email/credential message,” leaving ambiguity about whether unknown-email and wrong-password feedback are intentionally distinct or normalized. | Define one explicit messaging strategy (distinct vs normalized generic) and align FR-010/FR-011 and tests accordingly. |
| G1 | Coverage Gap | MEDIUM | `specs/001-uc03-login-requirements/plan.md:22`, `specs/001-uc03-login-requirements/tasks.md:117` | Plan sets a 400ms p95 login performance goal, but tasks include observability only and no explicit performance validation/threshold check task. | Add a measurable performance verification task tied to the 400ms p95 target. |
| G2 | Coverage Gap | MEDIUM | `specs/001-uc03-login-requirements/spec.md:121`, `specs/001-uc03-login-requirements/tasks.md:53` | SC-005 (95% successful recovery within two attempts) has no direct task for instrumentation or acceptance measurement. | Add a telemetry/reporting or test-proxy task to measure SC-005, or explicitly defer it to post-implementation evaluation. |
| U1 | Underspecification | MEDIUM | `specs/001-uc03-login-requirements/spec.md:75` | Spec has no explicit Non-Functional Requirements section; reliability/performance requirements appear only in plan/success criteria. | Add an explicit NFR section in spec or trace all plan NFRs into tasks with clear measurable outputs. |
| I1 | Inconsistency | LOW | `specs/001-uc03-login-requirements/tasks.md:138`, `specs/001-uc03-login-requirements/tasks.md:89` | User-story dependency section says US2 depends on US1 availability, reducing “independent implementation” intent for story phases. | Reword dependency notes to preserve independent-testability while acknowledging shared endpoint prerequisites from foundational phase. |

### Coverage Summary Table

| Requirement Key | Has Task? | Task IDs | Notes |
|-----------------|-----------|----------|-------|
| provide-login-entry-point-for-unauthenticated-users | Yes | T015, T017 | Route + UI entry |
| prompt-for-registered-email-and-password | Yes | T017, T022 | Login UI form coverage |
| require-both-email-and-password-before-auth | Yes | T020, T019 | Validation gate + tests |
| reject-missing-fields-with-clear-feedback | Yes | T020, T021, T022, T018, T019 | Backend + frontend + tests |
| retrieve-stored-credentials-before-compare | Yes | T004, T014 | Credential store lookup path |
| compare-submitted-vs-stored-credentials | Yes | T005, T014 | Secure comparison path |
| authenticate-only-on-match | Yes | T014, T012 | Success auth checks |
| establish-session-after-success | Yes | T008, T014, T013 | Session service + continuity test |
| redirect-to-dashboard-after-success | Yes | T015, T017, T012 | Controller + UI |
| deny-unknown-email-with-retry-message | Yes | T027, T024 | Failure mapping + test |
| deny-wrong-password-with-retry-message | Yes | T027, T024 | Failure mapping + test |
| handle-credential-store-failure-deny-and-retry | Yes | T029, T026 | Outage handling |
| keep-user-on-login-after-failure | Yes | T021, T022, T030 | Failure UX flows |
| allow-protected-dashboard-during-active-session | Yes | T008, T013, T016 | Session guard + endpoint |
| track-consecutive-failed-attempts-per-account | Yes | T006, T007, T009, T025 | Lockout state + tests |
| lock-account-15-min-after-5-failures | Yes | T002, T007, T025 | Policy constants + enforcement |
| deny-login-during-active-lockout-with-retry-time | Yes | T028, T030, T025 | Lockout response |
| reset-failed-counter-after-success-or-expiry | Yes | T007, T028, T025 | Reset logic coverage |

### Constitution Alignment Issues

- **C1 (CRITICAL)**: Missing explicit tasks for updating/verifying `UC-03.md` and `UC-03-AT.md` in the implementation task checklist.

### Unmapped Tasks

- `T031`, `T032`, `T034` are cross-cutting and not explicitly tied to FR/SC IDs (useful but traceability can be improved).

### Metrics

- Total Requirements: **18** (functional), **0 explicit NFR section entries**
- Total Tasks: **34**
- Coverage % (requirements with >=1 task): **100%**
- Ambiguity Count: **1**
- Duplication Count: **0**
- Critical Issues Count: **1**

## Next Actions

- Because **CRITICAL** issues exist, resolve them before `/speckit.implement`.
- Recommended sequence:
  1. Add explicit UC artifact update tasks for `UC-03.md` and `UC-03-AT.md`.
  2. Resolve unknown-email vs wrong-password message strategy ambiguity.
  3. Add measurable tasks for p95 login latency and SC-005 recovery metric.
- Suggested commands:
  - Refine requirement wording: `/speckit.specify`
  - Align measurable constraints in plan: `/speckit.plan`
  - Regenerate/adjust task traceability: `/speckit.tasks`

Would you like me to suggest concrete remediation edits for the top 5 issues?
