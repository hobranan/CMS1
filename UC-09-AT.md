# Acceptance Test Suite — UC-09 Enforce Referee Workload Limits

## Assumptions / Notes
- Each referee has a maximum allowed number of assigned papers.
- Workload is checked at assignment time.
- Assignments exceeding the limit must be rejected.

---

## AT-UC09-01 — Assign Referee Within Workload Limit (Main Success Scenario)

**Objective:** Verify a referee can be assigned when workload is below the maximum.

**Preconditions:**
- Editor is logged in.
- Referee has fewer assigned papers than the maximum limit.

**Steps:**
1. Select a paper.
2. Select a referee with available workload.
3. Confirm assignment.

**Expected Results:**
- The system retrieves referee workload.
- The assignment is allowed and stored.
- No workload-related error is shown.

---

## AT-UC09-02 — Reject Assignment at Maximum Workload (Extension 5a)

**Objective:** Verify assignment is rejected when referee has reached workload limit.

**Preconditions:**
- Editor is logged in.
- Referee has already reached maximum allowed workload.

**Steps:**
1. Select a paper.
2. Select the overloaded referee.
3. Attempt to confirm assignment.

**Expected Results:**
- The system blocks the assignment.
- An error message indicates workload limit reached.
- No assignment is stored.

---

## AT-UC09-03 — Workload Retrieval Failure (Extension 3a)

**Objective:** Verify system behavior when workload data cannot be retrieved.

**Preconditions:**
- Editor is logged in.
- Simulate database/service failure for workload retrieval.

**Steps:**
1. Select a paper.
2. Select a referee.
3. Attempt assignment while workload data is unavailable.

**Expected Results:**
- The system rejects the assignment.
- A system error message is displayed.
- No assignment is stored.

---

## AT-UC09-04 — Assignment Storage Failure (Extension 6a)

**Objective:** Verify system behavior when assignment storage fails after workload validation.

**Preconditions:**
- Editor is logged in.
- Referee workload is within limits.
- Simulate database failure during assignment storage.

**Steps:**
1. Select a paper.
2. Select a referee within workload limits.
3. Confirm assignment.

**Expected Results:**
- The system does not store the assignment.
- A system error message is displayed.
- The referee is not assigned.

---

## AT-UC09-05 — Workload Count Updated After Assignment

**Objective:** Verify referee workload count increases after a successful assignment.

**Preconditions:**
- AT-UC09-01 completed successfully.

**Steps:**
1. View the referee’s workload after assignment.

**Expected Results:**
- The workload count reflects the newly assigned paper.
- The updated workload is used in subsequent assignment checks.
