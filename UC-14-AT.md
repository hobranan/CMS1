# Acceptance Test Suite — UC-14 Accept or Reject a Paper

## Assumptions / Notes
- Editors must be logged in and authorized to manage the paper.
- Decisions can only be made once per paper (unless explicitly changed).
- Completed reviews are normally required before a decision.

---

## AT-UC14-01 — Accept Paper Successfully (Main Success Scenario)

**Objective:** Verify an editor can accept a paper and notify authors.

**Preconditions:**
- Editor is logged in.
- Paper P1 exists with at least one completed review.
- Decision period is open.

**Steps:**
1. Navigate to Paper P1.
2. Select **Accept**.
3. Optionally enter a decision comment.
4. Confirm the decision.

**Expected Results:**
- Paper status is updated to **Accepted**.
- Decision is stored.
- Authors are notified.
- Confirmation message is displayed to the editor.

---

## AT-UC14-02 — Reject Paper Successfully (Main Success Scenario)

**Objective:** Verify an editor can reject a paper and notify authors.

**Preconditions:**
- Editor is logged in.
- Paper P2 exists with at least one completed review.
- Decision period is open.

**Steps:**
1. Navigate to Paper P2.
2. Select **Reject**.
3. Optionally enter a decision comment.
4. Confirm the decision.

**Expected Results:**
- Paper status is updated to **Rejected**.
- Decision is stored.
- Authors are notified.
- Confirmation message is displayed.

---

## AT-UC14-03 — Block Decision When No Reviews Completed (Extension 3a)

**Objective:** Verify decision is blocked when no completed reviews exist.

**Preconditions:**
- Editor is logged in.
- Paper P3 exists with zero completed reviews.

**Steps:**
1. Attempt to accept or reject Paper P3.

**Expected Results:**
- The system blocks the decision.
- A warning indicates reviews are missing.
- Paper status remains unchanged.

---

## AT-UC14-04 — Cancel Decision Before Confirmation (Extension 4a)

**Objective:** Verify canceling a decision does not update paper status.

**Preconditions:**
- Editor is logged in.
- Paper P4 exists and is undecided.

**Steps:**
1. Select **Accept** or **Reject** for Paper P4.
2. Cancel before confirming.

**Expected Results:**
- No decision is stored.
- Paper status remains unchanged.

---

## AT-UC14-05 — Decision Not Allowed (Extension 7a)

**Objective:** Verify system blocks decisions that are not allowed.

**Preconditions:**
- Editor is logged in.
- Paper P5 is already accepted/rejected or decision period closed.

**Steps:**
1. Attempt to make a decision on Paper P5.

**Expected Results:**
- The system blocks the decision.
- An explanatory message is displayed.
- Paper status remains unchanged.

---

## AT-UC14-06 — Database Error During Decision Save (Extension 8a)

**Objective:** Verify system behavior when saving the decision fails.

**Preconditions:**
- Editor is logged in.
- Paper P6 exists and decision is allowed.
- Ability to simulate database failure.

**Steps:**
1. Attempt to accept or reject Paper P6 while database save fails.

**Expected Results:**
- Paper status is not updated.
- Decision is not stored.
- A system error message is displayed.

---

## AT-UC14-07 — Notification Failure After Decision Saved (Extension 9a)

**Objective:** Verify decision remains stored even if notifications fail.

**Preconditions:**
- Editor is logged in.
- Paper P7 exists and decision is allowed.
- Ability to simulate notification service failure.

**Steps:**
1. Accept or reject Paper P7 while notification service fails.

**Expected Results:**
- Decision is stored and paper status updated.
- The editor is informed notifications could not be sent.
- Authors can still see the decision in the system once available.

---

## AT-UC14-08 — Persistence Check: Decision Persists After Refresh

**Objective:** Verify recorded decision persists across refresh/login.

**Preconditions:**
- A paper has been accepted or rejected successfully.

**Steps:**
1. Refresh the page or log out and log back in.
2. Navigate back to the paper details.

**Expected Results:**
- The paper status reflects the recorded decision.
- The decision details are still visible.
