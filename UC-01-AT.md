# Acceptance Test Suite - UC-01 Register New User Account

## Assumptions / Notes

- Required registration fields are `email`, `password`, and `confirm password`.
- Password policy: minimum 12 chars, uppercase, lowercase, number, symbol, no leading/trailing spaces, and common/breached password rejection when available.
- Expiry timing uses server UTC.

---

## AT-UC01-01 - Successful Registration With Verification

**Objective:** Verify pending registration is created and account activates only after successful verification.

**Preconditions:**
- User is not logged in.
- Email `new_user_01@example.com` does not exist in active/pending records.

**Steps:**
1. Submit valid registration form.
2. Open verification link received by email within 24h.
3. Complete verification.

**Expected Results:**
- Pending registration created on submit.
- Account remains inactive before verification.
- Account is activated only after verification.
- User is redirected to login.

---

## AT-UC01-02 - Invalid Email Format

**Expected Results:**
- Field-level email error returned.
- No pending registration/account activation.

---

## AT-UC01-03 - Duplicate Email

**Expected Results:**
- Duplicate-email error returned for existing active/pending email.
- No additional pending registration/account activation.

---

## AT-UC01-04 - Password Policy Violation

**Expected Results:**
- Password violation details returned.
- No pending registration/account activation.

---

## AT-UC01-05 - Missing Required Fields

**Expected Results:**
- Missing-field errors returned.
- No pending registration/account activation.

---

## AT-UC01-06 - Multiple Validation Failures Ordering

**Expected Results:**
- All field-level validation errors returned in stable order.
- No pending registration/account activation.

---

## AT-UC01-07 - Immediate Login After Successful Verification

**Preconditions:**
- Account has been successfully verified via AT-UC01-01.

**Expected Results:**
- Login succeeds with newly registered credentials.

---

## AT-UC01-08 - Login Attempt Before Verification

**Expected Results:**
- Login denied with unverified reminder.
- Resend option shown when pending registration is unexpired.

---

## AT-UC01-09 - Pending Registration Expired After 7 Days

**Expected Results:**
- Pending registration age `>=7 days` is treated expired.
- Verification/resend/login for expired pending registration denied.
- User directed to start new registration.

---

## AT-UC01-10 - Post-Expiry Login Guidance

**Expected Results:**
- Login response indicates inactive/expired registration state.
- User guidance points to new registration flow.

---

## AT-UC01-11 - Concurrent Same-Email Registration

**Expected Results:**
- Atomic uniqueness enforcement prevents duplicate pending records.
- One request succeeds; concurrent duplicate is deterministically rejected.

---

## AT-UC01-12 - Resend Rate Limits

**Expected Results:**
- Enforces max 3 resend attempts per rolling 24h window.
- Enforces 60-second cooldown between attempts.
- Returns clear cooldown/rate-limit guidance when blocked.

---

## AT-UC01-13 - Token Security and Single-Use

**Expected Results:**
- Verification token generated with secure randomness.
- Token stored hashed server-side.
- Used token cannot be reused.
- Tampered/invalid token cannot activate account.

---

## AT-UC01-14 - Privacy and Logging Controls

**Expected Results:**
- Raw passwords and full tokens never appear in logs.
- Emails are masked in logs.
- Client errors do not expose sensitive internals.

---

## AT-UC01-15 - Accessibility of Validation and Reminder UX

**Expected Results:**
- Errors/reminders are announced to assistive technology (`aria-live`).
- Invalid fields are programmatically associated with their error text.
- Keyboard-only user can complete register/verify/resend flow.
