# Acceptance Test Suite — UC-17 Edit Generated Conference Schedule

## Assumptions / Notes
- Only editors (or administrators) can edit schedules.
- The system validates edits against scheduling constraints (e.g., no room/time overlaps).
- Editing may be blocked if the schedule is locked.

---

## AT-UC17-01 — Edit and Save Schedule Successfully (Main Success Scenario)

**Objective:** Verify an editor can edit a generated schedule and save changes successfully.

**Preconditions:**
- Editor is logged in.
- A schedule exists and is editable (not locked).

**Steps:**
1. Navigate to scheduling section.
2. Open schedule in edit mode.
3. Modify a session assignment (e.g., move a paper to a different session/time/room).
4. Save changes.

**Expected Results:**
- The system validates the updated schedule.
- Changes are saved to the database.
- Confirmation is displayed.
- Conflict indicators update accordingly.

---

## AT-UC17-02 — No Conflicts Exist (Extension 3a)

**Objective:** Verify editor can still edit schedule even when no conflicts exist.

**Preconditions:**
- Editor is logged in.
- Schedule exists with no conflicts.

**Steps:**
1. Open schedule in edit mode.
2. Make a non-conflict change (e.g., reorder papers within a session).
3. Save changes.

**Expected Results:**
- The system allows the edit.
- Schedule is saved.
- Schedule remains conflict-free.

---

## AT-UC17-03 — Reject Save When New Conflict Introduced (Extension 5a)

**Objective:** Verify system rejects edits that introduce new conflicts.

**Preconditions:**
- Editor is logged in.
- Schedule is editable.

**Steps:**
1. Open schedule in edit mode.
2. Create an overlap (e.g., assign two sessions to same room/time).
3. Attempt to save.

**Expected Results:**
- The system rejects the save.
- Validation errors explain the conflict.
- The schedule remains unchanged from last saved version.

---

## AT-UC17-04 — Invalid Edit Attempt Blocked (Extension 5b)

**Objective:** Verify system blocks invalid edits such as invalid time slots or session IDs.

**Preconditions:**
- Editor is logged in.
- Schedule is editable.

**Steps:**
1. Open schedule in edit mode.
2. Attempt to assign a paper to a non-existent session or invalid time slot.
3. Attempt to save (if not blocked immediately).

**Expected Results:**
- The system prevents the invalid edit or rejects the save.
- An error message explains why the edit is invalid.
- The schedule is not updated.

---

## AT-UC17-05 — Cancel Editing Discards Changes (Extension 6a)

**Objective:** Verify canceling edit mode discards unsaved changes.

**Preconditions:**
- Editor is logged in.
- Schedule is editable.

**Steps:**
1. Open schedule in edit mode.
2. Make one or more changes.
3. Cancel/exit without saving.

**Expected Results:**
- Unsaved changes are discarded.
- Schedule remains unchanged.

---

## AT-UC17-06 — Database Error During Save (Extension 8a)

**Objective:** Verify system behavior when saving changes fails due to database error.

**Preconditions:**
- Editor is logged in.
- Ability to simulate database failure.

**Steps:**
1. Open schedule in edit mode.
2. Make valid changes.
3. Save while database write fails.

**Expected Results:**
- The system displays a system error message.
- Changes are not persisted.

---

## AT-UC17-07 — Schedule Locked Prevents Editing (Extension 2a)

**Objective:** Verify editor cannot edit a locked schedule.

**Preconditions:**
- Editor is logged in.
- Schedule is locked (e.g., published and locked by policy).

**Steps:**
1. Attempt to open the schedule in edit mode.

**Expected Results:**
- The system blocks editing.
- A message indicates the schedule is locked.
- No changes can be made.

---

## AT-UC17-08 — Persistence Check: Saved Edits Persist After Refresh

**Objective:** Verify saved schedule edits persist across refresh/login.

**Preconditions:**
- AT-UC17-01 completed successfully.

**Steps:**
1. Refresh the page or log out/log in.
2. View the schedule.

**Expected Results:**
- The edited schedule reflects the saved changes.
