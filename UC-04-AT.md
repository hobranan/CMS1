# Acceptance Test Suite - UC-04 Change Password

## Assumptions / Notes
- The user is authenticated to access password-change functionality.
- The system requires the current password to authorize a password change.
- The new password must meet CMS password security standards.
- Confirmation is required and must match the new password.
- On validation failure, no credential update is persisted.

## AT-UC04-01 - Successful Password Change

**Objective:** Verify a logged-in user can change password with valid inputs.

**Preconditions:**
- User is logged in.
- Account exists with current password `OldSecurePass!123`.

**Test Data:**
- Current password: `OldSecurePass!123`
- New password: `NewSecurePass!456` (compliant)

**Steps:**
1. Navigate to Account Settings -> Change Password.
2. Enter current password, new password, and matching confirmation.
3. Submit.

**Expected Results:**
- Current password is verified.
- New password passes policy checks.
- Stored password is updated.
- Success confirmation is shown.

## AT-UC04-02 - Missing Current Password

**Objective:** Verify rejection when current password is missing.

**Preconditions:**
- User is logged in.

**Steps:**
1. Open change-password form.
2. Leave current password blank.
3. Enter a valid new password and matching confirmation.
4. Submit.

**Expected Results:**
- Submission is rejected.
- Password is unchanged.
- Required-field error for current password is shown.

## AT-UC04-03 - Missing New Password

**Objective:** Verify rejection when new password is missing.

**Preconditions:**
- User is logged in.

**Steps:**
1. Open change-password form.
2. Enter valid current password.
3. Leave new password blank.
4. Submit.

**Expected Results:**
- Submission is rejected.
- Password is unchanged.
- Required-field error for new password is shown.

## AT-UC04-04 - Incorrect Current Password

**Objective:** Verify rejection when current password does not match stored credential.

**Preconditions:**
- User is logged in.
- Account current password is `OldSecurePass!123`.

**Steps:**
1. Open change-password form.
2. Enter incorrect current password (for example `WrongOldPass`).
3. Enter compliant new password and matching confirmation.
4. Submit.

**Expected Results:**
- Submission is rejected.
- Password is unchanged.
- Incorrect-current-password error is shown.

## AT-UC04-05 - New Password Fails Security Standards

**Objective:** Verify rejection when new password violates policy.

**Preconditions:**
- User is logged in.

**Test Data:**
- New password: `12345` (intentionally invalid)

**Steps:**
1. Open change-password form.
2. Enter correct current password.
3. Enter `12345` as new password and matching confirmation.
4. Submit.

**Expected Results:**
- Submission is rejected.
- Password is unchanged.
- Password-policy error is shown.

## AT-UC04-06 - New Password Confirmation Mismatch

**Objective:** Verify rejection when confirmation does not match new password.

**Preconditions:**
- User is logged in.

**Steps:**
1. Open change-password form.
2. Enter correct current password.
3. Enter a compliant new password.
4. Enter a different value in confirmation.
5. Submit.

**Expected Results:**
- Submission is rejected.
- Password is unchanged.
- Confirmation-mismatch error is shown.

## AT-UC04-07 - Old Password Invalid After Successful Change

**Objective:** Verify old password no longer works after a successful change.

**Preconditions:**
- AT-UC04-01 succeeded.

**Steps:**
1. Log out.
2. Attempt login with old password.
3. Attempt login with new password.

**Expected Results:**
- Login with old password fails.
- Login with new password succeeds.

## AT-UC04-08 - Credential Store Update Failure

**Objective:** Verify graceful failure when credential-store write fails.

**Preconditions:**
- User is logged in.
- Credential store write path is unavailable.

**Steps:**
1. Open change-password form.
2. Enter correct current password, compliant new password, and matching confirmation.
3. Submit while writes are unavailable.

**Expected Results:**
- Password is not changed.
- Retry-later system error is shown.
- User can retry later.

## AT-UC04-09 - No Partial Update on Failure

**Objective:** Verify failed requests never partially update credentials.

**Preconditions:**
- User is logged in.
- Current password is known.

**Steps:**
1. Submit with incorrect current password and valid new password.
2. After rejection, log out.
3. Attempt login with the new password.

**Expected Results:**
- Login with new password fails.
- Login with original password succeeds.
