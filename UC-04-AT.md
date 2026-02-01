# Acceptance Test Suite — UC-04 Change Password

## Assumptions / Notes
- The user is authenticated (logged in) to access change-password functionality.
- The system requires the current password to authorize the change.
- The new password must meet the CMS password security standards.
- If a confirmation field exists, it must match the new password.
- On validation failure, the system does not update any credentials.

---

## AT-UC04-01 — Successful Password Change (Main Success Scenario)

**Objective:** Verify a logged-in user can change their password with a correct current password and a compliant new password.

**Preconditions:**
- User is logged in.
- Account exists with:
  - Username: `registered_user@example.com`
  - Current password: `OldSecurePass!123`

**Test Data:**
- Current password: `OldSecurePass!123`
- New password: `NewSecurePass!456` (meets security standards)

**Steps:**
1. Navigate to **Account Settings** → **Change Password**.
2. Enter the current password and the new password (and matching confirmation if present).
3. Submit the form.

**Expected Results:**
- The system verifies the current password.
- The system validates the new password against security standards.
- The system updates the stored password.
- The system displays a success confirmation.

---

## AT-UC04-02 — Missing Current Password (Extension 3a)

**Objective:** Verify the change is rejected when the current password is missing.

**Preconditions:**
- User is logged in.

**Steps:**
1. Open the change-password form.
2. Leave the current password blank.
3. Enter a valid new password (and confirmation if present).
4. Submit the form.

**Expected Results:**
- The system rejects the submission.
- The password is not changed.
- The system displays a required-field error for the current password.

---

## AT-UC04-03 — Missing New Password (Extension 3a)

**Objective:** Verify the change is rejected when the new password is missing.

**Preconditions:**
- User is logged in.

**Steps:**
1. Open the change-password form.
2. Enter a valid current password.
3. Leave the new password blank.
4. Submit the form.

**Expected Results:**
- The system rejects the submission.
- The password is not changed.
- The system displays a required-field error for the new password.

---

## AT-UC04-04 — Incorrect Current Password (Extension 5a)

**Objective:** Verify the change is rejected when the current password does not match stored credentials.

**Preconditions:**
- User is logged in.
- Account current password is `OldSecurePass!123`.

**Steps:**
1. Open the change-password form.
2. Enter an incorrect current password (e.g., `WrongOldPass`).
3. Enter a compliant new password (and confirmation if present).
4. Submit the form.

**Expected Results:**
- The system rejects the submission.
- The password is not changed.
- The system displays an error indicating the current password is incorrect.

---

## AT-UC04-05 — New Password Fails Security Standards (Extension 6a)

**Objective:** Verify the change is rejected when the new password violates password security rules.

**Preconditions:**
- User is logged in.
- Email/username exists.

**Test Data:**
- New password: `12345` (intentionally weak/invalid)

**Steps:**
1. Open the change-password form.
2. Enter the correct current password.
3. Enter `12345` as the new password (and confirmation if present).
4. Submit the form.

**Expected Results:**
- The system rejects the submission.
- The password is not changed.
- The system displays an error indicating the new password does not meet requirements.

---

## AT-UC04-06 — New Password Confirmation Mismatch (Extension 3b, If Applicable)

**Objective:** Verify the change is rejected when confirmation does not match the new password.

**Preconditions:**
- User is logged in.
- The form includes a confirmation field.

**Steps:**
1. Open the change-password form.
2. Enter the correct current password.
3. Enter a compliant new password.
4. Enter a different value in the confirmation field.
5. Submit the form.

**Expected Results:**
- The system rejects the submission.
- The password is not changed.
- The system displays an error indicating the confirmation does not match.

---

## AT-UC04-07 — Old Password No Longer Works After Change (Post-Condition Check)

**Objective:** Verify that after a successful password change, the old password can no longer be used.

**Preconditions:**
- AT-UC04-01 completed successfully.

**Steps:**
1. Log out (or end the session).
2. Attempt to log in using the old password.
3. Attempt to log in using the new password.

**Expected Results:**
- Login with the old password fails.
- Login with the new password succeeds.

---

## AT-UC04-08 — Credential Store Update Failure (Extension 7a)

**Objective:** Verify the system handles database/service failures during password update gracefully.

**Preconditions:**
- User is logged in.
- Simulate credential store/database failure at update time (e.g., DB write blocked/unavailable).

**Steps:**
1. Open the change-password form.
2. Enter correct current password and a compliant new password (and matching confirmation if present).
3. Submit the form while the credential store is unavailable for writes.

**Expected Results:**
- The system does not change the password.
- The system displays a system error message indicating the update could not be completed.
- The user can retry later.

---

## AT-UC04-09 — No Partial Update on Failure (Atomicity Check)

**Objective:** Verify that if any validation fails, no credential change is persisted.

**Preconditions:**
- User is logged in.
- Current password is known.

**Steps:**
1. Submit the form with an incorrect current password but a valid new password.
2. After rejection, log out.
3. Attempt to log in using the (supposed) new password.

**Expected Results:**
- Login with the new password fails (password was not changed).
- Login with the original password still succeeds.
