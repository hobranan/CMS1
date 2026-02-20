# Acceptance Test Suite - UC-10 Respond to Review Invitation (Accept/Reject)

## Assumptions / Notes
- Referees must be logged in to respond to invitations.
- Invitations have status values: pending, accepted, rejected, expired, withdrawn.
- Expiry is evaluated server-side in UTC:
  - `now_utc >= issued_at_utc + 14 days` means expired.
- Responding updates invitation status and may activate assignment on acceptance.
- Editor notification is attempted after response commit.

---

## AT-UC10-01 - Accept Invitation Successfully

**Objective:** Verify a referee can accept a pending invitation and assignment becomes active.

**Preconditions:**
- Referee is logged in.
- A pending invitation exists.

**Steps:**
1. Navigate to pending invitations.
2. Open an invitation.
3. Select **Accept**.
4. Confirm response.

**Expected Results:**
- Invitation status updates to **accepted**.
- Assignment becomes active for the invitation.
- Confirmation is shown.

---

## AT-UC10-02 - Reject Invitation Successfully

**Objective:** Verify a referee can reject a pending invitation and assignment remains inactive.

**Preconditions:**
- Referee is logged in.
- A pending invitation exists.

**Steps:**
1. Navigate to pending invitations.
2. Open an invitation.
3. Select **Reject**.
4. Confirm response.

**Expected Results:**
- Invitation status updates to **rejected**.
- Assignment is not activated.
- Confirmation is shown.

---

## AT-UC10-03 - No Pending Invitations

**Objective:** Verify the system handles no pending invitations.

**Preconditions:**
- Referee is logged in.
- Referee has no actionable pending invitations.

**Steps:**
1. Navigate to pending invitations.

**Expected Results:**
- System shows a no-pending message.
- No response actions are available.

---

## AT-UC10-04 - Non-Actionable Invitation Blocked

**Objective:** Verify responses to non-actionable invitations are blocked.

**Preconditions:**
- Referee is logged in.
- Invitation is withdrawn, expired, or already responded.

**Steps:**
1. Attempt accept or reject on the invitation.

**Expected Results:**
- System blocks the action.
- Invitation status remains unchanged.
- Blocked-action feedback is shown.

---

## AT-UC10-05 - Expiry Boundary Enforcement

**Objective:** Verify exact 14-day boundary is treated as expired.

**Preconditions:**
- Referee is logged in.
- Invitation issued exactly 14 days before current server UTC time.

**Steps:**
1. Attempt to respond to the invitation.

**Expected Results:**
- System blocks response as expired.
- Invitation status remains pending/unchanged.

---

## AT-UC10-06 - Cancel Before Confirm

**Objective:** Verify canceling before confirmation causes no mutation.

**Preconditions:**
- Referee is logged in.
- A pending invitation exists.

**Steps:**
1. Start accept/reject action.
2. Cancel before confirmation.

**Expected Results:**
- No response is recorded.
- Invitation remains pending.

---

## AT-UC10-07 - Database Failure on Response Commit

**Objective:** Verify persistence failure leaves invitation unchanged.

**Preconditions:**
- Referee is logged in.
- Pending invitation exists.
- Persistence failure is simulated.

**Steps:**
1. Submit accept/reject response.

**Expected Results:**
- System returns persistence/system error.
- Invitation remains pending.
- No response record is committed.

---

## AT-UC10-08 - Notification Failure After Commit

**Objective:** Verify notification failure does not roll back committed response.

**Preconditions:**
- Referee is logged in.
- Pending invitation exists.
- Notification failure is simulated.

**Steps:**
1. Submit accept/reject response.

**Expected Results:**
- Response remains committed (accepted/rejected).
- System returns notification failure feedback.
- Notification status reports failure.

---

## AT-UC10-09 - Multi-Session Stale Conflict

**Objective:** Verify stale concurrent response attempts get canonical conflict message.

**Preconditions:**
- Same invitation is open in multiple sessions.

**Steps:**
1. Respond in session A.
2. Respond in session B using stale pending state.

**Expected Results:**
- Session B receives conflict response.
- Message is: "Invitation state changed. Refresh and try again."
