# Acceptance Test Suite - UC-14 Record Paper Decision

## Assumptions / Notes
- No additional assumptions documented.

---

## AT-UC14-01 Accept Decision
- Given an authorized editor and eligible paper
- When the editor confirms `accept`
- Then decision is stored and status becomes `accepted`

---

## AT-UC14-02 Reject Decision
- Given an authorized editor and eligible paper
- When the editor confirms `reject`
- Then decision is stored and status becomes `rejected`

---

## AT-UC14-03 No Completed Reviews Block
- Given completed-review count is 0 and override is false
- When editor confirms a decision
- Then system returns ineligible response and status remains unchanged

---

## AT-UC14-04 Cancel Before Confirm
- Given an eligible paper
- When editor cancels before confirm
- Then no decision is stored and status remains unchanged

---

## AT-UC14-05 Ineligible State Block
- Given paper is already decided or decision period is closed
- When editor attempts confirm
- Then system blocks with explanatory response and no mutation

---

## AT-UC14-06 Save Failure
- Given a simulated persistence failure
- When editor confirms a decision
- Then system returns save failure and keeps status unchanged

---

## AT-UC14-07 Notification Failure
- Given save succeeds but notification fails
- When editor confirms a decision
- Then decision remains committed and response reports `notificationStatus=failed`

---

## AT-UC14-08 Conflict on Second Attempt
- Given one decision already committed
- When a second near-simultaneous decision is submitted
- Then second request returns conflict and first decision remains authoritative
