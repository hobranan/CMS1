# Acceptance Test Suite — UC-03 Log in to CMS

## Assumptions / Notes
- The user logs in using a username and password as described in the SRS.
- Registration requires a unique email; the system may use email as the username.
- On success, the system redirects the user to their personalized dashboard/home page.
- On failure, the system does not authenticate the user and provides clear feedback.

---

## AT-UC03-01 — Successful Login (Main Success Scenario)

**Objective:** Verify a registered user can log in with valid credentials and reach their dashboard.

**Preconditions:**
- User is not logged in.
- A user account exists with:
  - Username: `registered_user@example.com`
  - Password: `ValidSecurePass!123`

**Steps:**
1. Navigate to the CMS login option/page.
2. Enter `registered_user@example.com` as the username and `ValidSecurePass!123` as the password.
3. Submit the login form.

**Expected Results:**
- The system validates the submission and checks the credentials against stored values.
- The user is authenticated (session established).
- The system redirects the user to their personalized dashboard/home page.
- No credential error message is displayed.

---

## AT-UC03-02 — Missing Username (Extension 3a)

**Objective:** Verify login is rejected when username is missing.

**Preconditions:**
- User is not logged in.

**Steps:**
1. Open the login form.
2. Leave the username field blank.
3. Enter any value in the password field.
4. Submit the form.

**Expected Results:**
- The system rejects the submission.
- The user is not authenticated.
- The system displays an error message indicating the username is required (or highlights the field).
- The user remains on the login page.

---

## AT-UC03-03 — Missing Password (Extension 3a)

**Objective:** Verify login is rejected when password is missing.

**Preconditions:**
- User is not logged in.

**Steps:**
1. Open the login form.
2. Enter a username value.
3. Leave the password field blank.
4. Submit the form.

**Expected Results:**
- The system rejects the submission.
- The user is not authenticated.
- The system displays an error message indicating the password is required (or highlights the field).
- The user remains on the login page.

---

## AT-UC03-04 — Unknown Username (Extension 4a)

**Objective:** Verify login is rejected when the username is not registered.

**Preconditions:**
- User is not logged in.
- No account exists with username `unknown_user@example.com`.

**Steps:**
1. Open the login form.
2. Enter `unknown_user@example.com` as the username and any password value.
3. Submit the form.

**Expected Results:**
- The system does not authenticate the user.
- The system displays an error message indicating the username is not recognized (or credentials invalid, depending on design).
- The user remains on the login page.

---

## AT-UC03-05 — Wrong Password (Extension 5a)

**Objective:** Verify login is rejected when the password does not match the stored password.

**Preconditions:**
- User is not logged in.
- Account exists with username `registered_user@example.com`.

**Steps:**
1. Open the login form.
2. Enter `registered_user@example.com` as the username.
3. Enter an incorrect password (e.g., `WrongPass123`).
4. Submit the form.

**Expected Results:**
- The system does not authenticate the user.
- The system displays an error message indicating invalid credentials.
- The user remains on the login page.

---

## AT-UC03-06 — Database/Credential Store Unavailable (Extension 4b)

**Objective:** Verify the system handles credential-store failures gracefully.

**Preconditions:**
- User is not logged in.
- Credential store/database is unavailable (simulate by stopping DB service or forcing a DB connection failure).

**Steps:**
1. Open the login form.
2. Enter valid-looking credentials.
3. Submit the form while the credential store is unavailable.

**Expected Results:**
- The system does not authenticate the user.
- The system displays a system error message indicating login cannot be processed at this time.
- The user remains on the login page (or is returned there) and can retry later.

---

## AT-UC03-07 — Session Established on Success (Post-Condition Check)

**Objective:** Verify that, after successful login, protected/dashboard resources are accessible.

**Preconditions:**
- AT-UC03-01 has succeeded (user is logged in).

**Steps:**
1. Navigate directly to a protected/dashboard page (e.g., dashboard URL).
2. Refresh the page.

**Expected Results:**
- The protected page loads successfully without redirecting to the login page.
- The user remains authenticated during the session.
