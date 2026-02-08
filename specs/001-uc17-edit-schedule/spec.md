# Feature Specification: Edit conference schedule

**Feature Branch**: `001-uc17-edit-schedule`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "UC-17.md contains the use case flows (the Main Success Scenario and all Extensions). Extract the functional requirements from these flows. The UC-17-AT.md contains the acceptance tests for the UC-17.md file, you can additionally use this in helping to determine the those requirements. Also, I need a new branch made for this use case. For preemptive clarifications, this UC-17.md has Open Issues where I want you to set it up where published schedules can be edited, but they indicate the date and time when last edited."
**Use Case Sources**: `UC-17.md`, `UC-17-AT.md`

## Clarifications

### Session 2026-02-08

- Q: Can published schedules be edited? -> A: Yes, published schedules can be edited by authorized editors.
- Q: How should edit recency be shown? -> A: Schedules display the date and time of the most recent successful edit.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edit and save schedule updates (Priority: P1)

An authenticated editor edits an existing schedule and saves valid changes so schedule quality improves.

**Why this priority**: Saving validated edits is the core purpose of this use case.

**Independent Test**: Can be tested by opening editable schedule, applying valid changes, saving, and confirming persisted updates.

**Acceptance Scenarios**:

1. **Given** an authenticated editor opens an editable schedule, **When** they make valid changes and save, **Then** system validates, persists changes, and confirms success.
2. **Given** schedule edits are saved, **When** editor refreshes or signs in again, **Then** saved schedule changes remain visible.

---

### User Story 2 - Edit published schedules with visible last-edited timestamp (Priority: P2)

An authorized editor can modify already published schedules, and the schedule shows when it was last edited.

**Why this priority**: This clarification changes default lock behavior and requires transparent change recency.

**Independent Test**: Can be tested by editing a published schedule and verifying save succeeds plus updated last-edited date/time.

**Acceptance Scenarios**:

1. **Given** a schedule is published, **When** authorized editor opens edit mode and saves valid changes, **Then** system allows update and keeps schedule published.
2. **Given** any successful schedule save, **When** schedule is displayed, **Then** system shows most recent edit date and time.

---

### User Story 3 - Reject invalid edits and handle failures safely (Priority: P3)

An editor gets clear feedback when changes are invalid, canceled, or cannot be saved due to system failure.

**Why this priority**: Preventing invalid state and preserving data consistency is essential.

**Independent Test**: Can be tested by introducing conflicts, invalid slot/session edits, canceling edits, and simulating save failures.

**Acceptance Scenarios**:

1. **Given** an edit introduces room/time conflicts, **When** editor saves, **Then** system rejects save with conflict errors and leaves schedule unchanged.
2. **Given** an edit uses invalid session/time references, **When** editor attempts save, **Then** system blocks the edit or rejects save with explanatory error.
3. **Given** editor cancels before saving, **When** edit mode exits, **Then** unsaved changes are discarded.
4. **Given** database failure occurs during save, **When** save is attempted, **Then** system reports error and persists no changes.

---

### Edge Cases

- Schedule has no conflicts but editor performs optional non-conflict edits.
- Editor attempts edit on a schedule flagged locked by policy exception.
- Two editors save conflicting edits close in time.
- Published schedule receives multiple edits in one day and timestamp must reflect latest save.
- Validation passes locally but fails at save time due to concurrent schedule changes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow schedule edit mode only to authenticated editors with schedule-edit permission.
- **FR-002**: System MUST load schedule details with sessions, papers, times, rooms, and current conflict indicators in edit mode.
- **FR-003**: System MUST allow schedule edits for both draft and published schedules when editor is authorized.
- **FR-004**: System MUST validate edited schedules against scheduling constraints before saving.
- **FR-005**: System MUST reject save when edits introduce conflicts and keep schedule unchanged from last saved state.
- **FR-006**: System MUST block invalid references (for example, non-existent session or invalid time slot) or reject save with clear validation feedback.
- **FR-007**: System MUST discard unsaved changes when editor cancels editing before save confirmation.
- **FR-008**: System MUST persist valid schedule edits to the database on successful save.
- **FR-009**: System MUST update and display the schedule's last-edited date and time after each successful save.
- **FR-010**: System MUST keep published schedules published after successful edits unless an explicit unpublish action is performed elsewhere.
- **FR-011**: System MUST display updated conflict status after save attempts.
- **FR-012**: System MUST show a system error and persist no schedule changes when database save fails.
- **FR-013**: System MUST preserve saved schedule edits across refresh and new sessions.
- **FR-014**: System MUST block editing when a schedule is explicitly locked by policy and show explanatory feedback.

### Assumptions

- Last-edited timestamp uses system-recorded save time for the schedule.
- Published-schedule edit permission is limited to authorized editor/admin roles.
- Conflict resolution rules are based on existing schedule constraints and may evolve outside this use case.

### Key Entities *(include if feature involves data)*

- **Conference Schedule**: Editable plan of sessions, rooms, times, and paper assignments.
- **Schedule Edit Session**: Temporary working state of editor changes before save/cancel.
- **Conflict Validation Result**: Outcome of schedule rule checks during save attempt.
- **Schedule Version State**: Persisted schedule content after successful save.
- **Last Edited Timestamp**: Date-time marker of most recent successful schedule update.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid schedule edits (including published schedules) are persisted successfully and reflected in subsequent views.
- **SC-002**: 100% of invalid/conflicting edit saves are rejected with actionable feedback and no persisted change.
- **SC-003**: 100% of successful saves update and display a last-edited date/time.
- **SC-004**: 100% of canceled edit sessions result in no persisted changes.
- **SC-005**: 100% of database save failures preserve prior schedule state and show explicit system-error feedback.
