# Acceptance Test Suite - UC-13 View completed reviews for a paper

## Assumptions / Notes
- Editors must be logged in to view reviews.
- “Completed reviews” are those marked as submitted.
- Editors can view reviews only for papers they are authorized to manage.

---

## AT-UC13-01 — View List of Completed Reviews (Main Success Scenario)

**Objective:** Verify an editor can view the list of submitted (completed) reviews for a paper.

**Preconditions:**
- Editor is logged in.
- Paper P1 exists.
- Paper P1 has at least one submitted review.

**Steps:**
1. Navigate to submitted papers list.
2. Select Paper P1.
3. Choose **View Reviews**.

**Expected Results:**
- The system displays a list of completed/submitted reviews for Paper P1.
- Only submitted reviews appear in the completed reviews list.

---

## AT-UC13-02 — Open a Completed Review (Main Success Scenario)

**Objective:** Verify an editor can open and read a specific submitted review.

**Preconditions:**
- Editor is logged in.
- Paper P1 has at least one submitted review R1.

**Steps:**
1. Open Paper P1 reviews list.
2. Select review R1.

**Expected Results:**
- The system displays the full content of review R1.
- The editor can return to the list and open other reviews.

---

## AT-UC13-03 — No Completed Reviews Available (Extension 5a)

**Objective:** Verify system behavior when no reviews have been submitted yet.

**Preconditions:**
- Editor is logged in.
- Paper P2 exists with zero submitted reviews.

**Steps:**
1. Navigate to Paper P2.
2. Select **View Reviews**.

**Expected Results:**
- The system displays a message indicating no completed reviews are available.
- No review list is shown (or an empty list with explanation).

---

## AT-UC13-04 — Unauthorized Paper Access Blocked (Extension 2a)

**Objective:** Verify editor cannot access papers they are not authorized to manage.

**Preconditions:**
- Editor is logged in.
- Paper P3 exists but is not within editor’s authorized scope.

**Steps:**
1. Attempt to open Paper P3 (via direct URL or UI).

**Expected Results:**
- The system blocks access.
- An authorization error message is displayed.
- Reviews are not accessible.

---

## AT-UC13-05 — Only Completed Reviews Shown When Others Pending (Extension 5b)

**Objective:** Verify only submitted reviews are shown as completed when some are still pending.

**Preconditions:**
- Editor is logged in.
- Paper P4 has:
  - At least one submitted review
  - At least one draft/incomplete review (or missing review)

**Steps:**
1. Navigate to Paper P4.
2. Select **View Reviews**.

**Expected Results:**
- The system shows only submitted reviews in the completed list.
- The system may indicate some reviews are pending/incomplete.

---

## AT-UC13-06 — Review Retrieval Failure (Extension 5c)

**Objective:** Verify system behavior when the review list cannot be retrieved.

**Preconditions:**
- Editor is logged in.
- Ability to simulate database/service failure for review retrieval.

**Steps:**
1. Navigate to a paper with reviews.
2. Select **View Reviews** while retrieval fails.

**Expected Results:**
- The system displays a system error message.
- No review list is shown.

---

## AT-UC13-07 — Open Review Fails (Extension 8a)

**Objective:** Verify system behavior when a specific review cannot be opened.

**Preconditions:**
- Editor is logged in.
- Reviews list loads, but one review record is missing/unavailable (simulate retrieval error for R2).

**Steps:**
1. Open the reviews list for a paper.
2. Attempt to open review R2.

**Expected Results:**
- The system displays an error indicating the review cannot be displayed.
- The editor can return to the list and open other reviews.

---

## AT-UC13-08 — Persistence Check: Reviews Still Accessible After Refresh

**Objective:** Verify completed reviews remain accessible after refresh/navigation.

**Preconditions:**
- Editor is logged in.
- Paper has at least one completed review.

**Steps:**
1. Open the paper’s completed reviews list.
2. Refresh the page.
3. Open a completed review.

**Expected Results:**
- The completed reviews list is still available.
- The selected completed review opens successfully.
