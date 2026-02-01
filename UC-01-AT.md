# Acceptance Test Suite — UC-01 Register New User Account

## Assumptions / Notes
- A valid email follows standard email formatting rules.
- A unique email does not already exist in the CMS database.
- A secure password meets the CMS password security standards.

---

## AT-UC01-01 — Successful Registration (Main Success Scenario)

**Objective:** Verify a new user can register successfully with a unique, valid email and secure password.

**Preconditions:**
- User is not logged in.
- Email `new_user_01@example.com` does not exist in the database.

**Test Data:**
- Email: `new_user_01@example.com`
- Password: `ValidSecurePass!123`
- Other required fields: Valid values

**Steps:**
1. Navigate to the CMS registration option.
2. Verify the registration form is displayed.
3. Enter valid values in all required fields.
4. Submit the registration form.

**Expected Results:**
- Email format and uniqueness are validated.
- Password meets security requirements.
- User account is created and stored in the database.
- User is redirected to the login screen.
- No error messages are displayed.

---

## AT-UC01-02 — Invalid Email Format (Extension 4a)

**Objective:** Verify the system rejects registration if the email format is invalid.

**Preconditions:**
- User is not logged in.

**Test Data:**
- Email: `invalid-email-format`
- Password: `ValidSecurePass!123`

**Steps:**
1. Open the registration form.
2. Enter the invalid email and valid values elsewhere.
3. Submit the form.

**Expected Results:**
- The system detects the invalid email format.
- No account is created.
- An email-related error message is displayed.
- The user remains on the registration page.

---

## AT-UC01-03 — Duplicate Email (Extension 4b)

**Objective:** Verify the system rejects registration if the email is already registered.

**Preconditions:**
- User is not logged in.
- Email `existing_user@example.com` already exists in the database.

**Test Data:**
- Email: `existing_user@example.com`
- Password: `ValidSecurePass!123`

**Steps:**
1. Open the registration form.
2. Enter the duplicate email and valid values elsewhere.
3. Submit the form.

**Expected Results:**
- The system detects the duplicate email.
- No account is created.
- An error message indicates the email is already registered.
- The user remains on the registration page.

---

## AT-UC01-04 — Password Does Not Meet Security Standards (Extension 5a)

**Objective:** Verify the system rejects weak or invalid passwords.

**Preconditions:**
- User is not logged in.
- Email does not exist in the database.

**Test Data:**
- Email: `new_user_weakpass@example.com`
- Password: `12345`

**Steps:**
1. Open the registration form.
2. Enter valid values except for the weak password.
3. Submit the form.

**Expected Results:**
- The system rejects the password.
- No account is created.
- A password-related error message is displayed.
- The user remains on the registration page.

---

## AT-UC01-05 — Missing Required Fields (Extension 3a)

**Objective:** Verify the system rejects incomplete registration forms.

**Preconditions:**
- User is not logged in.

**Test Data:**
- Email: `new_user_missingfield@example.com`
- Password: `ValidSecurePass!123`
- One required field left blank

**Steps:**
1. Open the registration form.
2. Leave one required field blank.
3. Submit the form.

**Expected Results:**
- The system detects missing required fields.
- No account is created.
- Missing fields are highlighted with an error message.
- The user remains on the registration page.

---

## AT-UC01-06 — Multiple Validation Errors

**Objective:** Verify the system handles multiple invalid inputs in a single submission.

**Preconditions:**
- User is not logged in.

**Test Data:**
- Email: `bademail`
- Password: `123`
- One required field missing

**Steps:**
1. Open the registration form.
2. Enter invalid email, weak password, and omit a required field.
3. Submit the form.

**Expected Results:**
- The system reports all validation errors or the first blocking error clearly.
- No account is created.
- The user remains on the registration page.

---

## AT-UC01-07 — Data Persistence Check

**Objective:** Verify successful registration persists user data correctly.

**Preconditions:**
- A successful registration has been completed for `new_user_01@example.com`.

**Steps:**
1. Navigate to the login screen.
2. Log in using the newly registered credentials.

**Expected Results:**
- Login is successful.
- The user is redirected to their dashboard or home page.
