# Acceptance Test Suite — UC-08 Assign Referees to Paper

## Assumptions / Notes
- Editors may assign at most three referees per paper.
- Each referee has a maximum allowed workload.
- Successful assignment triggers review invitations.

---

## AT-UC08-01 — Successful Referee Assignment

**Objective:** Verify an editor can assign up to three referees to a paper successfully.

**Preconditions:**
- Editor is logged in.
- Paper exists and requires referee assignment.
- At least three eligible referees are available with workload capacity.

**Steps:**
1. Navigate to submitted papers.
2. Select a paper.
3. Select three eligible referees.
4. Confirm assignment.

**Expected Results:**
- The system validates referee limits and workload.
- Assignments are stored.
- Review invitations are sent.
- Confirmation message is displayed.

---

## AT-UC08-02 — More Than Three Referees Selected (Extension 4a)

**Objective:** Verify the system rejects assignments with more than three referees.

**Preconditions:**
- Editor is logged in.

**Steps:**
1. Select a paper.
2. Select four referees.
3. Attempt to confirm assignment.

**Expected Results:**
- The system rejects the assignment.
- An error message indicates a maximum of three referees.
- No assignments are saved.

---

## AT-UC08-03 — Referee Workload Exceeded (Extension 6a)

**Objective:** Verify referees exceeding workload limits cannot be assigned.

**Preconditions:**
- Editor is logged in.
- One referee has exceeded workload limit.

**Steps:**
1. Select a paper.
2. Select a referee with exceeded workload.
3. Attempt to confirm assignment.

**Expected Results:**
- The system rejects that referee selection.
- An error message indicates workload violation.
- The editor can select another referee.

---

## AT-UC08-04 — Ineligible Referee Selected (Extension 4b)

**Objective:** Verify ineligible referees cannot be assigned.

**Preconditions:**
- Editor is logged in.

**Steps:**
1. Select a paper.
2. Select an ineligible referee.
3. Attempt to confirm assignment.

**Expected Results:**
- The system rejects the assignment.
- An error message indicates referee is not eligible.
- No assignments are saved.

---

## AT-UC08-05 — Assignment Storage Failure (Extension 8a)

**Objective:** Verify system behavior when assignment storage fails.

**Preconditions:**
- Editor is logged in.
- Ability to simulate database failure.

**Steps:**
1. Select valid referees for a paper.
2. Confirm assignment while database is unavailable.

**Expected Results:**
- Assignments are not saved.
- A system error message is displayed.

---

## AT-UC08-06 — Notification Failure After Assignment (Extension 9a)

**Objective:** Verify system behavior when invitation notifications fail.

**Preconditions:**
- Editor is logged in.
- Ability to simulate notification service failure.

**Steps:**
1. Assign valid referees to a paper.
2. Confirm assignment while notification service fails.

**Expected Results:**
- Assignments are stored (or rolled back consistently).
- The editor is informed that invitations could not be sent.
- The editor can retry notifications later.
