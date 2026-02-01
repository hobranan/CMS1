# Acceptance Test Suite — UC-15 Receive Final Decision

## Assumptions / Notes
- Authors must be logged in to view decisions in the CMS.
- A decision becomes visible once it is recorded by the editor.
- Notifications are best-effort; the CMS UI is the source of truth.

---

## AT-UC15-01 — View Accepted Decision Successfully (Main Success Scenario)

**Objective:** Verify an author can view an accepted decision.

**Preconditions:**
- Author is logged in.
- Paper P1 was accepted by an editor.

**Steps:**
1. Navigate to submitted papers.
2. Select Paper P1.

**Expected Results:**
- The system displays **Accepted** status.
- Any decision comments are visible.

---

## AT-UC15-02 — View Rejected Decision Successfully (Main Success Scenario)

**Objective:** Verify an author can view a rejected decision.

**Preconditions:**
- Author is logged in.
- Paper P2 was rejected by an editor.

**Steps:**
1. Navigate to submitted papers.
2. Select Paper P2.

**Expected Results:**
- The system displays **Rejected** status.
- Any decision comments are visible.

---

## AT-UC15-03 — Notification Failure Does Not Block Access (Extension 4a)

**Objective:** Verify decision is visible even if notification fails.

**Preconditions:**
- Author is logged in.
- Paper P3 has a recorded decision.
- Notification service failed.

**Steps:**
1. Navigate to submitted papers.
2. Select Paper P3.

**Expected Results:**
- The final decision is visible in the CMS.
- Lack of notification does not affect access.

---

## AT-UC15-04 — Decision Not Yet Available (Extension 5a)

**Objective:** Verify correct behavior when decision is not yet made.

**Preconditions:**
- Author is logged in.
- Paper P4 is still under review.

**Steps:**
1. Navigate to submitted papers.
2. Select Paper P4.

**Expected Results:**
- The system indicates the paper is under review.
- No accept/reject decision is shown.

---

## AT-UC15-05 — Unauthorized Paper Access Blocked (Extension 6a)

**Objective:** Verify authors cannot view decisions for papers they do not own.

**Preconditions:**
- Author A is logged in.
- Paper P5 belongs to Author B.

**Steps:**
1. Attempt to access Paper P5 decision details.

**Expected Results:**
- Access is blocked.
- An authorization error message is displayed.

---

## AT-UC15-06 — Decision Retrieval Failure (Extension 7a)

**Objective:** Verify system behavior when decision cannot be retrieved.

**Preconditions:**
- Author is logged in.
- Paper P6 has a recorded decision.
- Simulate database/service failure.

**Steps:**
1. Attempt to view Paper P6 decision.

**Expected Results:**
- The system displays a system error message.
- The decision is not shown.

---

## AT-UC15-07 — Persistence Check: Decision Visible After Logout/Login

**Objective:** Verify decision persists across sessions.

**Preconditions:**
- Author has a paper with a recorded decision.

**Steps:**
1. Log out of the CMS.
2. Log back in.
3. Navigate to the paper decision.

**Expected Results:**
- The final decision is still visible and unchanged.
