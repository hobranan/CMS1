# Referee Assignment Requirements Quality Checklist: Assign paper referees

**Purpose**: Validate UC-08 requirement quality for completeness, clarity, consistency, measurability, and atomicity coverage.
**Created**: 2026-02-10
**Feature**: `/mnt/c/Users/ponti/Desktop/CMS1/specs/001-uc08-referee-assignment/spec.md`

## Requirement Completeness

- [ ] CHK001 Are assignment-entry requirements complete for authenticated editors and assignment-eligible papers? [Completeness, Spec §FR-001, Spec §FR-002]
- [ ] CHK002 Are selection constraints complete for minimum/maximum referee count and duplicate prevention expectations? [Completeness, Spec §FR-004, Spec §Edge Cases]
- [ ] CHK003 Are validation requirements complete for eligibility and workload checks on every selected referee? [Completeness, Spec §FR-006, Spec §FR-007, Spec §FR-008]
- [ ] CHK004 Are transactional requirements complete across persistence, invitations, confirmation, and rollback behavior? [Completeness, Spec §FR-010, Spec §FR-011, Spec §FR-012, Spec §FR-013, Spec §FR-014]

## Requirement Clarity

- [ ] CHK005 Is the policy phrase "up to three" clarified for whether zero-referee confirmation is allowed or prohibited? [Clarity, Spec §FR-004, Spec §Edge Cases]
- [ ] CHK006 Is "eligible referee" explicitly defined with authoritative criteria references? [Clarity, Spec §FR-006, Spec §Assumptions]
- [ ] CHK007 Is workload-limit evaluation timing explicit (selection time, confirmation time, or both)? [Clarity, Spec §FR-007, Spec §Edge Cases]
- [ ] CHK008 Is "all-or-nothing" operationally defined with precise rollback boundary and state guarantees? [Clarity, Spec §FR-013, Spec §FR-014]

## Requirement Consistency

- [ ] CHK009 Do FR-010 through FR-012 consistently define success as requiring both assignment persistence and invitation delivery? [Consistency, Spec §FR-010, Spec §FR-011, Spec §FR-012]
- [ ] CHK010 Are failure-path requirements for database errors and notification errors consistent with no-partial-assignment policy? [Consistency, Spec §FR-013, Spec §FR-014, Spec §FR-015]
- [ ] CHK011 Are edge-case expectations for concurrent assignment attempts consistent with assignment unchanged guarantees? [Consistency, Spec §Edge Cases, Spec §FR-016]

## Acceptance Criteria Quality

- [ ] CHK012 Are SC-001 through SC-005 objectively measurable with explicit evidence sources and denominators? [Acceptance Criteria, Spec §SC-001, Spec §SC-002, Spec §SC-003, Spec §SC-004, Spec §SC-005]
- [ ] CHK013 Is SC-005 ("95% one-confirmation attempt") scoped with clear preconditions for referee availability and data freshness? [Measurability, Spec §SC-005]
- [ ] CHK014 Are acceptance scenarios traceably mapped to FR IDs with implementation-agnostic pass/fail outcomes? [Traceability, Spec §Acceptance Scenarios]

## Scenario Coverage

- [ ] CHK015 Are primary-flow requirements complete for selecting valid referees, finalizing assignment, and verifying visibility on reopen? [Coverage, Spec §User Story 1, Spec §FR-012]
- [ ] CHK016 Are alternate-flow requirements complete for over-limit selections, ineligible selections, and workload violations? [Coverage, Spec §User Story 2, Spec §FR-005, Spec §FR-008]
- [ ] CHK017 Are recovery requirements complete for storage and notification failures with explicit unchanged-assignment outcomes? [Coverage, Spec §User Story 3, Spec §FR-014, Spec §FR-015]
- [ ] CHK018 Are requirements defined for editor guidance when a concurrency conflict occurs between selection and confirmation? [Coverage, Spec §Edge Cases, Gap]

## Edge Case Coverage

- [ ] CHK019 Are requirements explicit for zero-referee confirmations and expected response behavior? [Edge Case, Spec §Edge Cases, Spec §FR-004]
- [ ] CHK020 Are requirements explicit for duplicate referee selections in one request and deduplication/rejection policy? [Edge Case, Spec §Edge Cases, Gap]
- [ ] CHK021 Are requirements explicit for stale selection states when workload threshold changes just before confirm? [Edge Case, Spec §Edge Cases]

## Non-Functional Requirements

- [ ] CHK022 Are performance requirements specified for confirmation latency under normal and peak assignment load? [Non-Functional, Gap]
- [ ] CHK023 Are reliability requirements specified for notification delivery guarantees and retry strategy boundaries? [Non-Functional, Gap]
- [ ] CHK024 Are security/audit requirements defined for editor action traceability on assignment changes and rollbacks? [Non-Functional, Gap]

## Dependencies & Assumptions

- [ ] CHK025 Are workload-threshold dependencies referenced to an authoritative policy source with version control? [Dependency, Spec §Assumptions]
- [ ] CHK026 Are assumptions excluding conflict-of-interest handling clearly bounded to avoid hidden requirement gaps? [Assumption, Spec §Assumptions]
- [ ] CHK027 Are notification-service dependency expectations defined for timeout, failure classification, and rollback trigger conditions? [Dependency, Spec §FR-014, Gap]

## Ambiguities & Conflicts

- [ ] CHK028 Is there any unresolved ambiguity in acceptance test wording where notification failure may "remain stored (or rolled back)" versus strict no-partial policy? [Conflict, Spec §FR-013, Spec §FR-014, Spec §Use Case Extensions 9a]
- [ ] CHK029 Is a stable requirement-to-acceptance-test ID mapping scheme explicitly defined for FR and SC traceability? [Traceability, Gap]
