# Feature Specification: Register new user account

**Feature Branch**: `001-uc01-requirements`  
**Created**: 2026-02-02  
**Status**: Draft  
**Input**: User description: "UC-01.md contains the use case flows (the Main Success Scenario and all Extensions). Extract the functional requirements from these flows. The UC-01-AT.md contains the acceptance tests for the UC-01.md file, you can additionally use this in helping to determine the those requirements. Also, I need a new branch made for this use case."  
**Use Case Sources**: `UC-01.md`, `UC-01-AT.md`

## Clarifications

### Session 2026-02-02

- Q: Must registration require email verification with a confirmation link that expires in 24 hours? -> A: Yes, verification is required before registration success, and links expire after 24 hours.

### Session 2026-02-10

- Q: How long can an unverified registration attempt remain active? -> A: Registration attempts expire after 7 days from initial submission.
- Q: What happens if a user tries to log in before verification? -> A: Login is denied, user is reminded that verification email was sent, and user is offered a resend option.

### Session 2026-02-20

- Required registration fields are explicitly bounded to: `email`, `password`, `confirm password`.
- Expiry rules use server UTC timestamps with deterministic boundaries.
- Pending-registration expiry means user must start a brand-new registration flow.
- Validation behavior returns all field-level validation errors in a stable ordering.
- Resend verification is limited to 3 attempts per 24-hour rolling window with 60-second cooldown.
- Password security is explicitly normative (12+ chars, upper/lower/number/symbol, no leading/trailing spaces, reject common/breached passwords where available).
- Tokens must be CSPRNG-generated, stored hashed, and enforced as single-use.
- Logging/privacy and accessibility minimums are required.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Register a new account (Priority: P1)

A new user creates an account by providing a valid, unique email address and a
secure password so they can access CMS features beyond public announcements.

**Why this priority**: Registration is required before any authenticated CMS
features are available.

**Independent Test**: Can be fully tested by completing registration with valid
data and confirming the user can log in immediately after successful email verification.

**Acceptance Scenarios**:

1. **Given** a user is not logged in and uses a unique, valid email, **When**
   they submit the registration form with all required fields valid, **Then**
   the system creates a pending registration, sends a confirmation link, and does
   not activate the account until email verification succeeds.
2. **Given** a user receives a valid confirmation link within 24 hours, **When**
   they confirm the email, **Then** the account is activated and the user is
   redirected to the login screen.
3. **Given** a user enters an invalid email format, **When** they submit the
   form, **Then** no account is activated and an email format error is shown.
4. **Given** a user enters an email that already exists in active or pending state,
   **When** they submit the form, **Then** no duplicate registration is created and
   a duplicate-email error is shown.
5. **Given** a user enters a password that does not meet security rules,
   **When** they submit the form, **Then** no pending registration is persisted and a
   password requirements error is shown.
6. **Given** a user leaves required fields missing or invalid, **When** they
   submit the form, **Then** missing/invalid fields are highlighted and the user
   remains on the registration page.
7. **Given** a user submits multiple invalid inputs, **When** they submit the
   form, **Then** all field-level validation errors are returned in stable order,
   no pending registration is created, and the user remains on the registration page.
8. **Given** a user attempts to confirm using an expired link, **When** the link
   age is `>= 24 hours` by server UTC time, **Then** registration is not completed,
   and the user may request a new confirmation link subject to resend rules.
9. **Given** a user attempts login before completing email verification, **When**
   they submit valid credentials for an unverified registration, **Then** login
   is denied, a verification reminder is shown, and a resend option is offered if
   still within pending-registration window.
10. **Given** a pending registration is older than 7 days, **When** user attempts
    login or resend using that pending registration, **Then** login/resend are denied
    as inactive/expired and the user is directed to start a new registration.

---

### Edge Cases

- Multiple validation errors in a single submission.
- Duplicate email entered with other invalid inputs.
- Concurrent same-email registration submissions.
- Replayed, tampered, or already-used confirmation token.
- Expired email confirmation link (`>= 24 hours` by server UTC).
- Login attempt before email verification.
- Unverified registration attempt age `>= 7 days`.
- Verification-email send timeout/failure after pending registration creation.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a registration option for unauthenticated
  users.
- **FR-002**: System MUST present a registration form when the registration
  option is selected.
- **FR-003**: System MUST require `email`, `password`, and `confirm password`
  before accepting registration submission.
- **FR-004**: System MUST validate email format before attempting registration.
- **FR-005**: System MUST reject registrations when the email is already in use
  by an active account or existing pending registration.
- **FR-006**: System MUST validate password against all of the following rules:
  minimum 12 characters, at least one uppercase letter, one lowercase letter,
  one number, one symbol, no leading/trailing spaces, and rejection of
  common/breached passwords when list/service is available.
- **FR-007**: System MUST create a pending registration only when all validation
  checks pass.
- **FR-008**: System MUST send an email confirmation link to the provided email
  address before completing registration.
- **FR-009**: System MUST complete registration only after the user confirms the
  email via the confirmation link.
- **FR-010**: Confirmation links MUST expire when
  `current_server_utc >= issued_at_utc + 24 hours`.
- **FR-011**: On successful verification, System MUST activate/store the user
  account and redirect the user to the login screen.
- **FR-012**: On validation failure, System MUST display actionable field-level
  errors with correction guidance, highlight invalid fields, and keep the user
  on the registration page.
- **FR-013**: After successful registration completion, new credentials MUST
  allow immediate login.
- **FR-014**: Pending registration attempts MUST expire when
  `current_server_utc >= pending_created_at_utc + 7 days`.
- **FR-015**: If login is attempted before email verification, System MUST deny
  login, remind the user verification is required, and provide resend option
  when pending registration is unexpired.
- **FR-016**: Resend verification MUST enforce max 3 resend attempts per 24-hour
  rolling window and minimum 60-second cooldown between resend requests.
- **FR-017**: If pending registration is expired, login/resend flows MUST return
  inactive/expired guidance and require new registration.
- **FR-018**: When multiple validation failures exist, System MUST return all
  field-level failures in stable response ordering.
- **FR-019**: Verification tokens MUST be generated using cryptographically
  secure randomness, stored hashed server-side, and enforced as single-use.
- **FR-020**: System MUST not log raw passwords or full token values and MUST
  mask emails in logs and diagnostics.
- **FR-021**: Registration/verification/login reminders MUST support keyboard-only
  use, screen-reader announcement (`aria-live`), and programmatic field-error
  association.
- **FR-022**: Uniqueness checks and pending-registration creation MUST be
  performed atomically to prevent duplicate same-email pending records.
- **FR-023**: System MUST maintain requirement-to-acceptance-test traceability
  between FR IDs and UC-01-AT test IDs.

### Non-Functional Requirements

- **NFR-001 (Performance)**: Registration submit and verification endpoints
  SHOULD satisfy p95 latency <= 500ms under expected load profile.
- **NFR-002 (Security)**: Credential and token handling MUST follow FR-019/FR-020
  and never expose sensitive artifacts in client-visible errors.
- **NFR-003 (Reliability)**: Failure in email send MUST preserve pending
  registration integrity and provide retry/recovery guidance.
- **NFR-004 (Usability/Accessibility)**: Validation and unverified-login
  guidance MUST meet FR-021 accessibility minimums.

### Assumptions

- Security owner is authoritative for password-policy updates.
- Changes to password policy, uniqueness lifecycle, or pending expiry semantics
  require synchronized updates to spec + `UC-01.md` + `UC-01-AT.md`.
- Backend/domain owner is authoritative for uniqueness and pending-lifecycle
  rules.

### Key Entities *(include if feature involves data)*

- **User Account**: Active registered user with credential and activation state.
- **Pending Registration**: Pre-verification registration state with creation
  timestamp and expiry window.
- **Email Verification Token**: Single-use verification artifact with issue time,
  hash representation, and expiration time.
- **Resend Attempt Ledger**: Timestamped resend-attempt history used for
  cooldown and rolling-window rate limiting.

## FR-to-AT Traceability Matrix

| FR ID | Acceptance Test IDs |
|-------|---------------------|
| FR-001..FR-004 | AT-UC01-01, AT-UC01-02, AT-UC01-05 |
| FR-005 | AT-UC01-03, AT-UC01-11 |
| FR-006 | AT-UC01-04 |
| FR-007..FR-011 | AT-UC01-01, AT-UC01-07 |
| FR-012, FR-018 | AT-UC01-02, AT-UC01-04, AT-UC01-05, AT-UC01-06 |
| FR-013 | AT-UC01-07 |
| FR-014, FR-017 | AT-UC01-09, AT-UC01-10 |
| FR-015 | AT-UC01-08 |
| FR-016 | AT-UC01-12 |
| FR-019 | AT-UC01-13 |
| FR-020 | AT-UC01-14 |
| FR-021 | AT-UC01-15 |
| FR-022 | AT-UC01-11 |

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of valid registration submissions create pending
  registration, send confirmation link, and complete account activation only
  after successful email verification.
- **SC-002**: 100% of invalid registration submissions display clear actionable
  field-level errors and do not create pending registration.
- **SC-003**: 100% of successfully verified users can log in immediately after
  verification with submitted credentials.
- **SC-004**: At least 95% of successful first-time users complete registration
  from first submit to verification completion in under 2 minutes.
- **SC-005**: 100% of unverified-login attempts are denied with verification
  reminder and resend option when pending registration is still eligible.

## SC Evidence Mapping

| Success Criterion | Evidence Source |
|-------------------|-----------------|
| SC-001 | `tests/integration/test_uc01_registration_happy_path.js`, `tests/contract/test_uc01_registration_contract.js` |
| SC-002 | `tests/integration/test_uc01_registration_validation_failures.js`, `tests/contract/test_uc01_registration_contract.js` |
| SC-003 | `tests/integration/test_uc01_registration_happy_path.js` |
| SC-004 | Measured in `specs/001-uc01-requirements/validation-report.md` using registration-to-verification completion timing observations |
| SC-005 | `tests/integration/test_uc01_registration_expiry_and_unverified_login.js` and summary evidence in `specs/001-uc01-requirements/validation-report.md` |
