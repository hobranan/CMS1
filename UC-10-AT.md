# Acceptance Test Suite — UC-10 Respond to Review Invitation (Accept/Reject)

## Assumptions / Notes
- Referees must be logged in to respond to invitations.
- Invitations have a status (pending, accepted, rejected, expired/withdrawn).
- Responding updates invitation status and may create/activate an assignment on acceptance.
- Notifications are sent to the editor when possible.

---

## AT-UC10-01 — Accept Invitation Successfully (Main Success Scenario)

**Objective:** Verify a referee can accept a pending invitation and the assignment becomes active.

**Preconditions:**
- Referee is logged in.
- A pending invitation exists for Paper P1.

**Steps:**
1. Navigate to pending invitations.
2. Open the invitation for Paper P1.
3. Select **Accept**.
4. Confirm the action (if confirmation exists).

**Expected Results:**
- The system validates the invitation is pending.
- Invitation status is updated to **Accepted**.
- Paper P1 appears in the referee’s assigned papers list.
- The system displays confirmation to the referee.
- The editor is notified (if notifications are enabled).

---

## AT-UC10-02 — Reject Invitation Successfully (Main Success Scenario)

**Objective:** Verify a referee can reject a pending invitation and the assignment is not activated.

**Preconditions:**
- Referee is logged in.
- A pending invitation exists for Paper P2.

**Steps:**
1. Navigate to pending invitations.
2. Open the invitation for Paper P2.
3. Select **Reject**.
4. Confirm the action (if confirmation exists).

**Expected Results:**
- Invitation status is updated to **Rejected**.
- Paper P2 does not appear in the referee’s assigned papers list.
- The system displays confirmation to the referee.
- The editor is notified (if notifications are enabled).

---

## AT-UC10-03 — No Pending Invitations (Extension 1a)

**Objective:** Verify the system handles the case where there are no pending invitations.

**Preconditions:**
- Referee is logged in.
- Referee has zero pending invitations.

**Steps:**
1. Navigate to pending invitations.

**Expected Results:**
- The system displays a message indicating no pending invitations.
- No accept/reject actions are available.

---

## AT-UC10-04 — Invitation Not Pending (Extension 5a)

**Objective:** Verify the system blocks responses to non-pending invitations.

**Preconditions:**
- Referee is logged in.
- An invitation exists but is not pending (expired/withdrawn/already responded).

**Steps:**
1. Attempt to open the invitation and respond with **Accept** or **Reject**.

**Expected Results:**
- The system prevents the response.
- A message indicates the invitation cannot be responded to.
- Invitation status remains unchanged.

---

## AT-UC10-05 — Cancel Before Confirming (Extension 4a)

**Objective:** Verify no changes occur if the referee cancels before confirming.

**Preconditions:**
- Referee is logged in.
- A pending invitation exists.

**Steps:**
1. Open a pending invitation.
2. Start an accept/reject action but cancel (navigate away/close dialog).

**Expected Results:**
- No response is recorded.
- Invitation remains **Pending**.

---

## AT-UC10-06 — Database Error on Recording Response (Extension 6a)

**Objective:** Verify system behavior when response cannot be recorded due to database error.

**Preconditions:**
- Referee is logged in.
- Pending invitation exists.
- Ability to simulate database failure on update.

**Steps:**
1. Open a pending invitation.
2. Select **Accept** (or **Reject**).
3. Submit response while database update is failing.

**Expected Results:**
- The response is not recorded.
- Invitation remains **Pending**.
- The system displays a system error message advising retry later.

---

## AT-UC10-07 — Notification Failure After Response Recorded (Extension 8a)

**Objective:** Verify system behavior when notifications fail after recording a response.

**Preconditions:**
- Referee is logged in.
- Pending invitation exists.
- Ability to simulate notification service failure.

**Steps:**
1. Open a pending invitation.
2. Accept or reject the invitation while the notification service is failing.

**Expected Results:**
- Invitation status is updated appropriately (Accepted/Rejected).
- The system informs the referee that notifications could not be sent.
- The recorded response remains consistent (not lost).

---

## AT-UC10-08 — Persistence Check: Invitation Status Updates in List

**Objective:** Verify the invitation list reflects the updated status after responding.

**Preconditions:**
- AT-UC10-01 or AT-UC10-02 completed successfully.

**Steps:**
1. Return to the invitations list.
2. Refresh the page (or re-open invitations list).

**Expected Results:**
- The invitation no longer appears as pending.
- The invitation is shown as Accepted/Rejected (or moved to a history section).
