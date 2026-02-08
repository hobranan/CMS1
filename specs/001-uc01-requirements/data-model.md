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
  - `verified_at` (datetime, nullable)
  - `expires_at` (datetime, required, 24h from token issuance)
- Validation rules:
  - Required fields must be present (email, password and any configured required profile fields).
  - Password meets baseline: min 8 chars, at least one letter, at least one number.
  - `expires_at` must be exactly issuance time + 24 hours.
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
  - `expires_at` (datetime, required)
  - `used_at` (datetime, nullable)
  - `invalidated_at` (datetime, nullable)
- Validation rules:
  - Token must be unexpired and unused at verification time.
  - Any new token issuance invalidates previous active tokens for the same pending registration.
- Relationships:
  - Belongs to `PendingRegistration`.

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
   - Verification token issued.
2. Successful verification within 24h:
   - Token marked used.
   - `PendingRegistration.status`: `VERIFIED`
   - `UserAccount` created with status `ACTIVE`.
3. Token expiration before verification:
   - `PendingRegistration.status`: `EXPIRED`
   - Resend action issues a fresh token and sets status back to `PENDING_VERIFICATION`.
4. Invalid/duplicate/weak input:
   - No `UserAccount` creation.
   - Validation errors returned and user remains on registration page.
