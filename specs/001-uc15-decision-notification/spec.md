# Feature Specification: Receive final decision notification

**Feature Branch**: `001-uc15-decision-notification`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "UC-15.md contains the use case flows (the Main Success Scenario and all Extensions). Extract the functional requirements from these flows. The UC-15-AT.md contains the acceptance tests for the UC-15.md file, you can additionally use this in helping to determine the those requirements. Also, I need a new branch made for this use case. For preemptive clarifications, this UC-15.md has Open Issues where I want you to set it up where decision notifications first include summary bullet points of the review, then below would hold the full review."
**Use Case Sources**: `UC-15.md`, `UC-15-AT.md`

## Clarifications

### Session 2026-02-08

- Q: What decision content format should notifications use? -> A: Decision notifications first present summary bullet points of the review outcome, followed by the full review content below.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View final decision in CMS (Priority: P1)

An authenticated author views the final Accept or Reject decision for their submitted paper in the CMS.

**Why this priority**: This is the primary author-facing outcome of the review process.

**Independent Test**: Can be tested by opening authored papers with recorded decisions and verifying decision status plus comment visibility.

**Acceptance Scenarios**:

1. **Given** an authored paper has a recorded Accepted decision, **When** the author opens the paper, **Then** system displays Accepted status and any decision comment.
2. **Given** an authored paper has a recorded Rejected decision, **When** the author opens the paper, **Then** system displays Rejected status and any decision comment.

---

### User Story 2 - Receive decision notification details (Priority: P2)

An author receives decision notifications that are easy to scan and detailed, with summary bullets first and full review below.

**Why this priority**: Structured notification content improves comprehension while preserving full review context.

**Independent Test**: Can be tested by generating decision notifications and verifying content order and inclusion rules.

**Acceptance Scenarios**:

1. **Given** a final decision is recorded, **When** notification is generated, **Then** it includes decision status and summary bullet points before full review content.
2. **Given** notification includes review content, **When** author opens it, **Then** full review appears below the summary section in the same notification body.

---

### User Story 3 - Handle unavailable/unauthorized/failure cases (Priority: P3)

An author gets clear feedback if decision is not yet available, access is unauthorized, or retrieval fails.

**Why this priority**: Reliable error handling prevents confusion and protects data access.

**Independent Test**: Can be tested by simulating notification delivery failure, under-review status, unauthorized access, and decision retrieval errors.

**Acceptance Scenarios**:

1. **Given** notification delivery fails, **When** author logs into CMS and opens paper details, **Then** final decision remains visible from CMS if recorded.
2. **Given** decision is not yet recorded, **When** author opens paper, **Then** system indicates the paper is still under review.
3. **Given** author attempts to access a paper they do not own, **When** access is requested, **Then** system blocks access and shows authorization error.
4. **Given** decision retrieval fails, **When** author opens paper decision view, **Then** system shows system error and advises retry later.

---

### Edge Cases

- Decision exists but notification service is unavailable at send time.
- Paper remains under review with no final decision yet.
- Author refreshes decision page after viewing final status.
- Author accesses decision details immediately after decision is recorded.
- Review summary bullets exist while full review content is temporarily unavailable.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST make recorded final paper decisions visible to the paper owner in CMS.
- **FR-002**: System MUST display decision status as Accepted or Rejected on the authored paper decision view.
- **FR-003**: System MUST display decision comments when available.
- **FR-004**: System MUST generate author decision notifications after final decision recording.
- **FR-005**: System MUST structure decision notifications so summary bullet points appear before full review content.
- **FR-006**: System MUST include full review content below the summary section in decision notifications when review content is included.
- **FR-007**: System MUST treat CMS decision view as source of truth when notification delivery fails.
- **FR-008**: System MUST indicate under-review status when a final decision is not yet available.
- **FR-009**: System MUST block access to papers not owned by the requesting author and show authorization error feedback.
- **FR-010**: System MUST show a system error and withhold decision details when retrieval fails.
- **FR-011**: System MUST persist recorded decision visibility across page refresh and new sessions.
- **FR-012**: System MUST keep decision visibility independent of notification delivery success.

### Assumptions

- Final decision outcomes in this use case are Accept or Reject.
- Notification channels may include in-app and/or email.
- Summary bullets are generated from available review conclusions without exposing unauthorized data.

### Key Entities *(include if feature involves data)*

- **Paper Decision**: Final outcome record (Accepted/Rejected) with optional editor comment.
- **Decision Notification**: Author-facing message generated after final decision recording.
- **Review Summary Section**: Bullet-point overview presented first in decision notification.
- **Full Review Section**: Detailed review content presented below summary bullets in decision notification.
- **Author Ownership Rule**: Access rule limiting decision visibility to paper owners.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of papers with recorded final decisions show correct decision status to owning authors in CMS.
- **SC-002**: 100% of generated decision notifications place review summary bullet points before full review content.
- **SC-003**: 100% of notification delivery failures still allow decision visibility in CMS for owning authors.
- **SC-004**: 100% of under-review papers show no final decision and display an under-review message.
- **SC-005**: 100% of unauthorized paper decision access attempts are blocked with authorization feedback.
