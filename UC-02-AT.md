# Acceptance Test Suite - UC-02 Validate User-Provided Information

## Assumptions / Notes
- No additional assumptions documented.

---

## AT-UC02-01 Valid Submission Persists
- Given authenticated user submits fully valid payload
- When validation runs
- Then submission is accepted and persisted

---

## AT-UC02-02 Required-Field Rejection
- Given required field is missing
- When submission is sent
- Then system rejects with field-specific required feedback and no persistence

---

## AT-UC02-03 Format Rejection
- Given one or more fields violate format constraints
- When submission is sent
- Then system rejects with field-specific format feedback and no persistence

---

## AT-UC02-04 Business-Rule Rejection
- Given business/cross-field constraint fails
- When submission is sent
- Then system rejects with explicit rule guidance and no persistence

---

## AT-UC02-05 Mixed-Error Stable Ordering
- Given mixed required/format/business failures
- When submission is sent
- Then all validation errors are returned in stable deterministic order

---

## AT-UC02-06 No Partial Writes on Validation Failure
- Given one field fails validation in create/update
- When submission is processed
- Then no partial create/update write is persisted

---

## AT-UC02-07 Correction and Resubmission
- Given initial submission fails
- When user corrects data and resubmits
- Then corrected submission can succeed without unsafe state loss

---

## AT-UC02-08 Post-Validation Persistence Failure Rollback
- Given validation passes but persistence fails
- When submission is processed
- Then system rolls back/aborts atomically and returns retry guidance

---

## AT-UC02-09 Concurrent Conflict Policy
- Given concurrent conflicting updates
- When both writes are processed
- Then last-write-wins defines final persisted state

---

## AT-UC02-10 Traceability and Rule Ownership
- Given UC-02 artifacts
- When reviewed
- Then FR-to-AT traceability and per-form rule ownership documentation are present
