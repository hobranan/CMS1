# Feature Specification: Respond to review invitation

**Feature Branch**: `001-uc10-invitation-response`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "UC-10.md contains the use case flows (the Main Success Scenario and all Extensions). Extract the functional requirements from these flows. The UC-10-AT.md contains the acceptance tests for the UC-10.md file, you can additionally use this in helping to determine the those requirements. Also, I need a new branch made for this use case. For preemptive clarifications, this UC-10.md has Open Issues where I want you to set an invite expiry time of 2 weeks."
**Use Case Sources**: `UC-10.md`, `UC-10-AT.md`

## Clarifications

### Session 2026-02-08

- Q: What invitation expiry rule should apply? -> A: Review invitations expire 14 calendar days after they are issued.
- Q: Which clock/timezone is authoritative for expiry evaluation? -> A: Expiry is evaluated server-side using UTC (`now_utc >= issued_at_utc + 14 days`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Accept or reject a pending invitation (Priority: P1)

A logged-in referee responds to a pending invitation by accepting or rejecting so invitation status is updated and review workflow stays current.

**Why this priority**: Capturing referee response is the central action required to activate or decline review participation.

**Independent Test**: Can be tested by responding to pending invitations with both Accept and Reject and verifying status update plus assignment behavior.

**Acceptance Scenarios**:

1. **Given** a pending invitation exists and is not expired, withdrawn, or previously responded, **When** the referee accepts, **Then** status updates to Accepted, review assignment becomes active, and confirmation is shown.
2. **Given** a pending invitation exists and is not expired, withdrawn, or previously responded, **When** the referee rejects, **Then** status updates to Rejected, assignment is not activated, and confirmation is shown.

---

### User Story 2 - Prevent responses to invalid invitation states (Priority: P2)

A referee is blocked from responding when no pending invitations exist or selected invitation is not actionable.

**Why this priority**: Guardrails prevent invalid state transitions and inconsistent invitation records.

**Independent Test**: Can be tested by attempting responses with no pending invites and with non-pending invitations (expired, withdrawn, already responded).

**Acceptance Scenarios**:

1. **Given** no pending invitations are available, **When** the referee opens invitation list, **Then** the system shows a no-pending message and no response actions.
2. **Given** invitation is expired, withdrawn, or already responded, **When** the referee attempts to respond, **Then** system blocks action and keeps status unchanged.
3. **Given** invitation was issued more than 14 days ago and still pending, **When** referee attempts response, **Then** system treats invitation as expired and blocks response.

---

### User Story 3 - Handle cancel and system failures safely (Priority: P3)

A referee can cancel before confirming, and database/notification failures are handled without losing response integrity.

**Why this priority**: Reliability and predictable state transitions reduce confusion and support operational recovery.

**Independent Test**: Can be tested by canceling before confirmation, simulating database update failure, and simulating notification failure after response record.

**Acceptance Scenarios**:

1. **Given** referee starts accept/reject and cancels before confirming, **When** action is canceled, **Then** invitation remains pending with no changes.
2. **Given** response recording fails due to database error, **When** referee submits response, **Then** response is not recorded, status remains pending, and system error is shown.
3. **Given** response is recorded but notification delivery fails, **When** process completes, **Then** response remains recorded consistently and referee is informed of notification failure.

---

### Edge Cases

- Invitation expires exactly at 14-day boundary while referee is viewing details.
- Invitation is withdrawn between list view and response confirmation.
- Referee opens same invitation in multiple sessions and responds from one session first.
- Notification fails after response save succeeds.
- Database update fails after action selection but before status persistence.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow invitation response actions only for authenticated referees.
- **FR-002**: System MUST present pending invitations and invitation details with Accept/Reject options.
- **FR-003**: System MUST validate invitation is still actionable before recording any response.
- **FR-004**: System MUST treat invitations as expired 14 calendar days after issue time using server-side UTC clock authority (`now_utc >= issued_at_utc + 14 days`).
- **FR-005**: System MUST prevent responses to invitations that are expired, withdrawn, or already responded.
- **FR-006**: System MUST record accepted responses and update invitation status to Accepted.
- **FR-007**: System MUST record rejected responses and update invitation status to Rejected.
- **FR-008**: System MUST activate review assignment for the paper when invitation is accepted.
- **FR-009**: System MUST keep assignment inactive when invitation is rejected.
- **FR-010**: System MUST notify the editor after response recording when notification service is available.
- **FR-011**: System MUST allow referee cancellation before confirmation with no invitation status change.
- **FR-012**: System MUST leave invitation status unchanged and show system error when database update fails.
- **FR-013**: System MUST keep recorded response unchanged when notification sending fails and inform referee about notification issue.
- **FR-014**: System MUST remove responded invitations from pending view and show updated status consistently in invitation history/list views.

### Assumptions

- Invitation issue timestamp is available and stored in UTC for expiry calculation.
- Reminder behavior is outside scope of this use case.
- Response change after initial accept/reject is outside scope unless defined in separate use case.

### Key Entities *(include if feature involves data)*

- **Review Invitation**: Request for a referee to review a paper with status (pending, accepted, rejected, expired, withdrawn).
- **Invitation Response**: Referee decision (accept/reject) recorded against one invitation.
- **Review Assignment Activation**: State change that makes paper visible in referee assigned papers after acceptance.
- **Invitation Expiry Rule**: Policy defining 14-day response window from invitation issue time.
- **Notification Outcome**: Result of editor/referee notification attempt after response processing.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid pending invitations responded to by referees are recorded with correct Accepted/Rejected status.
- **SC-002**: 100% of accepted invitations activate assignment visibility in referee assigned papers.
- **SC-003**: 100% of invitations older than 14 days are blocked from response as expired.
- **SC-004**: 100% of non-actionable invitation responses (expired, withdrawn, already responded) are rejected without status mutation.
- **SC-005**: 100% of database update failures leave invitation status unchanged; 100% of notification failures preserve recorded response and display notification-failure feedback.
