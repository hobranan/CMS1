# Feature Specification: Assign paper referees

**Feature Branch**: `001-uc08-referee-assignment`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "UC-08.md contains the use case flows (the Main Success Scenario and all Extensions). Extract the functional requirements from these flows. The UC-08-AT.md contains the acceptance tests for the UC-08.md file, you can additionally use this in helping to determine the those requirements. Also, I need a new branch made for this use case. For preemptive clarifications, this UC-08.md has Open Issues where I want you to not allow partial assignments."
**Use Case Sources**: `UC-08.md`, `UC-08-AT.md`

## Clarifications

### Session 2026-02-08

- Q: Are partial referee assignments allowed? -> A: No partial assignments are allowed; assignment is all-or-nothing for the selected referee set.
- Q: What workload source and timing must be used for assignment validation? -> A: Use UC-09 workload limits from database configuration and validate in real time at confirmation.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Assign valid referees successfully (Priority: P1)

An authenticated editor assigns referees to a submitted paper so the paper can proceed to review setup.

**Why this priority**: Referee assignment is the core workflow gate to begin the review process.

**Independent Test**: Can be tested by selecting a paper, choosing valid referees within limits, confirming assignment, and verifying invitations plus success confirmation.

**Acceptance Scenarios**:

1. **Given** an authenticated editor and a submitted paper awaiting assignment, **When** the editor selects up to three eligible referees within workload limits and confirms, **Then** the system stores the full assignment set, sends invitations, and confirms success.
2. **Given** assignment succeeds, **When** the editor reopens the paper assignment details, **Then** the assigned referees are shown consistently.

---

### User Story 2 - Prevent invalid referee selections (Priority: P2)

An editor receives clear feedback when assignment rules are violated and can correct selections before confirming.

**Why this priority**: Validation prevents assignment errors that would break conference review rules.

**Independent Test**: Can be tested by selecting more than three referees, selecting ineligible referees, and selecting workload-exceeded referees, then verifying rejection.

**Acceptance Scenarios**:

1. **Given** more than three referees are selected, **When** the editor attempts to confirm, **Then** the system rejects the request and shows a maximum-referees error.
2. **Given** one or more selected referees are ineligible, **When** the editor attempts to confirm, **Then** the system rejects the request and identifies ineligible selections.
3. **Given** one or more selected referees exceed workload limits, **When** the editor attempts to confirm, **Then** the system rejects the request and identifies workload violations.

---

### User Story 3 - Handle persistence/notification failures atomically (Priority: P3)

An editor is informed of system failures and assignments are never left in a partial state.

**Why this priority**: Atomic behavior preserves data integrity and operational consistency.

**Independent Test**: Can be tested by simulating database save failure and notification failure, then verifying no partial assignment remains.

**Acceptance Scenarios**:

1. **Given** valid selections are confirmed, **When** database save fails, **Then** the system reports system error and no assignments are finalized.
2. **Given** assignments are ready to finalize, **When** invitation notification fails, **Then** the system reports notification failure and rolls back assignment so no partial assignment remains.
3. **Given** any failure occurs after confirmation starts, **When** the transaction completes, **Then** either the full selected set is assigned with notifications sent, or none are assigned.

---

### Edge Cases

- Editor selects zero referees and attempts to confirm.
- Editor selects duplicate referee entries in one assignment attempt.
- Editor changes selection immediately before confirm.
- Workload threshold is reached by a referee between selection and confirmation.
- Notification service is unavailable after assignments are prepared.
- Concurrent editor attempts assign referees to the same paper.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow referee assignment only for authenticated editors.
- **FR-002**: System MUST present submitted papers requiring referee assignment.
- **FR-003**: System MUST display an assignment interface for the selected paper.
- **FR-004**: System MUST allow selecting up to three referees per paper assignment action.
- **FR-005**: System MUST reject assignment attempts with more than three selected referees and provide clear error feedback.
- **FR-006**: System MUST validate referee eligibility before confirmation.
- **FR-007**: System MUST validate each selected referee workload in real time at confirmation against UC-09 workload limits from database configuration.
- **FR-008**: System MUST reject assignment attempts that include any ineligible or workload-exceeded referee and identify the violating selection(s).
- **FR-009**: System MUST require explicit editor confirmation before finalizing assignment.
- **FR-010**: System MUST store referee assignments for the paper only after all validations pass.
- **FR-011**: System MUST send review invitations to all assigned referees after successful assignment finalization.
- **FR-012**: System MUST confirm successful assignment to the editor only when storage and invitation steps complete successfully.
- **FR-013**: System MUST prevent partial assignment outcomes; assignment of the selected referee set MUST be all-or-nothing.
- **FR-014**: System MUST roll back assignment if invitation sending fails so no selected referee remains partially assigned.
- **FR-015**: System MUST show a system error and keep assignment unchanged when database save fails.
- **FR-016**: System MUST keep assignment unchanged when validation fails.

### Assumptions

- Conference policy allows one to three referees per paper assignment action.
- Maximum referee workload thresholds come from UC-09 limits stored in database configuration and are evaluated at confirmation time.
- Conflict-of-interest rules are outside the scope of this use case.

### Key Entities *(include if feature involves data)*

- **Paper**: Submitted manuscript requiring referee assignment before review.
- **Referee**: Eligible reviewer with workload status and assignment eligibility.
- **Assignment Set**: The selected referee group (up to three) proposed for one paper.
- **Assignment Transaction Result**: Outcome indicating success with notifications sent or complete rollback.
- **Review Invitation**: Notification sent to each assigned referee to start review participation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid assignment confirmations (within limits and workload rules) are fully stored and all invitations are sent.
- **SC-002**: 100% of invalid assignment attempts (over three, ineligible, or workload-exceeded) are rejected with clear feedback and no assignment change.
- **SC-003**: 100% of database save failures result in no finalized assignment changes.
- **SC-004**: 100% of notification failures result in rollback so no partial assignment exists.
- **SC-005**: At least 95% of editors can complete a valid assignment in one confirmation attempt when eligible referees are available.
