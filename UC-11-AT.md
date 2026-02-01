# Acceptance Test Suite — UC-11 Access Assigned Papers and Review Forms

## Assumptions / Notes
- Referees must be logged in to access assigned papers.
- Referees can only access papers assigned to them.
- Each assigned paper has an associated manuscript file and review form.

---

## AT-UC11-01 — View Assigned Papers List (Main Success Scenario)

**Objective:** Verify a referee can view their assigned papers list.

**Preconditions:**
- Referee is logged in.
- At least one paper is assigned to the referee.

**Steps:**
1. Navigate to **Assigned Papers**.

**Expected Results:**
- The system retrieves and displays the list of assigned papers for the referee.

---

## AT-UC11-02 — Open Manuscript for Assigned Paper (Main Success Scenario)

**Objective:** Verify a referee can access the manuscript for an assigned paper.

**Preconditions:**
- Referee is logged in.
- Paper P1 is assigned to the referee and has a manuscript stored.

**Steps:**
1. Open **Assigned Papers**.
2. Select Paper P1.
3. Open/download the manuscript.

**Expected Results:**
- The system allows access to the manuscript.
- The manuscript opens/downloads successfully.

---

## AT-UC11-03 — Open Review Form for Assigned Paper (Main Success Scenario)

**Objective:** Verify a referee can access the review form for an assigned paper.

**Preconditions:**
- Referee is logged in.
- Paper P1 is assigned to the referee and has a review form available.

**Steps:**
1. Open **Assigned Papers**.
2. Select Paper P1.
3. Open the review form.

**Expected Results:**
- The system displays the review form for Paper P1.

---

## AT-UC11-04 — No Assigned Papers (Extension 1a)

**Objective:** Verify correct behavior when a referee has no assignments.

**Preconditions:**
- Referee is logged in.
- Referee has no assigned papers.

**Steps:**
1. Navigate to **Assigned Papers**.

**Expected Results:**
- The system displays a message indicating no assigned papers.
- No paper details/manuscript/review form access is available.

---

## AT-UC11-05 — Unauthorized Paper Access Blocked (Extension 3a)

**Objective:** Verify a referee cannot access a paper not assigned to them.

**Preconditions:**
- Referee is logged in.
- Paper P2 exists but is not assigned to the referee.

**Steps:**
1. Attempt to open Paper P2 details/manuscript via direct URL or UI path.

**Expected Results:**
- The system blocks access.
- An authorization error message is displayed.
- Manuscript and review form are not accessible.

---

## AT-UC11-06 — Manuscript Unavailable (Extension 5a)

**Objective:** Verify system behavior when an assigned manuscript cannot be retrieved.

**Preconditions:**
- Referee is logged in.
- Paper P3 is assigned but manuscript file is missing/unavailable (simulate storage error).

**Steps:**
1. Open **Assigned Papers**.
2. Select Paper P3.
3. Attempt to open the manuscript.

**Expected Results:**
- The system displays an error that the manuscript cannot be accessed.
- The referee remains on the paper detail page and can retry later.

---

## AT-UC11-07 — Review Form Unavailable (Extension 6a)

**Objective:** Verify system behavior when a review form cannot be retrieved.

**Preconditions:**
- Referee is logged in.
- Paper P4 is assigned but review form is unavailable (simulate not generated or DB error).

**Steps:**
1. Open **Assigned Papers**.
2. Select Paper P4.
3. Attempt to open the review form.

**Expected Results:**
- The system displays an error that the review form cannot be accessed.
- Manuscript access may still be available if storage is functioning.

---

## AT-UC11-08 — Assigned Papers List Retrieval Failure (Extension 2a)

**Objective:** Verify system behavior when the assigned papers list cannot be loaded.

**Preconditions:**
- Referee is logged in.
- Simulate database failure on list retrieval.

**Steps:**
1. Navigate to **Assigned Papers** while DB retrieval fails.

**Expected Results:**
- The system displays a system error message.
- No assigned paper list is shown.

---

## AT-UC11-09 — Persistence Check: Assigned Paper Still Accessible After Refresh

**Objective:** Verify assigned papers and access links persist across refresh.

**Preconditions:**
- Referee is logged in.
- At least one assigned paper exists.

**Steps:**
1. Open **Assigned Papers**.
2. Refresh the page.
3. Select an assigned paper and open the review form.

**Expected Results:**
- Assigned papers list remains available.
- Access to manuscript/review form still works for assigned papers.
