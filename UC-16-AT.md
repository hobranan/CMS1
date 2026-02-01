# Acceptance Test Suite — UC-16 Generate Conference Schedule

## Assumptions / Notes
- Only administrators/editors can generate schedules.
- A schedule is based only on accepted papers.
- Publishing makes the schedule visible to relevant users.

---

## AT-UC16-01 — Generate and Publish Schedule Successfully (Main Success Scenario)

**Objective:** Verify an administrator/editor can generate and publish a conference schedule.

**Preconditions:**
- Administrator/editor is logged in.
- At least one paper is accepted.
- Conference parameters are fully defined.

**Steps:**
1. Navigate to the scheduling section.
2. Select **Generate Schedule**.
3. Review the generated schedule.
4. Confirm and publish the schedule.

**Expected Results:**
- A schedule is generated without conflicts.
- The schedule is stored in the database.
- The schedule is marked as published and visible.

---

## AT-UC16-02 — No Accepted Papers (Extension 3a)

**Objective:** Verify schedule generation is blocked when no papers are accepted.

**Preconditions:**
- Administrator/editor is logged in.
- No papers are accepted.

**Steps:**
1. Attempt to generate a schedule.

**Expected Results:**
- The system displays a message indicating no accepted papers.
- No schedule is generated.

---

## AT-UC16-03 — Missing Conference Parameters (Extension 3b)

**Objective:** Verify schedule generation is blocked when configuration is incomplete.

**Preconditions:**
- Administrator/editor is logged in.
- One or more required conference parameters are missing.

**Steps:**
1. Attempt to generate a schedule.

**Expected Results:**
- The system blocks generation.
- A message prompts completion of missing configuration.

---

## AT-UC16-04 — Scheduling Conflicts Detected (Extension 4a)

**Objective:** Verify conflicts are detected and reported.

**Preconditions:**
- Administrator/editor is logged in.
- Accepted papers and parameters exist that cause conflicts.

**Steps:**
1. Generate schedule.

**Expected Results:**
- The system identifies conflicts.
- Conflicts are displayed clearly.
- Schedule is not finalized until resolved.

---

## AT-UC16-05 — Database Error During Save (Extension 6a)

**Objective:** Verify system behavior when schedule cannot be saved.

**Preconditions:**
- Administrator/editor is logged in.
- Ability to simulate database failure.

**Steps:**
1. Generate schedule while database save fails.

**Expected Results:**
- The schedule is not stored.
- A system error message is displayed.

---

## AT-UC16-06 — Cancel Before Publishing (Extension 8a)

**Objective:** Verify canceling publication keeps schedule in draft state.

**Preconditions:**
- Administrator/editor is logged in.
- A schedule has been generated.

**Steps:**
1. Generate schedule.
2. Cancel before publishing.

**Expected Results:**
- The schedule remains in draft state.
- The schedule is not visible to other users.

---

## AT-UC16-07 — Persistence Check: Published Schedule Persists

**Objective:** Verify published schedules persist across sessions.

**Preconditions:**
- A schedule has been generated and published.

**Steps:**
1. Log out and log back in.
2. View the conference schedule.

**Expected Results:**
- The published schedule is still visible and unchanged.
