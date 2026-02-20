# Feature Specification: Access assigned papers and review forms

**Feature Branch**: `001-uc11-assigned-paper-access`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "UC-11.md contains the use case flows (the Main Success Scenario and all Extensions). Extract the functional requirements from these flows. The UC-11-AT.md contains the acceptance tests for the UC-11.md file, you can additionally use this in helping to determine the those requirements. Also, I need a new branch made for this use case. For preemptive clarifications, this UC-11.md has Open Issues where I want you to set it up where manuscripts are view-only, and review forms are pre-generated."
**Use Case Sources**: `UC-11.md`, `UC-11-AT.md`

## Clarifications

### Session 2026-02-08

- Q: Are manuscripts downloadable or view-only? -> A: Manuscripts are view-only for assigned referees.
- Q: When are review forms created? -> A: Review forms are pre-generated and must exist before referee access.
- Q: What is list-endpoint behavior for unauthenticated vs authenticated referees with no assignments? -> A: Unauthenticated list requests return `401`; authenticated referees with no assignments receive `200` with an empty list and no-assigned-papers message.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Access assigned papers and open resources (Priority: P1)

An authenticated referee views assigned papers, opens manuscript content in view-only mode, and accesses the associated pre-generated review form.

**Why this priority**: This is the core referee access flow required to perform reviews.

**Independent Test**: Can be tested by opening assigned paper list, selecting a paper, opening manuscript in view mode, and opening its review form.

**Acceptance Scenarios**:

1. **Given** a logged-in referee with at least one assignment, **When** the referee opens Assigned Papers, **Then** the system displays assigned papers for that referee.
2. **Given** an assigned paper is selected, **When** the referee opens the manuscript, **Then** the system provides view-only access without download/edit actions.
3. **Given** an assigned paper is selected, **When** the referee opens the review form, **Then** the system displays the pre-generated review form.

---

### User Story 2 - Enforce assignment-based authorization (Priority: P2)

A referee is restricted to resources for papers assigned to them only.

**Why this priority**: Access control protects confidential submissions and review integrity.

**Independent Test**: Can be tested by attempting to access a non-assigned paper and verifying access is blocked.

**Acceptance Scenarios**:

1. **Given** a referee requests a paper not assigned to them, **When** access is attempted, **Then** the system blocks paper details, manuscript view, and review form access with an authorization error.
2. **Given** no papers are assigned, **When** the referee opens Assigned Papers, **Then** the system shows a no-assigned-papers message and no access links.

---

### User Story 3 - Handle unavailable data and system failures (Priority: P3)

A referee receives clear error feedback when assigned-paper list, manuscript, or review form cannot be retrieved.

**Why this priority**: Failure transparency helps referees recover and avoids silent workflow breaks.

**Independent Test**: Can be tested by simulating list retrieval failure, manuscript unavailability, and review-form unavailability.

**Acceptance Scenarios**:

1. **Given** assigned-paper list retrieval fails, **When** referee opens Assigned Papers, **Then** system shows system error and no list data.
2. **Given** manuscript for assigned paper is unavailable, **When** referee opens manuscript, **Then** system shows manuscript-access error and allows retry later.
3. **Given** pre-generated review form for assigned paper is unavailable, **When** referee opens review form, **Then** system shows review-form access error and allows retry later.

---

### Edge Cases

- Referee refreshes Assigned Papers after successful load.
- Assigned paper exists but manuscript link points to missing storage object.
- Assigned paper exists but pre-generated review form record is missing.
- Referee attempts direct URL access to non-assigned paper resources.
- Authorization service failure occurs during resource access check.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow assigned-paper access only to authenticated referees.
- **FR-002**: System MUST retrieve and display papers assigned to the logged-in referee.
- **FR-003**: System MUST show a no-assigned-papers message when referee has no assignments.
- **FR-004**: System MUST provide paper-detail access for selected assigned papers.
- **FR-005**: System MUST provide manuscript access for assigned papers in view-only mode.
- **FR-006**: System MUST NOT provide manuscript download capability from this access flow.
- **FR-007**: System MUST validate assignment ownership before allowing manuscript or review-form access.
- **FR-008**: System MUST block access to papers not assigned to the referee and show authorization error feedback.
- **FR-009**: System MUST make pre-generated review forms available for assigned papers.
- **FR-010**: System MUST NOT require on-demand review-form generation during referee access.
- **FR-011**: System MUST show a system error when assigned-paper list retrieval fails and prevent list display.
- **FR-012**: System MUST show a manuscript-unavailable error when manuscript cannot be retrieved.
- **FR-013**: System MUST show a review-form-unavailable error when pre-generated review form cannot be retrieved.
- **FR-014**: System MUST preserve successful access behavior after page refresh for assigned resources.
- **FR-015**: System MUST return `401` for unauthenticated assigned-papers list requests, and `200` with an empty list for authenticated referees with no assignments.
- **FR-016**: On refresh/reload, System MUST replace client cached assigned-resource state with server-authoritative data and show resource-unavailable/removed states when assignments changed.

### Assumptions

- Assigned-paper access applies to active assignments available to the referee.
- View-only manuscript access allows reading but no editing or file export in this use case.
- Review form generation lifecycle is handled before referee access begins.

### Key Entities *(include if feature involves data)*

- **Assigned Paper**: Paper linked to a referee and eligible for review access.
- **Manuscript View Resource**: Read-only paper content resource accessible to assigned referee.
- **Review Form**: Pre-generated evaluation form associated with an assigned paper.
- **Assignment Authorization Rule**: Access rule requiring paper-to-referee assignment match.
- **Access Attempt Result**: Outcome of list/resource retrieval (success, unauthorized, unavailable, system error).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid assigned-paper access requests return only papers assigned to the requesting referee.
- **SC-002**: 100% of manuscript accesses from assigned papers are view-only with no download option.
- **SC-003**: 100% of non-assigned paper access attempts are blocked with authorization feedback.
- **SC-004**: 100% of assigned papers with available resources allow opening both manuscript view and pre-generated review form.
- **SC-005**: 100% of list/manuscript/review-form retrieval failures return explicit error feedback without exposing unauthorized data.
