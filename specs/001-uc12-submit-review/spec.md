# Feature Specification: Submit completed review

**Feature Branch**: `001-uc12-submit-review`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "UC-12.md contains the use case flows (the Main Success Scenario and all Extensions). Extract the functional requirements from these flows. The UC-12-AT.md contains the acceptance tests for the UC-12.md file, you can additionally use this in helping to determine the those requirements. Also, I need a new branch made for this use case. For preemptive clarifications, this UC-12.md has Open Issues where I want you to set it up where there is deadlines indicated but they do not affect the system in any way; and submitted reviews cannot be edited, but newer reviews can be attached to the latest submitted review."
**Use Case Sources**: `UC-12.md`, `UC-12-AT.md`

## Clarifications

### Session 2026-02-08

- Q: How should deadlines affect review submission? -> A: Deadlines are shown as informational indicators only and do not block submission or alter system behavior.
- Q: Can submitted reviews be changed? -> A: Submitted reviews are immutable; referees cannot edit submitted content, but can submit a newer review version attached to the latest submitted review.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Submit completed review successfully (Priority: P1)

A logged-in referee submits a completed review for an active assignment so the editor can evaluate it.

**Why this priority**: Review submission is the primary outcome of referee work and is required for editorial decisions.

**Independent Test**: Can be tested by completing required fields, submitting, and verifying submitted/read-only state plus editor visibility.

**Acceptance Scenarios**:

1. **Given** an authenticated referee with an active assignment and complete review fields, **When** the referee submits review, **Then** the system validates fields, stores submitted review, marks status completed, and confirms success.
2. **Given** a review is submitted successfully, **When** the editor opens paper reviews, **Then** submitted review content is visible.

---

### User Story 2 - Prevent invalid submission attempts (Priority: P2)

A referee gets clear feedback when trying to submit incomplete reviews or when assignment is not active.

**Why this priority**: Validation and assignment checks protect review quality and workflow correctness.

**Independent Test**: Can be tested by attempting submission with missing required fields and with inactive assignment.

**Acceptance Scenarios**:

1. **Given** required fields are incomplete, **When** referee submits, **Then** system blocks submission, highlights missing/invalid fields, and keeps review unsubmitted.
2. **Given** assignment is no longer active, **When** referee submits, **Then** system blocks submission and keeps review unsubmitted.
3. **Given** a displayed deadline date has passed but assignment remains active, **When** referee submits completed review, **Then** system accepts submission because deadline display is informational only.

---

### User Story 3 - Preserve submitted review integrity and support newer versions (Priority: P3)

Submitted reviews remain immutable, and referees can add newer submitted versions linked to the latest submitted review.

**Why this priority**: Immutable records protect auditability while allowing post-submission updates through explicit versioning.

**Independent Test**: Can be tested by submitting once, confirming form becomes read-only, then creating and submitting a newer attached version.

**Acceptance Scenarios**:

1. **Given** a review has been submitted, **When** referee reopens it, **Then** submitted content is read-only and cannot be edited.
2. **Given** a submitted review exists, **When** referee creates and submits a newer review version, **Then** system stores it as a new submitted review linked to the latest prior submission.
3. **Given** notification sending fails after submission is stored, **When** process completes, **Then** review remains submitted and referee is informed of notification failure.

---

### Edge Cases

- Referee starts submission and cancels before confirming.
- Database save fails after validation passes.
- Notification service fails after review is stored.
- Review contains valid values at field-level limits.
- Referee attempts to edit a submitted review directly.
- Multiple newer review versions are submitted sequentially.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow review submission only for authenticated referees with active assignments.
- **FR-002**: System MUST validate required review fields and allowed value constraints before submission.
- **FR-003**: System MUST block submission when required fields are incomplete or invalid and provide field-level feedback.
- **FR-004**: System MUST block submission when assignment is not active.
- **FR-005**: System MUST display review deadline information to referees when available.
- **FR-006**: System MUST NOT enforce deadline-based blocking or behavior changes from displayed deadline indicators.
- **FR-007**: System MUST store valid submitted reviews and mark them as submitted.
- **FR-008**: System MUST update assignment/review status to completed after successful review submission.
- **FR-009**: System MUST make submitted reviews visible to authorized editors.
- **FR-010**: System MUST keep submitted reviews read-only and prevent direct edits to submitted content.
- **FR-011**: System MUST allow submission of a newer review version attached to the latest submitted review for the same paper/referee assignment.
- **FR-012**: System MUST preserve link history between submitted review versions in sequence order.
- **FR-013**: System MUST leave review unsubmitted and status unchanged when database save fails.
- **FR-014**: System MUST keep review submitted when notification fails after storage and inform referee of notification failure.
- **FR-015**: System MUST leave review in draft state when referee cancels before final submit confirmation.

### Assumptions

- At least one review form exists for each active referee assignment.
- Newer attached review versions represent superseding submissions while preserving prior submitted records.
- Deadline indicators are informational metadata only and are not eligibility rules in this use case.

### Key Entities *(include if feature involves data)*

- **Review Draft**: In-progress review content editable before submission.
- **Submitted Review**: Immutable submitted review record with completion state.
- **Review Version Link**: Relationship connecting a newer submitted review to the latest prior submitted review.
- **Assignment Status**: Active/completed state controlling submission eligibility.
- **Review Deadline Indicator**: Displayed date/time metadata shown to referee without enforcement logic.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of complete valid reviews for active assignments are submitted successfully and marked completed.
- **SC-002**: 100% of incomplete or invalid review submissions are blocked with actionable field feedback and remain unsubmitted.
- **SC-003**: 100% of submitted reviews are read-only and cannot be directly edited afterward.
- **SC-004**: 100% of newer submitted review versions are linked to the latest prior submitted review for the same assignment.
- **SC-005**: 100% of submissions remain unaffected by passed displayed deadlines when assignment is active.
