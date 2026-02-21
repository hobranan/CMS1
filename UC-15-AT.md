# Acceptance Test Suite - UC-15 Receive Final Decision Notification

## Assumptions / Notes
- Authors must be logged in to view decisions in CMS.
- A decision is visible once recorded by an editor.
- Notifications are best-effort; CMS is the decision source of truth.

---

## AT-UC15-01 - View Accepted Decision

**Objective:** Verify an author can view an accepted decision.

**Preconditions:**
- Author is logged in.
- Paper P1 was accepted by an editor.

**Steps:**
1. Open submitted papers.
2. Select Paper P1.

**Expected Results:**
- System shows **Accepted** status.
- Any decision comment is visible.

---

## AT-UC15-02 - View Rejected Decision

**Objective:** Verify an author can view a rejected decision.

**Preconditions:**
- Author is logged in.
- Paper P2 was rejected by an editor.

**Steps:**
1. Open submitted papers.
2. Select Paper P2.

**Expected Results:**
- System shows **Rejected** status.
- Any decision comment is visible.

---

## AT-UC15-03 - Notification Failure Does Not Block CMS Access

**Objective:** Verify decision remains visible in CMS when notification delivery fails.

**Preconditions:**
- Author is logged in.
- Paper P3 has a recorded decision.
- Notification delivery failed.

**Steps:**
1. Open submitted papers.
2. Select Paper P3.

**Expected Results:**
- Final decision is visible in CMS.
- Notification failure does not block decision visibility.

---

## AT-UC15-04 - Decision Not Yet Available

**Objective:** Verify behavior when no final decision is recorded.

**Preconditions:**
- Author is logged in.
- Paper P4 is still under review.

**Steps:**
1. Open submitted papers.
2. Select Paper P4.

**Expected Results:**
- System shows under-review status.
- No accepted/rejected decision is shown.

---

## AT-UC15-05 - Unauthorized Paper Access Blocked

**Objective:** Verify authors cannot view decisions for papers they do not own.

**Preconditions:**
- Author A is logged in.
- Paper P5 belongs to Author B.

**Steps:**
1. Attempt to open Paper P5 decision details.

**Expected Results:**
- Access is blocked.
- Authorization error is shown.

---

## AT-UC15-06 - Decision Retrieval Failure

**Objective:** Verify system behavior when decision retrieval fails.

**Preconditions:**
- Author is logged in.
- Paper P6 has a recorded decision.
- Decision retrieval is failing (service/database error).

**Steps:**
1. Attempt to view Paper P6 decision details.

**Expected Results:**
- System shows retry-later system error.
- Decision details are withheld.

---

## AT-UC15-07 - Decision Persistence Across Sessions

**Objective:** Verify recorded decision visibility persists after logout/login.

**Preconditions:**
- Author has a paper with a recorded decision.

**Steps:**
1. Log out.
2. Log back in.
3. Open the same paper decision page.

**Expected Results:**
- Final decision remains visible and unchanged.

---

## AT-UC15-08 - Notification Structure and Source Consistency

**Objective:** Verify notification content ordering and same-source consistency.

**Preconditions:**
- Author is logged in.
- Paper P7 has a recorded final decision with editor review content.

**Steps:**
1. Open Paper P7 decision notification details.

**Expected Results:**
- Important summary bullet notes appear first.
- Full review content appears below summary bullets.
- Summary and full review are derived from the same decision source.
