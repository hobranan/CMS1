# Acceptance Test Suite — UC-21 Receive Payment Confirmation / Ticket

## Assumptions / Notes
- Tickets/confirmations are issued only after payment is confirmed and recorded.
- Confirmation can be delivered on-screen and via email/in-app notification.
- The attendee should be able to retrieve the ticket later from their account.

---

## AT-UC21-01 — Display Confirmation/Ticket After Successful Payment (Main Success Scenario)

**Objective:** Verify the system displays a confirmation/ticket immediately after payment.

**Preconditions:**
- Attendee is logged in.
- Payment for registration succeeds and is confirmed.

**Steps:**
1. Complete online payment (UC-20).
2. Observe the post-payment confirmation page.

**Expected Results:**
- Registration status becomes **Paid/Confirmed**.
- The system displays a confirmation/ticket with registration details and reference number (and QR code if supported).

---

## AT-UC21-02 — Confirmation/Ticket Sent via Email/In-App Notification (Main Success Scenario)

**Objective:** Verify confirmation/ticket is delivered via configured notification channel.

**Preconditions:**
- Attendee has a valid email address (or in-app notifications enabled).
- Payment is confirmed.

**Steps:**
1. Complete successful payment.
2. Check email/in-app notifications.

**Expected Results:**
- The attendee receives the confirmation/ticket.
- Message content includes a reference ID and key registration details.

---

## AT-UC21-03 — Retrieve Ticket Later from Account (Main Success Scenario)

**Objective:** Verify attendee can retrieve previously issued ticket from the CMS.

**Preconditions:**
- AT-UC21-01 completed successfully.

**Steps:**
1. Log out and log back in (optional).
2. Navigate to registration/account area.
3. Open the confirmation/ticket.

**Expected Results:**
- The ticket is available and matches the issued confirmation.
- Ticket can be downloaded/printed if supported.

---

## AT-UC21-04 — Payment Confirmation Pending (Extension 2a)

**Objective:** Verify ticket is not issued when payment is pending.

**Preconditions:**
- Ability to simulate delayed gateway confirmation.

**Steps:**
1. Complete payment flow where confirmation is delayed.
2. Observe system response.

**Expected Results:**
- The system shows a pending status message.
- No ticket is issued until confirmation is received.
- Registration is not marked as confirmed until verified.

---

## AT-UC21-05 — Notification Delivery Failure (Extension 6a)

**Objective:** Verify ticket remains accessible even if email/in-app delivery fails.

**Preconditions:**
- Payment is confirmed.
- Ability to simulate notification service failure.

**Steps:**
1. Complete successful payment while notifications fail.
2. Navigate to account/registration area.

**Expected Results:**
- System informs attendee delivery failed.
- Ticket is still available for retrieval within the CMS.

---

## AT-UC21-06 — Ticket Generation Failure (Extension 4a)

**Objective:** Verify system behavior when ticket generation fails.

**Preconditions:**
- Payment is confirmed.
- Ability to simulate ticket generator error.

**Steps:**
1. Complete successful payment while ticket generation fails.

**Expected Results:**
- System shows an error that ticket could not be generated.
- No ticket is issued.
- Registration remains **Paid/Confirmed** (or payment recorded) and can be reconciled later.

---

## AT-UC21-07 — Ticket Storage Failure (Extension 7a)

**Objective:** Verify system behavior when ticket cannot be stored.

**Preconditions:**
- Payment is confirmed.
- Ability to simulate database failure on ticket record save.

**Steps:**
1. Complete successful payment.
2. Attempt to access ticket later from account.

**Expected Results:**
- System warns ticket may not be retrievable.
- Ticket retrieval may fail; user is advised to download/print immediately.
- System logs the error for reconciliation.

---

## AT-UC21-08 — Attendee Leaves Before Viewing Ticket (Extension 5a)

**Objective:** Verify ticket is still retrievable if attendee navigates away immediately.

**Preconditions:**
- Payment is confirmed.

**Steps:**
1. Complete successful payment.
2. Immediately navigate away from confirmation page.
3. Return to account/registration area.

**Expected Results:**
- Ticket is available for viewing.
- Registration remains confirmed.
