# Acceptance Test Suite — UC-20 Pay Registration Fee Online

## Assumptions / Notes
- Attendees must be logged in to pay.
- Payment gateway interactions may be simulated in testing.
- Successful payment confirms registration.

---

## AT-UC20-01 — Successful Online Payment (Main Success Scenario)

**Objective:** Verify an attendee can successfully pay the registration fee online.

**Preconditions:**
- Attendee is logged in.
- Registration category selected.
- Payment gateway available.

**Steps:**
1. Navigate to payment page.
2. Select **Pay Online**.
3. Enter valid payment details.
4. Confirm payment.

**Expected Results:**
- Payment is processed successfully.
- Registration status updates to **Paid/Confirmed**.
- Confirmation/receipt is displayed and sent.

---

## AT-UC20-02 — Cancel Payment at Gateway (Extension 4a)

**Objective:** Verify canceling payment does not register payment.

**Preconditions:**
- Attendee is logged in.

**Steps:**
1. Start online payment.
2. Cancel payment at gateway.

**Expected Results:**
- No payment is recorded.
- Registration remains unpaid.

---

## AT-UC20-03 — Invalid Payment Details (Extension 5a)

**Objective:** Verify invalid payment details are rejected.

**Preconditions:**
- Attendee is logged in.

**Steps:**
1. Enter invalid payment details.
2. Attempt payment.

**Expected Results:**
- Payment gateway rejects transaction.
- Error message displayed.
- Registration remains unpaid.

---

## AT-UC20-04 — Payment Declined by Provider (Extension 6a)

**Objective:** Verify declined payments are handled correctly.

**Preconditions:**
- Attendee is logged in.

**Steps:**
1. Enter valid payment details.
2. Payment is declined by provider.

**Expected Results:**
- Attendee informed of decline.
- Registration remains unpaid.

---

## AT-UC20-05 — Payment Confirmation Timeout (Extension 7a)

**Objective:** Verify handling of missing payment confirmation.

**Preconditions:**
- Attendee is logged in.
- Simulate gateway timeout.

**Steps:**
1. Complete payment at gateway.
2. CMS does not receive confirmation.

**Expected Results:**
- System shows pending/failed payment message.
- Registration remains unpaid until resolved.

---

## AT-UC20-06 — Database Error While Recording Payment (Extension 8a)

**Objective:** Verify behavior when payment cannot be recorded.

**Preconditions:**
- Attendee is logged in.
- Simulate database failure.

**Steps:**
1. Complete successful payment.
2. Database save fails.

**Expected Results:**
- System error message displayed.
- Registration not confirmed.
- Payment requires reconciliation.

---

## AT-UC20-07 — Persistence Check: Confirmed Registration Persists

**Objective:** Verify confirmed registration persists across sessions.

**Preconditions:**
- AT-UC20-01 completed successfully.

**Steps:**
1. Log out and log back in.
2. View registration status.

**Expected Results:**
- Registration status remains **Paid/Confirmed**.
