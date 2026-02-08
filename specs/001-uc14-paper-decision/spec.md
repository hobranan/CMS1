# Feature Specification: Record paper decision

**Feature Branch**: `001-uc14-paper-decision`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "UC-14.md contains the use case flows (the Main Success Scenario and all Extensions). Extract the functional requirements from these flows. The UC-14-AT.md contains the acceptance tests for the UC-14.md file, you can additionally use this in helping to determine the those requirements. Also, I need a new branch made for this use case."
**Use Case Sources**: `UC-14.md`, `UC-14-AT.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Record final accept/reject decision (Priority: P1)

An authenticated editor records a final decision of Accept or Reject for a paper so authors can be informed and the review process can conclude.

**Why this priority**: Final decision recording is the core outcome of the editorial workflow.

**Independent Test**: Can be tested by selecting a decision for an eligible paper, confirming, and verifying status update plus stored decision.

**Acceptance Scenarios**:

1. **Given** an authenticated editor with an eligible paper under responsibility, **When** the editor selects Accept and confirms, **Then** the system stores the decision, updates paper status to Accepted, and shows confirmation.
2. **Given** an authenticated editor with an eligible paper under responsibility, **When** the editor selects Reject and confirms, **Then** the system stores the decision, updates paper status to Rejected, and shows confirmation.

---

### User Story 2 - Block disallowed decision attempts (Priority: P2)

An editor is prevented from making a decision when prerequisites are not satisfied.

**Why this priority**: Guardrails prevent invalid status transitions and premature decisions.

**Independent Test**: Can be tested by attempting decisions with no completed reviews, already-decided papers, and closed decision periods.

**Acceptance Scenarios**:

1. **Given** a paper has no completed reviews, **When** editor attempts decision, **Then** system blocks decision and warns that completed reviews are required.
2. **Given** a paper is already decided or decision period is closed, **When** editor attempts decision, **Then** system blocks decision and explains why it is not allowed.
3. **Given** editor begins a decision but cancels before confirmation, **When** action is canceled, **Then** paper status and stored decision remain unchanged.

---

### User Story 3 - Handle save/notification failures safely (Priority: P3)

An editor gets clear system feedback when persistence or notifications fail, with consistent decision state.

**Why this priority**: Reliability and state consistency are required for trusted editorial decisions.

**Independent Test**: Can be tested by simulating database failure and notification failure during decision processing.

**Acceptance Scenarios**:

1. **Given** decision is allowed, **When** saving to database fails, **Then** system reports error and paper status remains unchanged.
2. **Given** decision is saved successfully, **When** author notification fails, **Then** decision remains stored and system informs editor that notifications were not sent.
3. **Given** decision was recorded successfully, **When** editor refreshes or logs out and back in, **Then** stored decision and paper status persist.

---

### Edge Cases

- Editor enters an optional decision comment and then cancels before confirmation.
- Paper becomes ineligible between decision selection and confirmation.
- Notification service is unavailable after successful decision save.
- Multiple editor sessions attempt to decide the same paper near-simultaneously.
- Paper has exactly one completed review and is still eligible for decision.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow final paper decision actions only for authenticated editors authorized for the paper.
- **FR-002**: System MUST present paper details, completed reviews, and decision options (Accept, Reject) for eligible papers.
- **FR-003**: System MUST allow an optional decision comment to be entered with the decision.
- **FR-004**: System MUST require explicit confirmation before recording a decision.
- **FR-005**: System MUST validate decision eligibility at confirmation time.
- **FR-006**: System MUST block decision when no completed reviews are available, unless explicitly overridden by policy.
- **FR-007**: System MUST block decision when paper is already decided or decision period is closed.
- **FR-008**: System MUST leave paper status unchanged when editor cancels before confirmation.
- **FR-009**: System MUST store confirmed valid decisions and update paper status to Accepted or Rejected accordingly.
- **FR-010**: System MUST ensure decision storage and paper status update are consistent outcomes of one finalized decision action.
- **FR-011**: System MUST notify author(s) after successful decision storage when notification service is available.
- **FR-012**: System MUST keep decision stored and paper status updated if notification sending fails, while informing editor of notification failure.
- **FR-013**: System MUST show a system error and keep paper status unchanged when decision save fails.
- **FR-014**: System MUST persist recorded decision and paper status across refresh and new sessions.

### Assumptions

- Decisions supported in this use case are only Accept and Reject.
- Decision changes after recording are outside this use case unless explicitly defined elsewhere.
- Editorial override policy, if enabled, is governed by separate conference configuration.

### Key Entities *(include if feature involves data)*

- **Paper**: Submission under editorial responsibility with current decision status.
- **Completed Review Set**: Submitted reviews used to support final decision.
- **Decision Record**: Stored final outcome (Accepted/Rejected) and optional editor comment.
- **Decision Eligibility State**: Current condition determining whether decision can be recorded.
- **Notification Outcome**: Result of sending decision notice to author(s).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of eligible confirmed decisions are stored and update paper status correctly to Accepted or Rejected.
- **SC-002**: 100% of disallowed decision attempts (no completed reviews, already decided, decision period closed) are blocked with explanatory feedback and no status change.
- **SC-003**: 100% of canceled decision actions leave stored decision and paper status unchanged.
- **SC-004**: 100% of decision-save failures leave paper status unchanged and return explicit system-error feedback.
- **SC-005**: 100% of notification failures after successful decision save preserve stored decision while informing the editor of notification failure.
