# Data Model: UC-01 Register New User Account

## Entity: UserAccount

- Purpose: Represents an active, authenticated CMS user.
- Fields:
  - `id` (UUID, primary key)
  - `email` (string, normalized lowercase, unique)
  - `password_hash` (string, required)
  - `status` (enum: `ACTIVE`, `LOCKED`, `DISABLED`)
  - `created_at` (datetime, required)
  - `updated_at` (datetime, required)
- Validation rules:
  - Email format must be valid before persistence.
  - Email must be unique against active users and unexpired pending registrations.
  - Password hash must never contain plaintext password.
- Relationships:
  - Created from one `PendingRegistration` after verification success.

## Entity: PendingRegistration

- Purpose: Holds registration submission before email verification completes.
- Fields:
  - `id` (UUID, primary key)
  - `email` (string, normalized lowercase, indexed)
  - `password_hash` (string, required)
  - `status` (enum: `PENDING_VERIFICATION`, `VERIFIED`, `EXPIRED`, `CANCELLED`)
  - `submitted_at` (datetime, required)
  - `registration_expires_at` (datetime, required, 7 days from submission)
  - `verified_at` (datetime, nullable)
- Validation rules:
  - Required fields must be present (email, password and any configured required profile fields).
  - Password meets baseline: min 8 chars, at least one letter, at least one number.
  - `registration_expires_at` must be exactly `submitted_at + 7 days`.
- Relationships:
  - One-to-many with `EmailVerificationToken`.
  - One-to-one eventual conversion into `UserAccount` on success.

## Entity: EmailVerificationToken

- Purpose: Single-use verification link credential for a pending registration.
- Fields:
  - `id` (UUID, primary key)
  - `pending_registration_id` (UUID, foreign key)
  - `token_hash` (string, unique, required)
  - `issued_at` (datetime, required)
  - `expires_at` (datetime, required, 24 hours from issuance)
  - `used_at` (datetime, nullable)
  - `invalidated_at` (datetime, nullable)
- Validation rules:
  - Token must be unexpired and unused at verification time.
  - Any new token issuance invalidates previous active tokens for the same pending registration.
  - Token cannot be used after `registration_expires_at` of the parent pending registration.
- Relationships:
  - Belongs to `PendingRegistration`.

## Entity: LoginAttemptResolution (application model)

- Purpose: Encapsulates authentication outcome messaging for pre-verification login attempts.
- Fields:
  - `status` (enum: `AUTHENTICATED`, `INVALID_CREDENTIALS`, `EMAIL_UNVERIFIED`)
  - `message` (string)
  - `resend_allowed` (boolean)
- Validation rules:
  - `resend_allowed` must be true only when `status = EMAIL_UNVERIFIED` and pending registration is not past 7-day expiry.

## Entity: RegistrationValidationResult (application model)

- Purpose: Carries controller/model validation output to views and API responses.
- Fields:
  - `is_valid` (boolean)
  - `errors` (array of `{ code, field, message }`)
- Validation rules:
  - `errors` must be empty when `is_valid = true`.
  - Error `field` may be null for form-level errors.

## State Transitions

1. Submission accepted:
   - `PendingRegistration.status`: `PENDING_VERIFICATION`
   - `registration_expires_at`: submission + 7 days
   - Verification token issued (24-hour expiry).
2. Successful verification while pending registration active:
   - Token marked used.
   - `PendingRegistration.status`: `VERIFIED`
   - `UserAccount` created with status `ACTIVE`.
3. Verification token expires before use:
   - `PendingRegistration.status` remains `PENDING_VERIFICATION` while still within 7-day registration window.
   - Resend action issues a fresh token.
4. Pending registration reaches 7-day expiry before verification:
   - `PendingRegistration.status`: `EXPIRED`
   - Verification and resend are denied until re-registration.
5. Login attempt before verification:
   - Authentication returns `EMAIL_UNVERIFIED` with reminder and resend option.
6. Invalid/duplicate/weak input:
   - No `UserAccount` creation.
   - Validation errors returned and user remains on registration page.
