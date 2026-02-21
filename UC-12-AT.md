# Acceptance Test Suite - UC-12 Submit completed review

## Assumptions / Notes
- Referees must be authenticated and tied to the assignment.
- Submission requires active assignment and valid required fields.
- Displayed deadlines are informational only.
- Submitted reviews are immutable; newer updates are new linked submissions.

---

## AT-UC12-01 - Submit Completed Review Successfully

**Objective:** Verify valid review submission succeeds and marks assignment completed.

**Preconditions:**
- Referee is logged in.
- Assignment is active.
- Required review fields are complete.

**Steps:**
1. Open review form.
2. Fill required fields and recommendation.
3. Submit review.

**Expected Results:**
- Review is stored as submitted.
- Assignment status becomes completed.
- Confirmation is returned.

---

## AT-UC12-02 - Validation Failure on Incomplete Review

**Objective:** Verify incomplete/invalid review submission is blocked with field feedback.

**Preconditions:**
- Referee is logged in.
- Assignment is active.

**Steps:**
1. Leave required fields blank.
2. Submit review.

**Expected Results:**
- Submission is blocked (`400`).
- Field-level errors are returned.
- Review remains unsubmitted.

---

## AT-UC12-03 - Cancel Before Confirm

**Objective:** Verify cancellation before final confirmation causes no mutation.

**Preconditions:**
- Referee is logged in.
- Assignment is active.

**Steps:**
1. Start submit action with `confirm_submit=false`.

**Expected Results:**
- Response returns cancelled/no mutation.
- Review remains draft/unsubmitted.

---

## AT-UC12-04 - Inactive Assignment Rejection

**Objective:** Verify submission is blocked when assignment is inactive.

**Preconditions:**
- Referee is logged in.
- Assignment is not active.

**Steps:**
1. Attempt to submit valid review.

**Expected Results:**
- Submission is blocked (`403`).
- Review remains unsubmitted.

---

## AT-UC12-05 - Deadline Informational Only

**Objective:** Verify passed deadline indicator does not block active assignment submission.

**Preconditions:**
- Referee is logged in.
- Assignment is active.
- Deadline indicator is in the past.

**Steps:**
1. Submit valid review.

**Expected Results:**
- Submission succeeds.
- No deadline-based rejection occurs.

---

## AT-UC12-06 - Database Failure Integrity

**Objective:** Verify database save failure leaves review unsubmitted.

**Preconditions:**
- Referee is logged in.
- Assignment is active.
- Simulate persistence failure.

**Steps:**
1. Submit valid review.

**Expected Results:**
- `500` persistence failure response.
- No submitted review record is created.
- Assignment status does not transition to completed.

---

## AT-UC12-07 - Notification Failure Post-Commit

**Objective:** Verify notification failure does not roll back committed submission.

**Preconditions:**
- Referee is logged in.
- Assignment is active.
- Simulate notification send failure.

**Steps:**
1. Submit valid review.

**Expected Results:**
- Submission remains committed.
- Notification status is `failed`.
- Referee receives notification-failure feedback.

---

## AT-UC12-08 - Read-Only Submitted Review

**Objective:** Verify submitted review can be reopened only in read-only mode.

**Preconditions:**
- Submitted review exists.

**Steps:**
1. Open submitted review by review id.

**Expected Results:**
- Review content is returned with `readOnly=true`.
- Direct edit path is not available.

---

## AT-UC12-09 - Newer Version Linking

**Objective:** Verify newer submitted review versions link to latest prior review.

**Preconditions:**
- At least one submitted review exists for assignment.
- Assignment reopened as active for new version submission flow.

**Steps:**
1. Submit first version.
2. Submit second version.

**Expected Results:**
- Second submission has incremented version number.
- `previousReviewId` points to prior latest submission.
- Version-chain ordering is preserved.

---

## AT-UC12-10 - Editor Visibility

**Objective:** Verify submitted review is visible to authorized editor.

**Preconditions:**
- Submitted review exists.
- Editor is authorized for the assignment.

**Steps:**
1. Open submitted review as editor.

**Expected Results:**
- Editor can access submitted review content.
