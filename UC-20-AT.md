# Acceptance Test Suite - UC-20 Pay Conference Registration Fee Online

## Assumptions / Notes
- No additional assumptions documented.

---

## AT-UC20-01 Successful Payment
- Given authenticated attendee with selected category
- When payment succeeds at gateway and callback is verified
- Then CMS records payment, sets registration to `paid_confirmed`, and shows confirmation

---

## AT-UC20-02 Canceled Payment
- Given attendee starts payment
- When attendee cancels at gateway
- Then CMS keeps registration unpaid and records no payment

---

## AT-UC20-03 Invalid Payment Details
- Given attendee submits invalid details
- When gateway rejects details
- Then CMS keeps registration unpaid and shows invalid-details feedback

---

## AT-UC20-04 Declined Payment
- Given attendee submits payment
- When provider declines transaction
- Then CMS keeps registration unpaid and shows decline feedback

---

## AT-UC20-05 Timeout or Missing Confirmation
- Given payment callback is not received in time
- When timeout resolution executes
- Then CMS keeps registration out of confirmed state and marks unresolved pending outcome

---

## AT-UC20-06 Success with Persistence Failure
- Given gateway returns success
- When CMS fails to save payment record
- Then registration is not confirmed and reconciliation item is created

---

## AT-UC20-07 Confirmed Status Persistence
- Given registration reached `paid_confirmed`
- When attendee refreshes or logs in again
- Then status remains `paid_confirmed`
