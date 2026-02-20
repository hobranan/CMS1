# Feature Specification: Enforce referee workload limits

**Feature Branch**: `001-uc09-workload-limits`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "UC-09.md contains the use case flows (the Main Success Scenario and all Extensions). Extract the functional requirements from these flows. The UC-09-AT.md contains the acceptance tests for the UC-09.md file, you can additionally use this in helping to determine the those requirements. Also, I need a new branch made for this use case. For preemptive clarifications, this UC-09.md has Open Issues where I want you to allow configurable maximum workload limits."
**Use Case Sources**: `UC-09.md`, `UC-09-AT.md`

## Clarifications

### Session 2026-02-08

- Q: Is referee maximum workload fixed or configurable? -> A: Maximum workload limits are configurable and applied at assignment time.
- Q: If multiple workload rules match, what precedence applies? -> A: Resolve one rule by precedence: track-specific rule > role-specific rule > conference default.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Assign referee within allowed workload (Priority: P1)

An authenticated editor assigns a referee to a paper when the referee's current workload is below the configured maximum.

**Why this priority**: This is the core purpose of the use case and enables valid review assignment.

**Independent Test**: Can be tested by selecting a referee below configured workload cap and confirming assignment is stored.

**Acceptance Scenarios**:

1. **Given** an authenticated editor selects a paper and referee, **When** the referee workload is below the configured maximum limit, **Then** the system allows and stores the assignment.
2. **Given** assignment succeeds, **When** workload is viewed afterward, **Then** workload count reflects the new assigned paper.

---

### User Story 2 - Reject overloaded referee assignment (Priority: P2)

An editor is prevented from assigning a referee who has reached or exceeded the configured workload limit.

**Why this priority**: Preventing overload preserves balanced review distribution and quality.

**Independent Test**: Can be tested by selecting a referee at configured maximum and confirming assignment rejection with clear feedback.

**Acceptance Scenarios**:

1. **Given** a selected referee has reached the configured maximum workload, **When** the editor attempts assignment, **Then** the system rejects assignment and shows workload-limit feedback.
2. **Given** a selected referee exceeds the configured maximum workload, **When** the editor attempts assignment, **Then** the system rejects assignment and stores nothing.

---

### User Story 3 - Handle retrieval and storage failures safely (Priority: P3)

An editor receives clear system feedback when workload retrieval or assignment storage fails, and no invalid assignment is saved.

**Why this priority**: Reliability and data integrity are required for trusted assignment operations.

**Independent Test**: Can be tested by simulating workload lookup failure and storage failure and verifying rejection with no persisted assignment.

**Acceptance Scenarios**:

1. **Given** workload information cannot be retrieved, **When** editor attempts assignment, **Then** the system rejects assignment, shows system error, and stores nothing.
2. **Given** workload check passes but storage fails, **When** editor confirms assignment, **Then** the system shows system error and does not store assignment.

---

### Edge Cases

- Referee workload equals configured maximum exactly.
- Workload limit is changed between referee selection and assignment confirmation.
- Workload retrieval succeeds for one request and fails for an immediate retry.
- Concurrent assignments to same referee approach the configured limit.
- Assignment storage fails after positive workload validation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST enforce workload limits when editors assign referees to papers.
- **FR-002**: System MUST retrieve current assigned-paper workload for the selected referee during assignment.
- **FR-003**: System MUST retrieve and apply a configurable maximum workload limit for each assignment validation, using precedence: track-specific > role-specific > conference default.
- **FR-004**: System MUST allow assignment only when referee workload is below the applicable configured maximum limit.
- **FR-005**: System MUST reject assignment when referee workload is equal to or greater than the configured maximum limit.
- **FR-006**: System MUST provide clear workload-limit error feedback when assignment is rejected for overload.
- **FR-007**: System MUST store assignment only after workload validation passes.
- **FR-008**: System MUST update referee workload counts after successful assignment storage.
- **FR-009**: System MUST reject assignment and show a system error when workload information cannot be retrieved.
- **FR-010**: System MUST reject assignment and show a system error when assignment storage fails.
- **FR-011**: System MUST ensure no invalid assignment is persisted when validation, retrieval, or storage fails.
- **FR-012**: System MUST apply updated configured workload limits to subsequent assignment checks without requiring user-side changes.

### Assumptions

- Workload means number of currently assigned papers for a referee.
- Configurable workload limit values are defined and managed by conference/system configuration policy.
- The same configured limit can vary by context, and a single applicable value is resolved at validation time using precedence: track-specific > role-specific > conference default.

### Key Entities *(include if feature involves data)*

- **Referee**: Reviewer identity with current assignment workload count.
- **Workload Limit Rule**: Configurable maximum-assignment threshold applied during assignment validation.
- **Paper Assignment Attempt**: Editor action to assign a referee to a specific paper with validation outcome.
- **Assignment Record**: Persisted referee-paper link created on successful validation.
- **Workload Snapshot**: Retrieved workload value used for assignment decisioning.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of assignment attempts below configured workload limits are accepted and stored successfully.
- **SC-002**: 100% of assignment attempts at or above configured workload limits are rejected with clear workload feedback and no stored assignment.
- **SC-003**: 100% of workload retrieval failures and storage failures result in no stored assignment and explicit system-error feedback.
- **SC-004**: 100% of successful assignments increment effective workload for subsequent checks.
- **SC-005**: 100% of assignment validations use the currently configured workload limit at time of check.
