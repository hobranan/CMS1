# Acceptance Test Suite - UC-19 View Registration Prices

## Assumptions / Notes
- No additional assumptions documented.

---

## AT-UC19-01 Public Published Access
- Public request returns published pricing categories.

---

## AT-UC19-02 Guest/Auth Parity
- Guest and authenticated responses are identical.

---

## AT-UC19-03 CAD Formatting
- Integer and decimal amounts are displayed in CAD label format.

---

## AT-UC19-04 Unpublished State
- Unpublished pricing returns 404.

---

## AT-UC19-05 Retrieval Failure
- Retrieval failure returns 500 safe error.

---

## AT-UC19-06 Incomplete Data Markers
- Incomplete categories include missing-information markers.

---

## AT-UC19-07 Consistency Across Refresh
- Repeated retrieval returns consistent payload.

---

## AT-UC19-08 Failure Then Recovery
- Temporary failure followed by successful retrieval works.

---

## AT-UC19-09 No-Discount Enforcement
- Response includes `discountApplied=false`, `currency=CAD`, and no discount fields.

---

## AT-UC19-10 Performance
- Public pricing retrieval p95 stays below 400ms in local harness.
