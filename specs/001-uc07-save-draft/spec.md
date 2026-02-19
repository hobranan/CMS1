# Feature Specification: Save submission draft

**Feature Branch**: `001-uc07-save-draft`  
**Created**: 2026-02-08  
**Status**: Draft  
**Input**: User description: "UC-07.md contains the use case flows (the Main Success Scenario and all Extensions). Extract the functional requirements from these flows. The UC-07-AT.md contains the acceptance tests for the UC-07.md file, you can additionally use this in helping to determine the those requirements. Also, I need a new branch made for this use case. For preemptive clarifications, this UC-07.md has Open Issues where I want you to just save current entry data in the editable spots but not allow final submission until spots validated, and there will not be an autosave."  
**Use Case Sources**: `UC-07.md`, `UC-07-AT.md`

## Clarifications

### Session 2026-02-08

- Q: How should save behavior work for editable fields and final submission? -> A: Manual save stores current entered values in editable fields as draft data, but final submission remains blocked until required fields pass final validation.
- Q: Is autosave supported? -> A: No autosave is supported; only explicit user-initiated save actions persist draft changes.

### Session 2026-02-10

- Q: What happens when user clicks Submit while unsaved edits exist? -> A: Submit first performs the same persistence action as Save for current edits, then runs final submission validation. If final validation fails, submission is blocked, but the just-edited data remains saved as draft.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Manually save draft progress (Priority: P1)

An authenticated author saves partially completed submission data so work is preserved and can be resumed later.

**Why this priority**: Preserving draft progress is the core value of this use case and prevents data re-entry.

**Independent Test**: Can be tested by entering partial data, using Save, and verifying the same draft state is available after returning later.

**Acceptance Scenarios**:

1. **Given** an authenticated author is editing a submission draft, **When** they select Save, **Then** the system stores current entered values as draft data and confirms save success.
2. **Given** a draft was saved, **When** the author logs out and later logs back in, **Then** the draft is available and matches the last saved state.

---

### User Story 2 - Handle no-change and invalid-save conditions (Priority: P2)

An author receives clear feedback when save is unnecessary or blocked by save-level invalid values.

**Why this priority**: Clear save feedback helps users understand draft state and required corrections.

**Independent Test**: Can be tested by saving without changes and by entering invalid save-blocking values, then verifying expected messages and no unintended draft update.

**Acceptance Scenarios**:

1. **Given** no fields changed since last save, **When** the author selects Save, **Then** the system reports no new changes and leaves the existing draft unchanged.
2. **Given** entered data contains values that fail save-level validation, **When** the author selects Save, **Then** the system rejects save, identifies fields to correct, and does not update the draft.

---

### User Story 3 - Recover from save failures and continue editing (Priority: P3)

An author can continue editing after saves, and is informed when save fails due to storage or network issues.

**Why this priority**: Reliability and continuity during drafting are critical for author productivity.

**Independent Test**: Can be tested by simulating storage/network failures during save and by editing additional fields after a successful save.

**Acceptance Scenarios**:

1. **Given** storage is unavailable during save, **When** the author selects Save, **Then** the system reports system failure, advises retry later, and does not update draft state.
2. **Given** network interruption occurs during save, **When** the author selects Save, **Then** the system reports connectivity failure, prompts retry, and does not update draft state.
3. **Given** a save succeeds, **When** the author continues editing without saving again, **Then** subsequent edits remain unsaved until the next explicit Save action.
4. **Given** unsaved edits exist and user selects Submit, **When** submit action runs, **Then** current edits are first saved as draft and final submission validation runs next; if validation fails, final submission is blocked while saved edits remain persisted.

---

### Edge Cases

- Author clicks Save repeatedly with no changes.
- Save is attempted with partially valid but save-blocking field values.
- Network interruption occurs after save request starts but before acknowledgment.
- Storage error occurs after validation passes.
- Author exits immediately after Save and returns later.
- Author edits fields after saving and expects those edits to persist without another Save.
- Author clicks Submit with unsaved edits and final validation fails.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide manual Save for authenticated authors working on non-finalized submissions.
- **FR-002**: System MUST store current entered values in editable fields as draft state when Save succeeds.
- **FR-003**: System MUST perform save-level validation checks required for storing draft data.
- **FR-004**: System MUST reject save requests when save-level invalid values are present and identify fields requiring correction.
- **FR-005**: System MUST detect when no changes have been made since last save and inform the author without modifying stored draft data.
- **FR-006**: System MUST persist saved drafts so they remain available across sessions and logins.
- **FR-007**: System MUST allow authors to continue editing after a successful save.
- **FR-008**: System MUST keep post-save edits unsaved until the next explicit Save action.
- **FR-009**: System MUST handle storage failures during save by showing retry-later guidance and leaving draft data unchanged from the last successful save.
- **FR-010**: System MUST handle network interruption during save by showing connectivity-failure guidance and leaving draft data unchanged from the last successful save.
- **FR-011**: System MUST support only explicit user-initiated save and MUST NOT perform autosave.
- **FR-012**: System MUST block final submission until required submission fields pass final submission validation.
- **FR-013**: System MUST allow draft save of editable data even when the draft is not yet ready for final submission.
- **FR-014**: System MUST make Submit action persist current unsaved editable changes using the same save behavior before running final submission validation.
- **FR-015**: If final submission validation fails after submit-triggered save, System MUST keep the newly saved draft state and return validation errors without finalizing submission.

### Assumptions

- Save-level validation is lighter than final-submission validation.
- Draft data includes only fields currently editable by the author.
- Last successful save is the authoritative persisted draft state.
- Final submission validation rules are defined in the submission/finalization use case.
- Submit-triggered pre-validation save follows the same persistence and failure rules as explicit Save.

### Key Entities *(include if feature involves data)*

- **Submission Draft**: The persisted working copy of a paper submission before final submission.
- **Draft Field State**: Current values entered in editable draft fields at save time.
- **Save Attempt**: A user-initiated request to persist draft state with outcome (saved, no changes, validation failure, system failure).
- **Draft Validation Result**: Field-level result used to determine whether save is allowed.
- **Final Submission Eligibility**: State indicating whether final submission is permitted after full validation.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of successful manual save actions persist the current editable draft state and return confirmation.
- **SC-002**: 100% of save attempts with no changes return a no-change message and do not alter the stored draft.
- **SC-003**: 100% of save attempts failing save-level validation, storage, or network checks do not modify the last saved draft state.
- **SC-004**: 100% of drafts saved successfully remain retrievable after logout/login with content matching the last successful save.
- **SC-005**: 100% of final submission attempts are blocked until full final validation requirements are met.
- **SC-006**: 100% of submit attempts with unsaved edits persist those edits before final-validation checks execute.
