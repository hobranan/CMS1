# Acceptance Test Suite — UC-12 Submit Completed Review

## Assumptions / Notes
- Referees must be logged in and have an active assignment.
- A review cannot be submitted unless required fields are completed.
- On successful submission, the review becomes read-only and visible to the editor.
- The system may enforce deadlines/assignment status rules if implemented.

---

## AT-UC12-01 — Submit Completed Review Successfully (Main Success Scenario)

**Objective:** Verify a referee can submit a completed review and it is stored as submitted.

**Preconditions:**
- Referee is logged in.
- Paper P1 is assigned to the referee and review form is available.
- Submission is allowed (assignment active, deadline not passed).

**Steps:**
1. Open **Assigned Papers**.
2. Select Paper P1 and open the review form.
3. Fill all required review fields with valid values.
4. Select **Submit Review** and confirm (if applicable).

**Expected Results:**
- The system validates required fields.
- The review is stored as submitted.
- The assignment/review status shows completed/submitted.
- A confirmation message is displayed to the referee.
- The review becomes read-only (cannot be edited after submission).

---

## AT-UC12-02 — Reject Submission When Required Fields Missing (Extension 3a)

**Objective:** Verify the system blocks submission if the review is incomplete.

**Preconditions:**
- Referee is logged in.
- Paper P2 assigned and review form available.

**Steps:**
1. Open the review form for Paper P2.
2. Leave at least one required field blank.
3. Select **Submit Review**.

**Expected Results:**
- The system blocks submission.
- Missing/invalid fields are highlighted and an error message is shown.
- Review remains in draft/unsubmitted state.

---

## AT-UC12-03 — Cancel Submission (Extension 4a)

**Objective:** Verify canceling submission does not submit the review.

**Preconditions:**
- Referee is logged in.
- Paper P3 assigned and review form available.

**Steps:**
1. Fill the review form for Paper P3 (can be complete or partial).
2. Select **Submit Review**.
3. Cancel the confirmation or navigate away before confirming.

**Expected Results:**
- No review is marked as submitted.
- Review remains draft/unsubmitted.
- Assignment status remains unchanged.

---

## AT-UC12-04 — Block Submission When Deadline Passed/Assignment Inactive (Extension 5a)

**Objective:** Verify submission is blocked when submission is not allowed.

**Preconditions:**
- Referee is logged in.
- Paper P4 assigned, but submission not allowed (simulate deadline passed or assignment inactive).

**Steps:**
1. Open the review form for Paper P4.
2. Fill required fields.
3. Attempt to submit the review.

**Expected Results:**
- The system blocks submission.
- A message indicates the review cannot be submitted.
- Review remains unsubmitted.

---

## AT-UC12-05 — Database Error During Save (Extension 6a)

**Objective:** Verify system behavior when saving a submitted review fails.

**Preconditions:**
- Referee is logged in.
- Paper P5 assigned and review form available.
- Ability to simulate database failure on submit.

**Steps:**
1. Fill required fields for Paper P5 review.
2. Submit the review while database update fails.

**Expected Results:**
- The system displays a system error message.
- Review is not marked as submitted.
- Assignment status is not updated to completed.

---

## AT-UC12-06 — Notification Failure After Submission (Extension 8a)

**Objective:** Verify submission succeeds even if notifications fail.

**Preconditions:**
- Referee is logged in.
- Paper P6 assigned and review form available.
- Ability to simulate notification service failure.

**Steps:**
1. Fill required fields for Paper P6 review.
2. Submit the review while notification service is failing.

**Expected Results:**
- Review is stored and marked as submitted.
- The system informs the referee that notifications could not be sent.
- The review remains submitted and visible in the system.

---

## AT-UC12-07 — Editor Can View Submitted Review (Visibility Check)

**Objective:** Verify the submitted review is accessible to the editor.

**Preconditions:**
- AT-UC12-01 completed successfully for Paper P1.
- Editor account exists with permissions to view reviews for Paper P1.

**Steps:**
1. Log in as editor (or use editor view).
2. Navigate to Paper P1 reviews.
3. Open the submitted review.

**Expected Results:**
- The submitted review is visible to the editor.
- The review content matches what the referee submitted.

---

## AT-UC12-08 — Persistence Check: Submitted State Persists After Refresh/Logout

**Objective:** Verify submitted reviews remain submitted after session changes.

**Preconditions:**
- Referee has submitted a review successfully.

**Steps:**
1. Refresh the page or log out and log back in.
2. Navigate back to the paper’s review form.

**Expected Results:**
- The review remains marked as submitted.
- The form is read-only (cannot be edited).
